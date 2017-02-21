/**
 * Created by s.evdokimov on 04.01.2017.
 */

import {Component, Input, Output, EventEmitter, NgZone } from '@angular/core';

import {NOTIFY_ADD, NOTIFY_SWITCH} from './actions';

@Component({
  moduleId: module.id,
  selector: 'notify-component',
  templateUrl: 'notify.component.html',
  styleUrls: ['notify.component.css']
})

export class NotifyComponent {

  // INIT

  @Output() onAction = new EventEmitter();
  @Input()
  set props(props: any) {
    if(!props) return;

    switch(props.type) {
      case NOTIFY_ADD:
        this.add(props.payload);
        break;
      case NOTIFY_SWITCH:
        this.switcher(props.payload);
        break;
    }
  }

  items: any = [];
  display: boolean = true;

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.liveCycle();
      }, 1000);
    });
  }

  // LISTENERS

  handlerClick($event: any): boolean {
    let el = $event.target;

    if(el.tagName !== 'DIV') return false;
    let id: number = parseInt(el.querySelector('span').textContent);
    this.remove(id);
  }

  // METHODS

  liveCycle() {
    let now = Date.now();
    this.items = this.items.reduce(function(acc: any, item: any) {
      if(item.timeStamp > now) acc.push(item);
      return acc;
    }, []);
  }

  remove(id: number): void {
    this.items = this.items.filter(function(item: any) {
      return item.id !== id;
    });
  }

  add(data: any): boolean {
    if(!this.display) return false;

    let id = (this.items.length) ? this.items[this.items.length - 1].id + 1 : 1;
    let item = {
      id: id,
      timeStamp: Date.now() + 15000,
      message: data.message
    };

    this.items.push(item);
  }

  switcher(data: any): void {
    this.display = !data.check;
  }
}
