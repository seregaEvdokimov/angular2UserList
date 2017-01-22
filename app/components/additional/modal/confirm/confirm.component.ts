/**
 * Created by s.evdokimov on 22.01.2017.
 */

import {Component, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';

import {DictionaryService} from '../../../../assets/services/dictionary.service';

import {TRANSLATE} from '../../../header/actions';
import {USER_UPDATE} from '../../../content/user-list/actions';
import {MODAL_CONFIRM_SHOW, MODAL_CONFIRM_HIDE} from '../actions';


@Component({
  moduleId: module.id,
  selector: 'confirm-modal',
  templateUrl: 'confirm.component.html',
  styleUrls: ['confirm.component.css']
})


export class ConfirmModalComponent {
  // nodes to translate
  @ViewChild('TCaption') TCaption: ElementRef;
  @ViewChild('TSave') TSave: ElementRef;
  @ViewChild('TCancel') TCancel: ElementRef;

  @Output() onAction = new EventEmitter();
  @Input()
  set props(props: any) {
    if(!props) return;
    console.log('confirm modal', props);

    switch(props.type) {
      case TRANSLATE:
        this.translate();
        break;
      case MODAL_CONFIRM_SHOW:
        this.payload = props.payload;
        this.show();
        break;
      case MODAL_CONFIRM_HIDE:
        this.hide();
        break;
    }
  }

  active: boolean = false;
  disabled: boolean = false;
  payload: any  = null;

  constructor(private dictionary: DictionaryService) {}

  show() {
    this.active = true;
  }

  hide() {
    this.active = false;
  }


  handlerControls($event: any) {
    let el: HTMLElement = $event.target;
    if(el.tagName !== 'BUTTON') return false;

    let classes = el.classList;
    switch(classes[1]) {
      case 'ok':
        this.onAction.emit({
          type: USER_UPDATE,
          payload: {user: this.payload.model}
        });

        this.onAction.emit({type: MODAL_CONFIRM_HIDE});
        break;
      case 'cancel':
        this.onAction.emit({type: MODAL_CONFIRM_HIDE});
        break;
    }
  }

  translate() {
    this.TCaption.nativeElement.textContent = this.dictionary.t(['forms', 'confirm_message']);
    this.TSave.nativeElement.textContent    = this.dictionary.t(['forms', 'confirm_save']);
    this.TCancel.nativeElement.textContent  = this.dictionary.t(['forms', 'confirm_cancel']);
  }
}
