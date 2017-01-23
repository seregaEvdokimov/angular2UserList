/**
 * Created by s.evdokimov on 19.01.2017.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class ResizeServices {

  // INIT

  area: HTMLElement = null;
  image: HTMLElement = null;
  // event_state: any;
  // resize_canvas: any;

  constructor() {}

  // LISTENERS

  startResize(e: any) {
    e.preventDefault();
    e.stopPropagation();

    let moveFunc = this.moving.bind(this);
    document.addEventListener('mousemove', moveFunc);
    document.addEventListener('mouseup', this.endMoving.bind(this, moveFunc));
  }

  // endResize(handler: any, e: any) {
  //   e.preventDefault();
  //   document.removeEventListener('mousemove', handler);
  // }

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
    let left = (e.offsetX + 10) + 'px';
    let top = (e.offsetY + 10) + 'px';

    this.area.style.left = left;
    this.area.style.top = top;
  }

  // saveEventState(e: any) {
  //
  //   this.event_state.container_width = this.area.clientWidth;
  //   this.event_state.container_height = this.area.clientHeight;
  //   this.event_state.container_left = this.area.offsetLeft;
  //   this.event_state.container_top = this.area.offsetTop;
  //
  //   this.event_state.mouse_x = e.clientX;
  //   this.event_state.mouse_y = e.clientY;
  //   this.event_state.evnt = e;
  // }

  // resizing(e: any) {
    // let width: number, height: number, target: any = this.event_state.evnt.target;
    //
    // switch(target.classList[1]) {
    //   case 'resize-handle-nw':
    //     width = this.event_state.container_width - (e.clientX - this.event_state.container_left);
    //     height = this.event_state.container_height - (e.clientY - this.event_state.container_top);
    //     break;
    //   case 'resize-handle-ne':
    //     width = e.clientX - this.event_state.container_left;
    //     height = this.event_state.container_height - (e.clientY - this.event_state.container_top);
    //     break;
    //   case 'resize-handle-se':
    //     width = e.clientX - this.event_state.container_left;
    //     height = e.clientY - this.event_state.container_top;
    //     break;
    //   case 'resize-handle-sw':
    //     width = this.event_state.container_width - (e.clientX - this.event_state.container_left);
    //     height = e.clientY - this.event_state.container_top;
    //     break;
    // }
    //
    // this.resizeImage(width, height);
  // }

  // resizeImage(width: number, height: number) {
  //   this.resize_canvas.width = width;
  //   this.resize_canvas.height = height;
  //   this.resize_canvas.getContext('2d').drawImage(this.imageNew, 0, 0, width, height);
  //
  //   let res = this.resize_canvas.toDataURL("image/png");
  //   this.imageNew.setAttribute('src', res);
  //   this.callback(res);
  // }

  crop() {
    if(!this.image) return false;

    let leftOffset: number = (this.area.style.left) ? parseInt(this.area.style.left.slice(0, -2)) : 0;
    let topOffset: number = (this.area.style.top) ? parseInt(this.area.style.top.slice(0, -2)) : 0;

    let crop_canvas: any,
      left = leftOffset,
      top = topOffset,
      width = this.area.getBoundingClientRect().width,
      height = this.area.getBoundingClientRect().height;

    crop_canvas = document.createElement('canvas');
    crop_canvas.width = width;
    crop_canvas.height = height;

    crop_canvas.getContext('2d').drawImage(this.image, left, top, width, height, 0, 0, width, height);
    return crop_canvas.toDataURL("image/png");
  }
}
