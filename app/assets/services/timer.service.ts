/**
 * Created by s.evdokimov on 26.12.2016.
 */

import {ITimer} from '../interfaces/timer';

export class TimerService {
  startTime: number;
  finishTime: number;
  intervalId: any;
  active: boolean = false;
  callback: any;

  constructor() {}

  init(data: ITimer, callback: any):void {
    this.startTime = new Date(data.start).getTime();
    this.finishTime = new Date(data.end).getTime();
    this.callback = callback;
  }

  start(): boolean {
    if(this.active === true) return false;

    this.active = true;
    this.intervalId = setInterval(() => this.callback(), 1000);
  }

  stop(): void {
    this.active = false;
    clearInterval(this.intervalId);
  }
}
