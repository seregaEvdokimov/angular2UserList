/**
 * Created by s.evdokimov on 03.01.2017.
 */

import {Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {TOOLTIP_MOVE, TOOLTIP_HIDE, TOOLTIP_SHOW} from './actions';


@Component({
  moduleId: module.id,
  selector: 'tooltip-component',
  templateUrl: 'tooltip.component.html',
  styleUrls: ['tooltip.component.css']
})

export class TooltipComponent implements  AfterViewInit{
  @ViewChild('elTooltip') elTooltip: ElementRef;

  @Output() onAction = new EventEmitter();
  @Input()
  set props(props: any) {
    if(!props) return;
    // console.log('tooltip', props);
    switch(props.type) {
      case TOOLTIP_SHOW:
        this.show(props.payload);
        break;
      case TOOLTIP_HIDE:
        this.hide(props.payload);
        break;
      case TOOLTIP_MOVE:
        this.move(props.payload);
        break;
    }
  }

  tooltip = {
    active: false,
    coords: {
      x: '',
      y: ''
    }
  };

  tooltipName = {
    active: false,
    content: {
      name: '',
      avatar: ''
    }
  };

  tooltipEmail = {
    active: false,
    content: {
      message: ''
    }
  };

  constructor() {}

  ngAfterViewInit() {
    // this.elTooltip = this.elTooltip.nativeElement;
  }

  show(data: any) {
    this.reset();
    switch(data.type) {
      case 'name':
        this.tooltipName.content.name = data.name;
        this.tooltipName.content.avatar = data.avatar;
        this.tooltipName.active = true;
        break;
      case 'email':
        this.tooltipEmail.content.message = 'количество непрочитанных сообщений ' + data.text;
        this.tooltipEmail.active = true;
        break;
    }

    this.tooltip.active = true;

    let x = this.getX(data.coords.x);
    let y = this.getY(data.coords.y);

    this.tooltip.coords.x = x;
    this.tooltip.coords.y = y;
  }

  move(data: any) {
    let x = this.getX(data.coords.x);
    let y = this.getY(data.coords.y);

    this.tooltip.coords.x = x;
    this.tooltip.coords.y = y;
  }

  hide(data: any) {
    switch(data.type) {
      case 'name':
        this.tooltipName.active = false;
        break;
      case 'email':
        this.tooltipEmail.active = false;
        break;
    }

    this.tooltip.active = false;
  }

  reset() {
    this.tooltipEmail.active = false;
    this.tooltipName.active = false;
  }


  getX (x: number): string {
    let widthEl = this.elTooltip.nativeElement.getBoundingClientRect().width;
    let widthPage = window.innerWidth < document.body.clientWidth ? window.innerWidth : document.body.clientWidth;

    if((x + widthEl) > widthPage) {
      x = (x - widthEl < 0) ? 0: x - widthEl;
    }

    return x + 'px';
  };

  getY (y: number): string {
    var heightEl = this.elTooltip.nativeElement.getBoundingClientRect().height;
    var heightPage = window.innerHeight < document.body.clientHeight ? window.innerHeight : document.body.clientHeight;

    if ((y + heightEl) > heightPage) {
      y = (y - heightEl < 0) ? 0 : y - heightEl;
    }

    return y + 'px';
  };
}
