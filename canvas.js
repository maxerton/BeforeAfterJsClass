'use strict'


class Paint {
  constructor() {
    this.canvas;
    this.lastTime = 0;
    // this.context = new CanvasRenderingContext2D();
    this.context;
    this.presd = false;
    this.initCoords = { x: 0, y: 0 };
    this.tasks = [];
    // this.currentJob = this.drawSquare;
    this.init();
  }

  get currentColor() {
    return document.getElementById('colorSelect').value;
  }

  get currentJob() {
    let data = document.querySelector('.form input[name=type]:checked').value;
    if (data === 'square') {
      return this.drawSquare;
    } else if (data === 'circle') {
      return this.drawCircle;
    } else if (data === 'romb') {
      return this.drawRomb;
    } else if (data === 'triangle') {
      return this.drawTri;
    }
  }

  setCanvas(canv) {
    const styles = getComputedStyle(canv);
    canv.setAttribute('width', styles.width.replace('px', ''));
    canv.setAttribute('height', styles.height.replace('px', ''));
    this.canvas = canv;
  }

  getPic() {
    let pic = document.getElementById('paint');
    if (pic === null) {
      alert('Області для малювання немає');
      return false;
    }

    this.setCanvas(pic);

    let picContext = pic.getContext('2d');
    if (!picContext) {
      alert('OldBrowser');
      return false;
    }

    this.context = picContext;
    return picContext;
  }

  clear() {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
  }

  render(back) {
    let t = new Date();
    if (t.getTime() > Math.floor(this.lastTime + (1 / 30) * 1000)) {
      this.clear();
      for (let i in this.tasks) {
        this.tasks[i]();
      }

      back();
      this.lastTime = t.getTime();
    }
  }

  drawSquare(x, y, w, h, c) {
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.rect(x, y, w, h);
    this.context.fillStyle = c;
    this.context.fill();
  }

  drawCircle(x, y, w, h, c) {
    let rad = Math.max(Math.abs(w), Math.abs(h));
    // CanvasRenderingContext2D.arc()
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.arc(x, y, rad, 0, 2 * Math.PI);
    this.context.fillStyle = c;
    this.context.fill();
  }
  
  drawRomb(x, y, w, h, c) {
    this.context.beginPath();
    w += x;
    h += y;
    this.context.moveTo(x + (w-x) / 2, y);
    this.context.lineTo(w, y + (h-y) / 2);
    this.context.lineTo(x + (w-x) / 2, h);
    this.context.lineTo(x, y + (h-y) / 2);
    this.context.lineTo(x + (w-x) / 2, y);
    this.context.closePath();
    this.context.fillStyle = c;
    this.context.fill();
  }
  
  drawTri(x, y, w, h, c) {
    this.context.beginPath();
    w += x;
    h += y;
    this.context.moveTo(x, y);
    this.context.lineTo(x, h);
    this.context.lineTo(w, h);
    this.context.lineTo(x, y);
    this.context.closePath();
    this.context.fillStyle = c;
    this.context.fill();
  }

  getCoords(event) {
    return { x: event.offsetX, y: event.offsetY };
  }

  getSize(event) {
    return { w: event.offsetX - this.initCoords.x, h: event.offsetY - this.initCoords.y }
  }

  mdownHandler(ev) {
    if (ev.which === 1) {
      if (this.presd) {
        this.mupHandler(ev);
      }
      this.presd = true;
      this.initCoords = this.getCoords(ev);
    }
  }

  mupHandler(ev) {
    if (ev.which === 1) {
      this.presd = false;
      const s = this.getSize(ev);
      const x = this.initCoords.x;
      const y = this.initCoords.y;
      const color = this.currentColor;
      const cj = this.currentJob.bind(this);
      if (Math.abs(s.w) * Math.abs(s.h) < 1000) {
        this.tasks.push(() => cj(x-50, y-50, 100, 100, color));
        this.render(()=>{});
      } else {
        this.tasks.push(() => cj(x, y, s.w, s.h, color));
      }
      
    }
  }

  mmoveHandler(ev) {
    if (this.presd) {
      let s = this.getSize(ev);
      const cj = this.currentJob.bind(this);
      this.render(() => cj(this.initCoords.x, this.initCoords.y, s.w, s.h, this.currentColor));
    }
  }

  cancelHandler(ev) {
    ev.preventDefault();
    this.tasks.pop();
    this.render(() => { });
  }

  init() {
    this.getPic();
    this.canvas.addEventListener('mousedown', this.mdownHandler.bind(this));
    this.canvas.addEventListener('mouseup', this.mupHandler.bind(this));
    this.canvas.addEventListener('mousemove', this.mmoveHandler.bind(this));
    this.canvas.addEventListener('contextmenu', this.cancelHandler.bind(this));
  }
}

const p = new Paint();
