import {
  SitePresenter
} from "./presenter/site-presenter.js";
import {
  FilmsModel
} from "./model/films.js";
import {
  FilterModel
} from "./model/filter.js";
import {
  Api
} from "./api.js";
import {
  UpdateType
} from "./const.js";


const AUTHORIZATION = `Basic bb5dc8842CA31dE4603`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;
const api = new Api(END_POINT, AUTHORIZATION);

const body = document.querySelector(`body`);
const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const sitePresenter = new SitePresenter(body, filmsModel, filterModel, api);
sitePresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);

  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
