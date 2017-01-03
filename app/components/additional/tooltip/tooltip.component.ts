/**
 * Created by s.evdokimov on 03.01.2017.
 */

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TOOLTIP_MOVE, TOOLTIP_HIDE, TOOLTIP_SHOW} from './actions';


@Component({
  moduleId: module.id,
  selector: 'tooltip-component',
  templateUrl: 'tooltip.component.html',
  styleUrls: ['tooltip.component.css']
})

export class TooltipComponent {
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

    this.tooltip.coords.x = data.coords.x + 'px';
    this.tooltip.coords.y = data.coords.y + 'px';
    this.tooltip.active = true;
  }

  move(data: any) {
    this.tooltip.coords.x = data.coords.x + 'px';
    this.tooltip.coords.y = data.coords.y + 'px';
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

  // getX (x) {
  //   let {tooltip} = this.refs;
  //   if(tooltip) {
  //     let widthEl = tooltip.clientWidth;
  //     let widthPage = window.innerWidth < document.body.clientWidth ? window.innerWidth : document.body.clientWidth;
  //
  //     if((x + widthEl) > widthPage) {
  //       x = (x - widthEl < 0) ? 0: x - widthEl;
  //     }
  //   }
  //
  //   return x + 'px';
  // };
  //
  // getY (y) {
  //   let {tooltip} = this.refs;
  //   if(tooltip) {
  //     var heightEl = tooltip.clientHeight;
  //     var heightPage = window.innerHeight < document.body.clientHeight ? window.innerHeight : document.body.clientHeight;
  //
  //     if ((y + heightEl) > heightPage) {
  //       y = (y - heightEl < 0) ? 0 : y - heightEl;
  //     }
  //   }
  //
  //   return y + 'px';
  // };
}
