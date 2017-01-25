/**
 * Created by s.evdokimov on 19.01.2017.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class ResizeServices {

  // INIT

  area: HTMLElement = null;
  image: HTMLElement = null;
  newImage: HTMLElement = null;
  event_state: any = {};
  resize_state: any = {container: {}, area: {}};

  constructor() {}

  // LISTENERS

  startResize(e: any) {
    let target: any = e.target;

    e.preventDefault();
    e.stopPropagation();
    this.saveEventState(e);

    switch (target.tagName) {
      case 'DIV':
        let moveFunc = this.moving.bind(this);

        document.addEventListener('mousemove', moveFunc);
        document.addEventListener('mouseup', this.endMoving.bind(this, moveFunc));
        break;
      case 'SPAN':
        let resizeFunc = this.resizing.bind(this);

        document.addEventListener('mousemove', resizeFunc);
        document.addEventListener('mouseup', this.endResize.bind(this, moveFunc));
        break;
    }
  }

  endResize(handler: any, e: any) {
    e.preventDefault();
    document.removeEventListener('mousemove', handler);
  }

  endMoving(handler: any, e: any) {
    e.preventDefault();
    document.removeEventListener('mousemove', handler);
  }

  // METHODS

  init(imageEl: any, areaEl: any) {

    this.image = imageEl;
    this.area = areaEl;

    this.resize_state.container = {width: this.image.clientWidth, height: this.image.clientHeight};
    this.saveResizeState();
    this.drawNewImg();

    this.area.addEventListener('mousedown', this.startResize.bind(this));
  }

  drawNewImg() {
    let resize_canvas: any = document.createElement('canvas');
    resize_canvas.width = this.resize_state.container.width;
    resize_canvas.height = this.resize_state.container.height;
    resize_canvas.getContext('2d').drawImage(this.image, 0, 0, this.resize_state.container.width, this.resize_state.container.height);

    this.newImage = document.createElement('img');
    this.newImage['src'] = resize_canvas.toDataURL("image/png");
  }

  saveResizeState() {
    this.resize_state.area = {
      width: (this.area.style.width) ? parseInt(this.area.style.width.slice(0, -2)) : 135,
      height: (this.area.style.height) ? parseInt(this.area.style.height.slice(0, -2)) : 195,
      left: (this.area.style.left) ? parseInt(this.area.style.left.slice(0, -2)) : 0,
      top: (this.area.style.top) ? parseInt(this.area.style.top.slice(0, -2)) : 0
    };
  }

  saveEventState(e: any) {
    this.event_state.mouse_x = e.clientX;
    this.event_state.mouse_y = e.clientY;
    this.event_state.evnt = e;
  }

  setAreaParams(params: any) {
    if(params.hasOwnProperty('width')) this.area.style.width = params.width + 'px';
    if(params.hasOwnProperty('height')) this.area.style.height = params.height + 'px';
    if(params.hasOwnProperty('left')) this.area.style.left = params.left + 'px';
    if(params.hasOwnProperty('top')) this.area.style.top = params.top + 'px';
  }

  moving(newEvent: any) {
    let areaWidth: number = this.resize_state.area.width;
    let areaHeight: number = this.resize_state.area.height;

    let widthContainer = this.resize_state.container.width;
    let heightContainer = this.resize_state.container.height;

    let wDirection = (newEvent.clientX > this.event_state.mouse_x) ? 'positive' : 'negative';
    let hDirection = (newEvent.clientY > this.event_state.mouse_y) ? 'positive' : 'negative';

    let left = this.resize_state.area.left;
    let top = this.resize_state.area.top;

    left = (wDirection === 'negative') ? left -= 2: (wDirection === 'positive') ? left += 2: left;
    top = (hDirection === 'negative') ? top -= 2: (hDirection === 'positive') ? top += 2: top;

    left = ((areaWidth + left) > widthContainer) ? widthContainer - areaWidth: (left < 0) ? 0: left;
    top = ((areaHeight + top) > heightContainer) ? heightContainer - areaHeight: (top < 0) ? 0: top;

    this.setAreaParams({left: left, top: top});
    this.saveResizeState();
    this.saveEventState(newEvent);
  }

  resizing(newEvent: any) {
    let width: number = this.resize_state.area.width;
    let height: number = this.resize_state.area.height;

    let left = this.resize_state.area.left;
    let top = this.resize_state.area.top;

    let widthContainer = this.resize_state.container.width;
    let heightContainer = this.resize_state.container.height;

    let target: any = this.event_state.evnt.target;

    let wDirection: string;
    let hDirection: string;

    switch(target.classList[1]) {
      case 'resize-handle-n':
        hDirection = (newEvent.clientY < this.event_state.mouse_y) ? 'positive' : 'negative';
        top -= 2;
        break;
      case 'resize-handle-s':
        hDirection = (newEvent.clientY > this.event_state.mouse_y) ? 'positive' : 'negative';
        break;
      case 'resize-handle-w':
        wDirection = (newEvent.clientX < this.event_state.mouse_x) ? 'positive' : 'negative';
        left -= 2;
        break;
      case 'resize-handle-e':
        wDirection = (newEvent.clientX > this.event_state.mouse_x) ? 'positive' : 'negative';
        break;
      case 'resize-handle-ne':
        wDirection = (newEvent.clientX > this.event_state.mouse_x) ? 'positive' : 'negative';
        hDirection = (newEvent.clientY < this.event_state.mouse_y) ? 'positive' : 'negative';
        top -= 2;
        break;
      case 'resize-handle-nw':
        wDirection = (newEvent.clientX < this.event_state.mouse_x) ? 'positive' : 'negative';
        hDirection = (newEvent.clientY < this.event_state.mouse_y) ? 'positive' : 'negative';
        top -= 2;
        left -= 2;
        break;
      case 'resize-handle-se':
        wDirection = (newEvent.clientX > this.event_state.mouse_x) ? 'positive' : 'negative';
        hDirection = (newEvent.clientY > this.event_state.mouse_y) ? 'positive' : 'negative';
        break;
      case 'resize-handle-sw':
        wDirection = (newEvent.clientX < this.event_state.mouse_x) ? 'positive' : 'negative';
        hDirection = (newEvent.clientY > this.event_state.mouse_y) ? 'positive' : 'negative';
        left -= 2;
        break;
    }

    width = (wDirection === 'negative') ? width -= 2: (wDirection === 'positive') ? width += 2: width;
    height = (hDirection === 'negative') ? height -= 2: (hDirection === 'positive') ? height += 2: height;

    width = (width > widthContainer) ? widthContainer: (width < 100) ? 100 : width;
    height = (height > heightContainer) ? heightContainer: (height < 150) ? 150 : height;

    this.setAreaParams({width: width, height: height, left: left, top: top});
    this.saveResizeState();
    this.saveEventState(newEvent);
  }

  crop() {
    if(!this.image) return false;

    let crop_canvas: any,
      left = this.resize_state.area.left,
      top = this.resize_state.area.top,
      width = this.resize_state.area.width,
      height = this.resize_state.area.height;

    crop_canvas = document.createElement('canvas');
    crop_canvas.width = width;
    crop_canvas.height = height;

    crop_canvas.getContext('2d').drawImage(this.newImage, left, top, width, height, 0, 0, width, height);
    return crop_canvas.toDataURL("image/png");
  }

  reset() {
    this.area.style.left = '0';
    this.area.style.top = '0';
    this.area.style.width = '135px';
    this.area.style.height = '195px';

    this.image.setAttribute('src', '');
  }
}
