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
  event: any;
  resize_state: any = {container: {}, area: {}};

  MIN_HEIGHT_AREA = 195;
  MIN_WIDTH_AREA = 135;

  constructor() {}

  // LISTENERS

  startResize(e: any) {
    let target: any = e.target;

    e.preventDefault();
    e.stopPropagation();

    this.event = e;
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

    let left: number = this.image.getBoundingClientRect().left;
    let top: number = this.image.getBoundingClientRect().top;
    let width: number = this.image.clientWidth;
    let height: number = this.image.clientHeight;

    this.resize_state.container = {
      width: width,
      height: height,
      left: {start: left, finish: left + width},
      top: {start: top, finish: top + height}
    };

    this.saveAreaParams();
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

  saveEventState(e: any) {
    let left = 0;
    let top = 0;

    if(e.clientX >= this.resize_state.container.left.start && e.clientX <= this.resize_state.container.left.finish) {
     left = e.clientX - this.resize_state.container.left.start;
    }

    if(e.clientY >= this.resize_state.container.top.start && e.clientY <= this.resize_state.container.top.finish) {
      top = e.clientY - this.resize_state.container.top.start;
    }

    this.event_state.mouse_x = left;
    this.event_state.mouse_y = top;
    this.event_state.evnt = e;
  }

  setAreaParams(params: any) {
    if(params.hasOwnProperty('width')) this.area.style.width = params.width + 'px';
    if(params.hasOwnProperty('height')) this.area.style.height = params.height + 'px';
    if(params.hasOwnProperty('left')) this.area.style.left = params.left + 'px';
    if(params.hasOwnProperty('top')) this.area.style.top = params.top + 'px';
    if(params.hasOwnProperty('transform')) this.area.style.transform = "translate(" + params.transform.left + "px, " + params.transform.top + "px)";

    this.saveAreaParams();
  }

  saveAreaParams() {
    let transform = {left: 0, top: 0};
    if(this.area.style.transform) {
      let res: any = this.area.style.transform.match(/translate\((.*?)px, (.*?)px\)/);
      transform.left = parseInt(res[1]);
      transform.top = parseInt(res[2]);
    }

    this.resize_state.area = {
      width: (this.area.style.width) ? parseInt(this.area.style.width.slice(0, -2)) : this.MIN_WIDTH_AREA,
      height: (this.area.style.height) ? parseInt(this.area.style.height.slice(0, -2)) : this.MIN_HEIGHT_AREA,
      left: (this.area.style.left) ? parseInt(this.area.style.left.slice(0, -2)) : 0,
      top: (this.area.style.top) ? parseInt(this.area.style.top.slice(0, -2)) : 0,
      transform: transform
    };
  }

  moving(newEvent: any) {
    let areaWidth: number = this.resize_state.area.width;
    let areaHeight: number = this.resize_state.area.height;
    let transform: any = this.resize_state.area.transform;

    let widthContainer = this.resize_state.container.width;
    let heightContainer = this.resize_state.container.height;

    let left = this.event_state.mouse_x;
    let top = this.event_state.mouse_y;

    left = ((areaWidth + left + transform.left) > widthContainer)
        ? (widthContainer - areaWidth) + transform.left
        : ((left + transform.left) < 0) ? transform.left: left;

    top = ((areaHeight + top + transform.top) > heightContainer)
        ? (heightContainer - areaHeight) + transform.top
        : ((top + transform.top) < 0) ? transform.top: top;

    this.setAreaParams({left: left, top: top, transform: {left:0, top: 0}});
    this.saveEventState(newEvent);
  }

  resizing(newEvent: any) {
    let width: number = this.resize_state.area.width;
    let height: number = this.resize_state.area.height;
    let transform: any = this.resize_state.area.transform;

    let left: number = this.resize_state.area.left;
    let maxLeft: number = this.resize_state.container.left.finish;
    let top: number = this.resize_state.area.top;
    let maxTop: number = this.resize_state.container.top.finish;

    let widthContainer = this.resize_state.container.width;
    let heightContainer = this.resize_state.container.height;

    let target: any = this.event.target;

    let x = newEvent.clientX - this.resize_state.container.left.start;
    let y = newEvent.clientY - this.resize_state.container.top.start;

    let xDifference = x - this.event_state.mouse_x;
    let yDifference = y - this.event_state.mouse_y;

    switch(target.classList[1]) {
      case 'resize-handle-e':
      case 'resize-handle-se':
      case 'resize-handle-s':
        width += xDifference;
        height += yDifference;
        break;
      case 'resize-handle-ne':
      case 'resize-handle-n':
        transform.top = (height <= this.MIN_HEIGHT_AREA) ? transform.top : transform.top + yDifference;

        width += xDifference;
        height = (height < this.MIN_HEIGHT_AREA) ? height : height + (yDifference * -1);
        break;
      case 'resize-handle-sw':
      case 'resize-handle-w':
        transform.left = (width <= this.MIN_WIDTH_AREA) ? transform.left : transform.left + xDifference;

        width = (width < this.MIN_WIDTH_AREA) ? width : width + (xDifference * -1);
        height += yDifference;
        break;
      case 'resize-handle-nw':
        transform.top = (height <= this.MIN_HEIGHT_AREA) ? transform.top : transform.top + yDifference;
        transform.left = (width <= this.MIN_WIDTH_AREA) ? transform.left : transform.left + xDifference;

        width = (width < this.MIN_WIDTH_AREA) ? width : width + (xDifference * -1);
        height = (height < this.MIN_HEIGHT_AREA) ? height : height + (yDifference * -1);
        break;
    }

    transform.top = (transform.top + top < 0) ? 0 : (transform.top + top > maxTop) ? maxTop: transform.top;
    transform.left = (transform.left + left < 0) ? 0 : (transform.left + left > maxLeft) ? maxLeft: transform.left;

    width = (width > widthContainer) ? widthContainer: (width <= this.MIN_WIDTH_AREA) ? this.MIN_WIDTH_AREA : width;
    height = (height > heightContainer) ? heightContainer: (height <= this.MIN_HEIGHT_AREA) ? this.MIN_HEIGHT_AREA : height;

    this.setAreaParams({width: width, height: height, transform: transform});
    this.saveEventState(newEvent);
  }

  crop() {
    if(!this.image) return false;

    let crop_canvas: any,
      transform: any = this.resize_state.area.transform,
      left = this.resize_state.area.left + transform.left,
      top = this.resize_state.area.top + transform.left,
      width = this.resize_state.area.width,
      height = this.resize_state.area.height;

    crop_canvas = document.createElement('canvas');
    crop_canvas.width = width;
    crop_canvas.height = height;

    crop_canvas.getContext('2d').drawImage(this.newImage, left, top, width, height, 0, 0, width, height);
    return crop_canvas.toDataURL("image/png");
  }

  reset() {
    if(this.area) {
      this.area.style.left = '0';
      this.area.style.top = '0';
      this.area.style.width = this.MIN_WIDTH_AREA + 'px';
      this.area.style.height = this.MIN_HEIGHT_AREA + 'px';
    }

    if(this.image) {
      this.image.setAttribute('src', '');
    }
  }
}
