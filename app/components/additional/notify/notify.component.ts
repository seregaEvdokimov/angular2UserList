/**
 * Created by s.evdokimov on 04.01.2017.
 */

import {Component, Input, Output, EventEmitter} from '@angular/core';

import {NOTIFY_ADD} from './actions';

@Component({
  moduleId: module.id,
  selector: 'notify-component',
  templateUrl: 'notify.component.html',
  styleUrls: ['notify.component.css']
})

export class NotifyComponent {
  @Output() onAction = new EventEmitter();
  @Input()
  set props(props: any) {
    if(!props) return;

    switch(props.type) {
      case NOTIFY_ADD:
        this.add(props.payload);
        break;
    }
  }

  items: any = [];

  constructor() {
    setInterval(() => {
      this.liveCycle();
    }, 1000);
  }

  handlerClick($event: any): boolean {
    let el = $event.target;

    if(el.tagName !== 'DIV') return false;
    let id: number = parseInt(el.querySelector('span').textContent);
    this.remove(id);
  }

  liveCycle() {
    let now = Date.now();
    this.items = this.items.reduce(function(acc: any, item: any) {
      if(item.timeStamp > now) acc.push(item);
      return acc;
    }, []);
  }

  remove(id: number): void {
    this.items = this.items.reduce(function(acc: any, item: any) {
      if(item.id !== id) acc.push(item);
      return acc;
    }, []);
  }

  add(data: any): void {
    let id = (this.items.length) ? this.items[this.items.length - 1].id + 1 : 1;
    let item = {
      id: id,
      timeStamp: Date.now() + 15000,
      message: data.message
    };

    this.items.push(item);
  }
}
