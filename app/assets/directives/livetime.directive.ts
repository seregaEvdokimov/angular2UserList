/**
 * Created by s.evdokimov on 26.12.2016.
 */
import {Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import {TimerService} from '../services/timer.service';
import {ProgressBarService} from '../services/progressbar.service';


@Directive({
  selector: '[livetime]',
  providers: [ProgressBarService]
})

export class LivetimeDirective implements OnInit, OnDestroy {
  timer: TimerService;
  @Input() startDate: string;
  @Input() finishDate: string;
  @Input() counterTag: HTMLElement;
  @Input() progressBarTag: HTMLElement;

  constructor(el: ElementRef, public progress: ProgressBarService) {
    this.timer = new TimerService();
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.stop();
  }

  init() {
    let startDate = this.startDate;
    let finishDate = this.finishDate;

    this.timer.init({start: startDate, end: finishDate}, this.showLiveTime.bind(this));
    this.progress.init({start: startDate, end: finishDate}, this.progressBarTag);

    this.start();
  }

  start() {
    this.timer.start();
    this.progress.start();
  }

  stop() {
    this.timer.stop();
    this.progress.stop();
  }

  showLiveTime() {
    this.counterTag.textContent = this.parseDate();
  }

  parseDate():string {
    let currentDate = new Date().getTime();
    let endTime = new Date(this.finishDate).getTime();

    let difference = endTime - currentDate;
    let time =  difference / 1000; // to second

    let seconds = Math.floor(time % 60);
    time = time / 60;

    let minutes = Math.floor(time % 60);
    time = time / 60;

    let hours = Math.floor(time % 24);
    time = time / 24;

    let days = Math.floor(time % 30);
    time = time / 30;

    let month = Math.floor(time % 12);
    let years = Math.floor(time / 12);

    let timeLeft = {
      years: years,
      months: month,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };

    let dateString = '';
    for (var key in timeLeft) {
      dateString += key + ': ' + timeLeft[key] + ', ';
    }

    return dateString;
  }
}
