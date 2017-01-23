/**
 * Created by s.evdokimov on 19.01.2017.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class ResizeServices {

  // INIT

  area: HTMLElement = null;
  image: HTMLElement = null;
  event_state: any = {};

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
    this.area.style.left = '0';
    this.area.style.top = '0';

    this.area.addEventListener('mousedown', this.startResize.bind(this));
  }

  moving(e: any) {
    let left = e.offsetX + 3;
    let top = e.offsetY + 3;

    let areaWidth: number = (this.area.style.width) ? parseInt(this.area.style.width.slice(0, -2)) : 135;
    let areaHeight: number = (this.area.style.height) ? parseInt(this.area.style.height.slice(0, -2)) : 195;

    let widthContainer = this.image.clientWidth;
    let heightContainer = this.image.clientHeight;

    left = ((areaWidth + left) > widthContainer) ? widthContainer - areaWidth: (left < 0) ? 0: left;
    top = ((areaHeight + top) > heightContainer) ? heightContainer - areaHeight: (top < 0) ? 0: top;

    this.area.style.left = left + 'px';
    this.area.style.top = top + 'px';
  }

  saveEventState(e: any) {
    this.event_state.mouse_x = e.clientX;
    this.event_state.mouse_y = e.clientY;
    this.event_state.evnt = e;
  }

  resizing(newEvent: any) {
    let width: number = (this.area.style.width) ? parseInt(this.area.style.width.slice(0, -2)) : 135;
    let height: number = (this.area.style.height) ? parseInt(this.area.style.height.slice(0, -2)) : 195;

    let widthContainer = this.image.clientWidth;
    let heightContainer = this.image.clientHeight;

    let oldEvent: any = this.event_state.evnt;
    let target: any = oldEvent.target;

    let wDirection: string;
    let hDirection: string;

    switch(target.classList[1]) {
      case 'resize-handle-n':
        hDirection = (newEvent.clientY < oldEvent.clientY) ? 'positive' : 'negative';
        break;
      case 'resize-handle-s':
        hDirection = (newEvent.clientY > oldEvent.clientY) ? 'positive' : 'negative';
        break;
      case 'resize-handle-w':
        wDirection = (newEvent.clientX < oldEvent.clientX) ? 'positive' : 'negative';
        break;
      case 'resize-handle-e':
        wDirection = (newEvent.clientX > oldEvent.clientX) ? 'positive' : 'negative';
        break;
      case 'resize-handle-ne':
        wDirection = (newEvent.clientX > oldEvent.clientX) ? 'positive' : 'negative';
        hDirection = (newEvent.clientY < oldEvent.clientY) ? 'positive' : 'negative';
        break;
      case 'resize-handle-nw':
        wDirection = (newEvent.clientX < oldEvent.clientX) ? 'positive' : 'negative';
        hDirection = (newEvent.clientY < oldEvent.clientY) ? 'positive' : 'negative';
        break;
      case 'resize-handle-se':
        wDirection = (newEvent.clientX > oldEvent.clientX) ? 'positive' : 'negative';
        hDirection = (newEvent.clientY > oldEvent.clientY) ? 'positive' : 'negative';
        break;
      case 'resize-handle-sw':
        wDirection = (newEvent.clientX < oldEvent.clientX) ? 'positive' : 'negative';
        hDirection = (newEvent.clientY > oldEvent.clientY) ? 'positive' : 'negative';
        break;
    }

    (wDirection === 'negative') ? --width: (wDirection === 'positive') ? ++width: false;
    (hDirection === 'negative') ? --height: (hDirection === 'positive') ? ++height: false;

    width = (width > widthContainer) ? widthContainer: (width < 100) ? 100 : width;
    height = (height > heightContainer) ? heightContainer: (height < 150) ? 150 : height;

    this.area.style.width = width + 'px';
    this.area.style.height = height + 'px';
  }

  crop() {
    if(!this.image) return false;

    let crop_canvas: any,
      left = (this.area.style.left) ? parseInt(this.area.style.left.slice(0, -2)) : 0,
      top = (this.area.style.top) ? parseInt(this.area.style.top.slice(0, -2)) : 0,
      width = (this.area.style.width) ? parseInt(this.area.style.width.slice(0, -2)) : 135,
      height = (this.area.style.height) ? parseInt(this.area.style.height.slice(0, -2)) : 195;

    crop_canvas = document.createElement('canvas');
    crop_canvas.width = width;
    crop_canvas.height = height;

    crop_canvas.getContext('2d').drawImage(this.image, left, top, width, height, 0, 0, width, height);
    return crop_canvas.toDataURL("image/png");
  }

  reset() {
    this.area.style.width = '135px';
    this.area.style.height = '195px';
  }
}
