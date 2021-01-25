import {AbstractView} from "./abstract.js";
import {MenuStats} from "../const.js";

const createFilterItemTemplate = (filter, currentFilterType, currentStatusPage) => {
  const {type, name, count} = filter;
  return `<a href="#${type}" data-filter-type=${type} class="main-navigation__item ${type === currentFilterType && currentStatusPage === MenuStats.FILMS ? `main-navigation__item--active` : ``}">${name}${type !== `all` ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>`;
};

const createFilterTemplate = (filterItems, currentFilterType, currentStatusPage) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType, currentStatusPage)).join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${currentStatusPage === MenuStats.STATISTICS ? `main-navigation__additional--active` : ``}">Stats</a>
  </nav>`;
};


export class FilterView extends AbstractView {
  constructor(filters, currentFilterType, currentStatusPage) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._currentStatusPage = currentStatusPage;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter, this._currentStatusPage);
  }

  _filterTypeChangeHandler(evt) {

    if (!evt.target.hasAttribute(`data-filter-type`)) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick(evt);
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement().querySelector(`[href="#stats"]`).addEventListener(`click`, this._statsClickHandler);
  }
}
