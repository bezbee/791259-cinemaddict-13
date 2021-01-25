import {createElement} from "../utils/render.js";
const SHAKE_ANIMATION_TIMEOUT = 600;


export class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error(`Cannot instantiate AbstactView, only concrete one.`);
    }
    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`AbstractView method not implemented: getTemplate`);
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

  shake() {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
