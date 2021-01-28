import {AbstractView} from "./abstract-view.js";
const createLoadMoreButtonTemplate = () => `<button class="films-list__show-more">Show more</button>`;

export class LoadMoreButtonView extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
