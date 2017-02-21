/**
 * Created by s.evdokimov on 26.12.2016.
 */

import {NgZone, Injectable} from '@angular/core';
import {ITimer} from '../interfaces/timer';

@Injectable()
export class TimerService {

  // INIT

  startTime: number;
  finishTime: number;
  intervalId: any;
  active: boolean = false;
  callbacks: any;

  constructor(private ngZone: NgZone) {}

  // METHODS

  init(data: ITimer, callbacks: any):void {
    this.startTime = new Date(data.start).getTime();
    this.finishTime = new Date(data.end).getTime();
    this.callbacks = callbacks;
  }

  start(): boolean {
    if(this.active === true) return false;

    this.active = true;
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {

        this.callbacks.forEach((callback: any) => {
          callback();
        });
      }, 1000);
    });
  }

  stop(): void {
    this.active = false;
    clearInterval(this.intervalId);
  }
}
