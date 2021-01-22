import {
  SmartView
} from "./smart.js";
import dayjs from "dayjs";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  StatsPeriods
} from "../const.js";
import {
  getRank
} from "../utils/common.js";
import {
  filter
} from "../utils/filter.js";
import * as isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);


const BAR_HEIGHT = 50;

const getAllGenres = (watchedFilms) => {
  let allGenres = [];
  for (let film of watchedFilms) {
    allGenres = allGenres.concat(film.genre);
  }

  return allGenres
    .map((genre) => {
      return {
        count: 1,
        genre
      };
    })
    .reduce((a, b) => {
      a[b.genre] = (a[b.genre] || 0) + b.count;
      return a;
    }, {});
};

const getTotalDuration = (watchedFilms) => {

  let allDurations = [];
  for (let film of watchedFilms) {
    allDurations = allDurations.concat(film.runtime);
  }
  let result = allDurations.reduce((sum, current) => sum + current);
  const hours = Math.floor(result / 60);
  const minutes = result % 60;
  return {
    hours,
    minutes,
  };
};

const getTopGenre = (films) => {

  const data = getAllGenres(films);
  let dataCount = Object.values(data);
  const maxCount = Math.max(...dataCount);

  for (let film in data) {
    if (data[film] === maxCount) {
      return film;
    }
  }

};


const renderChart = (statisticCtx, films) => {
  const chartDataGenres = Object.keys(getAllGenres(films));
  const chartDataCount = Object.values(getAllGenres(films));

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartDataGenres,
      datasets: [{
        data: chartDataCount,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,

      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatsTemplate = (films, data) => {
  const {
    watchedFilms,
    checkedItem
  } = data;

  return `<section class="statistic">
  ${(watchedFilms) ? `
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getRank(films)}</span>
    </p>` : ``}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${checkedItem === `all-time` ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${checkedItem === `today` ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${checkedItem === `week` ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${checkedItem === `month` ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${checkedItem === `year` ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilms.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${getTotalDuration(watchedFilms).hours}<span class="statistic__item-description">h</span>${getTotalDuration(watchedFilms).minutes}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${getTopGenre(watchedFilms) ? getTopGenre(watchedFilms) : ``}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export class StatsView extends SmartView {
  constructor(films) {
    super();
    this._films = films;
    this._watchedFilms = filter[`history`](films);

    this._data = {
      watchedFilms: this._watchedFilms,
      checkedItem: `all-time`,
    };

    this._handlePeriodChange = this._handlePeriodChange.bind(this);
    this._setChart();
  }

  getTemplate() {
    return createStatsTemplate(this._films, this._data);
  }

  _handlePeriodChange(evt) {
    evt.preventDefault();
    switch (evt.target.value) {
      case StatsPeriods.ALL_TIME:
        this.updateData({
          watchedFilms: this._watchedFilms,
          checkedItem: `all-time`,
        });
        break;

      case StatsPeriods.TODAY:
        this.updateData({
          watchedFilms: this._watchedFilms.filter((film) => {
            const startDate = dayjs().startOf(`day`);
            return dayjs(film.watchingDate).isBetween(startDate, dayjs());
          }),
          checkedItem: `today`,
        });
        break;
      case StatsPeriods.WEEK:
        this.updateData({
          watchedFilms: this._watchedFilms.filter((film) => {
            const startDate = dayjs().startOf(`day`).subtract(1, `week`);
            return dayjs(film.watchingDate).isBetween(startDate, dayjs());
          }),
          checkedItem: `week`,
        });
        break;
      case StatsPeriods.MONTH:
        this.updateData({
          watchedFilms: this._watchedFilms.filter((film) => {
            const startDate = dayjs().startOf(`day`).subtract(1, `month`);
            return dayjs(film.watchingDate).isBetween(startDate, dayjs());
          }),
          checkedItem: `month`,
        });
        break;
      case StatsPeriods.YEAR:
        this.updateData({
          watchedFilms: this._watchedFilms.filter((film) => {
            const startDate = dayjs().startOf(`day`).subtract(1, `year`);
            return dayjs(film.watchingDate).isBetween(startDate, dayjs());
          }),
          checkedItem: `year`,
        });
        break;

    }
  }

  updateData(update) {
    this._data = update;
    this.updateElement();
    this._setChart();
  }

  restoreHandlers() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._handlePeriodChange);
  }

  _setChart() {
    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
    statisticCtx.height = BAR_HEIGHT * Object.keys(getAllGenres(this._data.watchedFilms)).length;

    renderChart(statisticCtx, this._data.watchedFilms);
  }
}
