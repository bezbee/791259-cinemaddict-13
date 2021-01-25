import {
  Observer
} from "../utils/observer.js";


export class FilmsModel extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);
    if (index === -1) {
      throw new Error(`Cannot update unexisting film.`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign({},
        film,
        film.film_info,
        film.user_details,
        {
          isWatched: film.user_details.already_watched,
          isFavorite: film.user_details.favorite,
          isAddedtoWatchList: film.user_details.watchlist,
          watchingDate: film.user_details.watching_date,
          ageRestriction: film.film_info.age_rating,
          alternativeTitle: film.film_info.alternative_title,
          country: film.film_info.release.release_country,
          productionDate: film.film_info.release.date,
          rating: film.film_info.total_rating,
        }
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;
    delete adaptedFilm.already_watched;
    delete adaptedFilm.favorite;
    delete adaptedFilm.watchlist;
    delete adaptedFilm.watching_date;
    delete adaptedFilm.age_rating;
    delete adaptedFilm.alternative_title;
    delete adaptedFilm.release;
    delete adaptedFilm.total_rating;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    return {
      'comments': film.comments,
      'film_info': {
        'title': film.title,
        'alternative_title': film.alternativeTitle,
        'total_rating': film.rating,
        'poster': film.poster,
        "age_rating": film.ageRestriction,
        'director': film.director,
        'writers': film.writers,
        'actors': film.actors,
        'release': {
          'date': film.productionDate,
          'release_country': film.country,
        },
        'runtime': film.runtime,
        'genre': film.genre,
        'description': film.description,
      },
      'user_details': {
        'watchlist': film.isAddedtoWatchList,
        'already_watched': film.isWatched,
        'watching_date': film.watchingDate !== null ? new Date(film.watchingDate).toISOString() : null,
        'favorite': film.isFavorite,
      },
    };

  }
}
