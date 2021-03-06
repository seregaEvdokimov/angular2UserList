/**
 * Created by s.evdokimov on 26.12.2016.
 */

import {Injectable} from '@angular/core';

import {ITimer} from '../interfaces/timer';

import {TimerService} from './timer.service';

@Injectable()
export class ProgressBarService {

  // INIT

  element: HTMLElement;
  startTime: number;
  finishTime: number;
  className: string;
  percent: number = null;

  constructor(private timer: TimerService) {}

  // METHODS

  init(data: ITimer, element: HTMLElement, callback: any): void {
    this.startTime = new Date(data.start).getTime();
    this.finishTime = new Date(data.end).getTime();
    this.element = element;

    this.timer.init(data, [this.tick.bind(this), callback]);
  }

  start(): void {
    this.timer.start();
  }

  stop(): void {
    this.timer.stop();
  }

  tick(): void {
    this.progressCalc();
    this.showProgress();
  }

  update(data: ITimer): void {
    this.startTime = new Date(data.start).getTime();
    this.finishTime = new Date(data.end).getTime();
    this.progressCalc();
  }

  progressCalc(): void {
    let difference = this.finishTime - this.startTime;
    let current = Date.now() - this.startTime;
    this.percent = current * 100 / difference;

    this.className = (this.percent >= 0 && this.percent <= 100) ? 'positive': 'negative';
    this.percent = (this.percent >= 0 && this.percent <= 100) ? this.percent : 100;
  };

  showProgress(): void {
    this.className == 'positive' ? this.element.classList.remove('negative') : this.element.classList.remove('positive');

    this.element.style.width = this.percent + '%';
    this.element.classList.add(this.className);
  };
}
