import {MainView} from "../view/main-section.js";
import {HeaderView} from "../view/header.js";
import {FooterView} from "../view/footer.js";
import {UserView} from "../view/user.js";
import {FilterView} from "../view/filter.js";
import {SortView} from "../view/sort.js";
import {FilmsContainerView} from "../view/films-container.js";
import {FilmPresenter} from "./film-presenter.js";

import {LoadMoreButtonView} from "../view/button.js";
import {FooterStatsView} from "../view/footer-stats.js";

import {FilmListContainerView} from "../view/films-list-container.js";
import {NoFilmsView} from "../view/no-films.js";


import {render, remove} from "../utils/render.js";
import {SortType, UpdateType, UserAction} from "../const.js";
const FILM_COUNT_PER_STEP = 5;
import dayjs from "dayjs";

export class SitePresenter {
  constructor(bodyContainer, filters, filmsModel) {
    this._filmsModel = filmsModel;
    this._bodyContainer = bodyContainer;
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    this._filters = filters.slice();
    this._filmPresenter = {};

    this._headerComponent = new HeaderView();
    this._mainComponent = new MainView();
    this._footerComponent = new FooterView();

    this._userComponent = new UserView();
    this._filterComponent = new FilterView(this._filters);
    this._sortComponent = null;
    this._currentSortType = SortType.DEFAULT;
    this._filmsContainerComponent = new FilmsContainerView();
    this._noFilmsComponent = new NoFilmsView();

    this._filmsListContainer = new FilmListContainerView().getElement().querySelector(`.films-list__container`);
    this._loadMoreButtonComponent = null;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleFilmEvent = this._handleFilmEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._filmsModel.addObserver(this._handleFilmEvent);
  }

  init() {

    render(this._bodyContainer, this._headerComponent);
    render(this._headerComponent, this._userComponent);
    render(this._bodyContainer, this._mainComponent);
    render(this._mainComponent, this._filterComponent);
    render(this._mainComponent, this._filmsContainerComponent);
    render(this._bodyContainer, this._footerComponent);

    this._renderBoard();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort((filmA, filmB) => dayjs(filmB.productionDate).format(`YYYY`) - dayjs(filmA.productionDate).format(`YYYY`));
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort((filmA, filmB) => filmB.rating - filmA.rating);
    }
    return this._filmsModel.getFilms();
  }

  _handleViewAction(actionType, updateType, update) {
    if (actionType !== UserAction.UPDATE_FILM) {
      return;
    }
    this._filmsModel.updateFilm(updateType, update);
  }

  _handleFilmEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _renderFilm(filmListContainer, film) {
    const filmPresenter = new FilmPresenter(this._bodyContainer, filmListContainer, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _clearBoard({resetSortType = false} = {}) {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._footerStatsComponent);
    remove(this._loadMoreButtonComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(this._filmsListContainer, film));
  }

  _handleLoadMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);
    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedFilmCount;

    if (this._renderedFilmsCount >= filmCount) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }
    this._loadMoreButtonComponent = new LoadMoreButtonView();
    render(this._filmsListContainer, this._loadMoreButtonComponent, `afterend`);
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderNoFilms() {
    render(this._filmsContainerComponent, this._noFilmsComponent);
  }

  _renderFooterStats() {
    const filmCount = this._getFilms().length;
    this._footerStatsComponent = new FooterStatsView(filmCount);
    render(this._footerComponent, this._footerStatsComponent);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._filterComponent, this._sortComponent, `afterend`);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderBoard() {
    const films = this._getFilms();
    const filmCount = films.length;

    if (filmCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    render(this._filmsContainerComponent, this._filmsListContainer);
    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmsCount)));


    if (filmCount > this._renderedFilmsCount) {
      this._renderLoadMoreButton();
    }

    this._renderFooterStats();
  }
}
