import {
  SmartView
} from "./smart.js";

const createNewCommentTemplate = () => {

  return `<div class="film-details__new-comment">
  <div class="film-details__add-emoji-label"></div>

  <label class="film-details__comment-label">
    <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" type="submit"></textarea>
  </label>

  <div class="film-details__emoji-list">
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
    <label class="film-details__emoji-label" for="emoji-smile">
      <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji" data-value="smile">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
    <label class="film-details__emoji-label" for="emoji-sleeping">
      <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji" data-value="sleeping">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
    <label class="film-details__emoji-label" for="emoji-puke">
      <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji" data-value="puke">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
    <label class="film-details__emoji-label" for="emoji-angry">
      <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji" data-value="angry">
    </label>
  </div>
</div>`;
};

export class NewCommentView extends SmartView {
  constructor() {
    super();

    this._commentEmotion = null;
    this._commentText = null;
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._textAreaClickHandler = this._textAreaClickHandler.bind(this);
    this.restoreHandlers = this.restoreHandlers.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);


  }
  getTemplate() {
    return createNewCommentTemplate();
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    this._commentEmotion = evt.target.value;
    const emojiContainer = document.querySelector(`.film-details__add-emoji-label`);
    emojiContainer.innerHTML = ``;
    emojiContainer.insertAdjacentHTML(`beforeend`, `<img src="images/emoji/${evt.target.value}.png" width="55" height="55" alt="emoji-${evt.target.value}">`);
  }

  _textAreaClickHandler(evt) {
    evt.preventDefault();
    this._commentText = evt.target.value;
  }

  updateData() {
    this.updateElement();
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`textarea`).addEventListener(`change`, this._textAreaClickHandler);
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiClickHandler);
    this.getElement().addEventListener(`keydown`, this._formSubmitHandler);
    this.getElement().querySelector(`textarea`).addEventListener(`change`, this._textAreaClickHandler);

  }

  disableForm() {
    this.getElement().querySelector(`textarea`).setAttribute(`disable`, ``);
    this.getElement().querySelectorAll(`input`).forEach((el) => el.setAttribute(`disable`, ``));
  }

  enableForm() {
    this.getElement().querySelector(`textarea`).removeAttribute(`disable`);
    this.getElement().querySelectorAll(`input`).forEach((el) => el.removeAttribute(`disable`));
  }

  _formSubmitHandler(evt) {
    if (!(evt.keyCode === 13 && evt.metaKey)) { //
      return;
    }

    const newComment = {
      comment: this._commentText,
      date: new Date().toISOString(),
      emotion: this._commentEmotion,
    };


    this._callback.formSubmit(newComment);

    this._commentText = null;
    this._commentEmotion = null;

  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`keydown`, this._formSubmitHandler);
  }
}
