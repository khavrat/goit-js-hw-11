class LoadBtn {
  constructor(selector, isHidden) {
    this.button = this.getBtn(selector);

      if (!isHidden) this.hide();
  }

  getBtn(selector) {
    return document.querySelector(selector);
  }

  hide() {
    this.button.classList.add('hidden');
  }

  show() {
    this.button.classList.remove('hidden');
  }

  enable() {
    this.button.disabled = false;
  }

  disable() {
    this.button.disabled = true;
  }
}

export { LoadBtn };