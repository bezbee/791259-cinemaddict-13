import {AbstractView} from "./abstract.js";

const createFilmsListContainerTemplate = () =>
  `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
  </section>`;


export class FilmListContainerView extends AbstractView {
  getTemplate() {
    return createFilmsListContainerTemplate();
  }
}
