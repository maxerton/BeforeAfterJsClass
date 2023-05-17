'use script'


class Slider {
  constructor(elem) {
    this.elem = elem;

    this.fi;
    this.si;
    this.slider;
    this.wrap;
    this.mouseStatus = false;
    this.fullWidth = +getComputedStyle(this.elem).width.replace('px', '');

    this.init();
  }

  mdownHandler(ev) {
    if (ev.which === 1 && ev.target.matches('span')) {
      this.mouseStatus = true;
      this.slider.style.cursor = 'grabbing';
    }
  }

  mmoveHandler(ev) {
    if (this.mouseStatus && !ev.target.matches('span')) {
      let cur = Math.floor(ev.offsetX * 10000 / this.fullWidth) / 100;
      this.slider.style.left = cur + '%';
      this.wrap.style.width = cur + '%';
    }
  }

  mupHandler(ev) {
    this.mouseStatus = false;
    this.slider.style.cursor = null;
  }

  init() {
    const imgs = this.elem.querySelectorAll('img');
    this.fi = imgs[0];
    this.si = imgs[1];
    this.fi.classList.add('first-picture');
    this.si.classList.add('last-picture');
    this.wrap = document.createElement('div');
    this.elem.insertAdjacentElement('afterbegin', this.wrap);
    this.wrap.insertAdjacentElement('afterbegin', this.fi);
    this.wrap.style.width = '50%'
    this.slider = document.createElement('span');
    this.elem.insertAdjacentElement('beforeend', this.slider);
    this.elem.addEventListener('mousedown', this.mdownHandler.bind(this));
    this.elem.addEventListener('mouseup', this.mupHandler.bind(this));
    this.elem.addEventListener('mousemove', this.mmoveHandler.bind(this));
  }
}

const slidersClasses = [];
const sliders = document.querySelectorAll('.wrapper .slider').forEach(el => slidersClasses.push(new Slider(el)));
