/**
 * Created by s.evdokimov on 23.12.2016.
 */

import {Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit} from '@angular/core';

import {DictionaryService} from '../../assets/services/dictionary.service'


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
      case 'TRANSLATE':
        this.heighlight();
        this.translate();
        break;
    }
  }

  ru: boolean = true;
  en: boolean = false;

  constructor(private dictionary: DictionaryService) {}

  ngAfterViewInit() {
    this.translate();
  }

  handlerChangeLanguage($event: any): boolean {
    let el = $event.target;
    if(el.tagName !== 'A') return false;

    let langCode = el.dataset.language;
    this.onAction.emit({
      type: 'TRANSLATE',
      payload: {langCode: langCode}
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
    this.TNotifySwitch.nativeElement.textContent = this.dictionary.t(['header', 'settings', 'label']);
    this.TSearchBtn.nativeElement.textContent = this.dictionary.t(['header', 'search', 'button']);
  }
}
