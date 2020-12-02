import {UserView} from "./view/user.js";
import {FilterView} from "./view/filter.js";
import {SortView} from "./view/sort.js"
import {PostsContainerView} from "./view/posts-container.js"
import {PostView} from "./view/post.js";
import {LoadMoreButtonView} from "./view/button.js";
import {FooterStatsView} from "./view/footer-stats.js";
import {PostDetailsView} from "./view/post-details.js";
import {PostListContainerView} from "./view/posts-list-container.js";
import {NoPostsView} from "./view/no-posts.js";
import {CommentView} from "./view/comment.js";
import {generateFilter} from "./mock/filter.js";
import {generatePost} from "./mock/post.js";
import {generateComment} from "./mock/comment.js";
import {render, RenderPosition} from "./utils.js"


const POST_COUNT_PER_STEP = 5;
const POSTS_COUNT = 20;
const NUM_OF_EXTRA_POSTS = 2;
const posts = new Array(POSTS_COUNT).fill().map(() => generatePost());
const filters = generateFilter(posts);
const body = document.querySelector(`body`);
const header = body.querySelector(`header`);
const main = body.querySelector(`main`);
const footerStats = body.querySelector(`.footer__statistics`);
const comments = new Array(5).fill().map((item, index) => generateComment(index));
const postsContainerComponent = new PostsContainerView();

render(header, new UserView().getElement());
render(main, new FilterView(filters).getElement());
render(main, new SortView().getElement());
render(main, postsContainerComponent.getElement());
render(postsContainerComponent.getElement(), new PostListContainerView(``,`visually-hidden`, 'All movies. Upcoming').getElement());
const postsContainerMain = postsContainerComponent.getElement().querySelector(`.films-list:nth-of-type(1) .films-list__container`);

const renderPost = (postListContainer, post) => {
  const postComponent = new PostView(post);
  const postDetailsComponent = new PostDetailsView(post);

  const showPostDetails = (postListContainer = body) => {
    postListContainer.classList.add(`hide-overflow`);
    render(postListContainer, postDetailsComponent.getElement());

    for (let commentId of postDetailsComponent._post.comments) {
      for(let comment of comments) {
        if (commentId == comment.id) render(postDetailsComponent.getElement().querySelector(`.film-details__comments-list`), new CommentView(comment).getElement());
      }
    }
  };

  const returnToPost = (postListContainer = body) => {
    postListContainer.classList.remove(`hide-overflow`);
    postDetailsComponent.getElement().remove();
    postDetailsComponent.removeElement();
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      returnToPost();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const postClickableItems = [`film-card__poster`, `film-card__title`, `film-card__comments`];

  postComponent.getElement().addEventListener(`click`, (event) => {
    for (let item of postClickableItems) {
      if (event.target.classList.contains(item)) {
        showPostDetails();
        document.addEventListener(`keydown`, onEscKeyDown);
      }
    }
  });

  postDetailsComponent.getElement().querySelector(`.film-details__close`).addEventListener(`click`, () => {
    returnToPost();
  });

  render(postListContainer, postComponent.getElement());
};

if (posts.length <= 0) {
  render(postsContainerMain, new NoPostsView().getElement());
  render(footerStats, new FooterStatsView(`0`).getElement());
} else {
  render(postsContainerComponent.getElement(), new PostListContainerView(`films-list--extra`, '', 'Top rated').getElement());
  render(postsContainerComponent.getElement(), new PostListContainerView(`films-list--extra`, '', 'Most commented').getElement());
  const postsContainerTopRated = postsContainerComponent.getElement().querySelector(`.films-list:nth-of-type(2) .films-list__container`);
  const postsContainerMostCommented = postsContainerComponent.getElement().querySelector(`.films-list:nth-of-type(3) .films-list__container`);

  for (let i = 0 ; i < POST_COUNT_PER_STEP; i++) {
    renderPost(postsContainerMain, posts[i]);
  }

  if (posts.length > POST_COUNT_PER_STEP) {
    let renderedPostsCount = POST_COUNT_PER_STEP;

    render(postsContainerComponent.getElement().firstElementChild, new LoadMoreButtonView().getElement());

    postsContainerComponent.getElement().addEventListener(`click`, (event) => {

      if (event.target.classList.contains(`films-list__show-more`)) {
        posts
          .slice(renderedPostsCount, renderedPostsCount + POST_COUNT_PER_STEP)
          .forEach((post) => renderPost(postsContainerMain, post));
          renderedPostsCount += POST_COUNT_PER_STEP;
      };

      if (renderedPostsCount >= posts.length) {
        event.target.remove();
        new LoadMoreButtonView().getElement().remove();
        new LoadMoreButtonView().removeElement();
      };

    });
  };

  for (let i = 0 ; i< NUM_OF_EXTRA_POSTS; i++) {
    renderPost(postsContainerTopRated, posts[i]);
    renderPost(postsContainerMostCommented, posts[i]);
  }

  render(footerStats, new FooterStatsView(`130 291`).getElement());
};
