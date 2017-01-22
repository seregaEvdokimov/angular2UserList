/**
 * Created by s.evdokimov on 19.01.2017.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class ResizeServices {

  resizeContainer: HTMLElement = null;
  resizeArea: HTMLElement = null;
  imageNew: any;
  imageTarget: any;
  event_state: any;
  resize_canvas: any;
  callback: any;

  constructor() {}

  init(imageEl: any, areaEl: any, callback: any) {
    this.resizeArea = areaEl;

    this.imageNew = new Image();
    this.imageNew.src = imageEl.src;
    this.imageTarget = imageEl;

    this.event_state = {};
    this.callback = callback;
    this.resize_canvas = document.createElement('canvas');

    this.resizeContainer = imageEl.parentNode.querySelector('.picture-resize');
    this.resizeContainer.classList.remove('picture-resize_display-none');

    this.resizeContainer.addEventListener('mousedown', this.startResize.bind(this));
  }

  startResize(e: any) {
    let target: any = e.target;

    e.preventDefault();
    e.stopPropagation();
    this.saveEventState(e);

    switch(target.tagName) {
      case 'DIV':
        let moveFunc = this.moving.bind(this);

        document.addEventListener('mousemove', moveFunc);
        document.addEventListener('mouseup', this.endMoving.bind(this, moveFunc));
        break;
      case 'SPAN':
        let resizingFunc = this.resizing.bind(this);

        document.addEventListener('mousemove', resizingFunc);
        document.addEventListener('mouseup', this.endResize.bind(this, resizingFunc));
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

  saveEventState(e: any) {
    this.event_state.container_width = this.resizeContainer.clientWidth;
    this.event_state.container_height = this.resizeContainer.clientHeight;
    this.event_state.container_left = this.resizeContainer.offsetLeft;
    this.event_state.container_top = this.resizeContainer.offsetTop;

    this.event_state.mouse_x = e.clientX;
    this.event_state.mouse_y = e.clientY;
    this.event_state.evnt = e;
  }

  moving(e: any) {
    let parent: any = this.resizeContainer.parentNode;
    let left = (e.clientX - this.event_state.container_width) + 'px';
    let top = (e.clientY - this.event_state.container_height) + 'px';

    parent.style.transform = "translate(" + left + ", " + top + ")";
  }

  resizing(e: any) {
    let width: number, height: number, target: any = this.event_state.evnt.target;

    switch(target.classList[1]) {
      case 'resize-handle-nw':
        width = this.event_state.container_width - (e.clientX - this.event_state.container_left);
        height = this.event_state.container_height - (e.clientY - this.event_state.container_top);
        break;
      case 'resize-handle-ne':
        width = e.clientX - this.event_state.container_left;
        height = this.event_state.container_height - (e.clientY - this.event_state.container_top);
        break;
      case 'resize-handle-se':
        width = e.clientX - this.event_state.container_left;
        height = e.clientY - this.event_state.container_top;
        break;
      case 'resize-handle-sw':
        width = this.event_state.container_width - (e.clientX - this.event_state.container_left);
        height = e.clientY - this.event_state.container_top;
        break;
    }

    this.resizeImage(width, height);
  }

  resizeImage(width: number, height: number) {
    this.resize_canvas.width = width;
    this.resize_canvas.height = height;
    this.resize_canvas.getContext('2d').drawImage(this.imageNew, 0, 0, width, height);

    let res = this.resize_canvas.toDataURL("image/png");
    this.imageNew.setAttribute('src', res);
    this.callback(res);
  }

  crop() {
    if(!this.resizeContainer) return false;

    let parent: any = this.resizeContainer.parentNode;
    let parentLeft: number = 0;
    let parentTop: number = 0;

    if(parent.style.transform) {
      let res: any = parent.style.transform.match(/translate\((.*?)px, (.*?)px\)/i);
      if(res) {
        parentLeft = parseInt(res[1]);
        parentTop = parseInt(res[2]);
      }
    }

    let crop_canvas: any,
        left = (parentLeft * -1) + this.resizeArea.offsetLeft,
        top = (parentTop * -1) + this.resizeArea.offsetTop,
        width = this.resizeArea.getBoundingClientRect().width,
        height = this.resizeArea.getBoundingClientRect().height;

    crop_canvas = document.createElement('canvas');
    crop_canvas.width = width;
    crop_canvas.height = height;

    crop_canvas.getContext('2d').drawImage(this.imageNew, left, top, width, height, 0, 0, width, height);
    return crop_canvas.toDataURL("image/png");
  }
}
