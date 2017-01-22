/**
 * Created by s.evdokimov on 23.12.2016.
 */

import {Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit} from '@angular/core';

import {DictionaryService} from '../../assets/services/dictionary.service'

import {TRANSLATE, SEARCH, FETCH_LOCALIZATION_STRINGS} from './actions';
import {NOTIFY_SWITCH} from '../additional/notify/actions';

@Component({
  moduleId: module.id,
  selector: 'header-component',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
})


export class HeaderComponent implements AfterViewInit{
  // nodes to translate
  @ViewChild('TNotifySwitch') TNotifySwitch: ElementRef;
  @ViewChild('TSearchBtn') TSearchBtn: ElementRef;

  @Output() onAction = new EventEmitter();
  @Input()
  set props(props: any) {
    if(!props) return;

    switch(props.type) {
      case TRANSLATE:
        this.heighlight();
        this.translate();
        break;
    }
  }

  ru: boolean = true;
  en: boolean = false;

  constructor(private dictionary: DictionaryService) {}

  ngAfterViewInit() {}

  handlerChangeLanguage($event: any): boolean {
    let el = $event.target;
    if(el.tagName !== 'A') return false;

    let lang = el.dataset.language;
    this.onAction.emit({
      type: FETCH_LOCALIZATION_STRINGS,
      payload: {lang: lang}
    });
  }

  handlerNotifySwitch($event: any) {
    let el: any = $event.target;
    this.onAction.emit({
      type: NOTIFY_SWITCH,
      payload: {check: el.checked}
    })
  }

  handlerSearch($event: any) {
    let el = $event.target;
    let input = el.previousElementSibling;
    let value = input.value;

    this.onAction.emit({
      type: SEARCH,
      payload: {search: value}
    });
  }

  heighlight(): void {
    switch(this.dictionary.currentLang) {
      case 'en':
        this.en = true;
        this.ru = false;
        break;
      case 'ru':
        this.en = false;
        this.ru = true;
        break;
    }
  }

  translate() {
    this.TNotifySwitch.nativeElement.textContent = this.dictionary.t(['content', 'header_notifySwitcher']);
    this.TSearchBtn.nativeElement.textContent = this.dictionary.t(['content', 'header_searchButton']);
  }
}
