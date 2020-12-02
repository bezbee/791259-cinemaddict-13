import {createElement} from "../utils.js";

const createFooterStatsTemplate = (count) => `<p>${count} movies inside</p>`;

export class FooterStatsView {
  constructor(count) {
    this._element = null;
    this._count = count;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._count);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
