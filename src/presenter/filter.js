import {
  FilterView
} from "../view/filter-view.js";
import {
  render,
  replace,
  remove
} from "../utils/render.js";
import {
  filter
} from "../utils/filter.js";
import {
  FilterType,
  UpdateType,
  MenuStats
} from "../const.js";

export class FilterPresenter {
  constructor(filterContainer, filterModel, filmsModel, changeMenuState) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._changeMenuState = changeMenuState;
    this._filmsModel = filmsModel;
    this._currentFilter = null;
    this._currentStatusPage = MenuStats.FILMS;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleStatsClick = this._handleStatsClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter, this._currentStatusPage);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._filterComponent.setStatsClickHandler(this._handleStatsClick);


    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, `afterbegin`);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    this._changeMenuState(MenuStats.FILMS);
    this._currentStatusPage = MenuStats.FILMS;
    this.init();
  }

  _handleStatsClick() {
    this._changeMenuState(MenuStats.STATISTICS);
    this._currentStatusPage = MenuStats.STATISTICS;

    this.init();
    this._currentFilter = null;
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();
    return [{
      type: FilterType.ALL,
      name: `All Movies`,
      count: filter[FilterType.ALL](films).length
    },
    {
      type: FilterType.WATCHLIST,
      name: `Watchlist`,
      count: filter[FilterType.WATCHLIST](films).length
    },
    {
      type: FilterType.HISTORY,
      name: `History`,
      count: filter[FilterType.HISTORY](films).length
    },
    {
      type: FilterType.FAVORITES,
      name: `Favorites`,
      count: filter[FilterType.FAVORITES](films).length
    },
    ];
  }
}
