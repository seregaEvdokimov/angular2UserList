/**
 * Created by s.evdokimov on 26.12.2016.
 */

import {Component, Input, Output, EventEmitter} from '@angular/core';

import {TRANSLATE} from '../../header/actions';
import {
  MODAL_EDIT_SHOW,
  MODAL_EDIT_HIDE,

  MODAL_CREATE_SHOW,
  MODAL_CREATE_HIDE,

  MODAL_UPLOAD_SHOW,
  MODAL_UPLOAD_HIDE,
  MODAL_UPLOAD_FILE,

  MODAL_CONFIRM_SHOW,
  MODAL_CONFIRM_HIDE,

  MODAL_ALL_HIDE
} from './actions';

@Component({
  selector: 'modal-component',
  template: `
    <section class="modal-bg" [ngClass]="{'modal-bg_show': active}" (click)="handlerCloseModals($event)">
      <create-modal  
        [props]="createProps"  
        (onAction)="onModalAction($event)">    
      </create-modal>
      
      <update-modal  
        [props]="updateProps"  
        (onAction)="onModalAction($event)">    
      </update-modal>
      
      <confirm-modal  
        [props]="confirmProps"  
        (onAction)="onModalAction($event)">    
      </confirm-modal>
      
      <upload-modal  
        [props]="uploadProps"  
        (onAction)="onModalAction($event)">    
      </upload-modal>
    </section>
  `,
  styles: [
    `.modal-bg {
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, .4);
      width: 100%;
      height: 100%;
      visibility: hidden;
      z-index: 3;
    }`,
    `.modal-bg_show {
      visibility: visible;
    }`
  ]
})

export class ModalComponent {

  // INIT

  @Output() onAction = new EventEmitter();
  @Input()
  set props(props: any) {
    if(!props) return;

    switch(props.type) {
      case MODAL_EDIT_SHOW:
        this.show();
        this.updateProps = props;
        break;
      case MODAL_EDIT_HIDE:
        this.updateProps = props;
        this.hide();
        break;
      case MODAL_CREATE_SHOW:
        this.show();
        this.createProps = props;
        break;
      case MODAL_CREATE_HIDE:
        this.createProps = props;
        this.hide();
        break;
      case MODAL_UPLOAD_SHOW:
        this.uploadProps = props;
        break;
      case MODAL_UPLOAD_HIDE:
        this.uploadProps = {type: MODAL_UPLOAD_HIDE};
        switch(props.payload.entity) {
          case 'create':
            this.createProps = {
              type: MODAL_UPLOAD_FILE,
              payload: props.payload
            };
            break;
          case 'update':
            this.updateProps = {
              type: MODAL_UPLOAD_FILE,
              payload: props.payload
            };
            break;
        }
        break;
      case MODAL_CONFIRM_SHOW:
        this.confirmProps = props;
        break;
      case MODAL_CONFIRM_HIDE:
        this.confirmProps = {type: MODAL_CONFIRM_HIDE};
        this.updateProps = {type: MODAL_EDIT_HIDE};
        this.hide();
            break;
      case MODAL_ALL_HIDE:
        this.createProps = {type: MODAL_CREATE_HIDE};
        this.updateProps = {type: MODAL_EDIT_HIDE};
        this.confirmProps = {type: MODAL_CONFIRM_HIDE};
        this.uploadProps = {type: MODAL_UPLOAD_HIDE};
        this.hide();
        break;
      case TRANSLATE:
        this.createProps = {type: TRANSLATE};
        this.updateProps = {type: TRANSLATE};
        this.confirmProps = {type: TRANSLATE};
        this.uploadProps = {type: TRANSLATE};
        break;
    }
  }

  createProps: any;
  uploadProps: any;
  updateProps: any;
  confirmProps: any;
  active: boolean = false;

  constructor() {}

  // LISTENERS

  handlerCloseModals($event: any) {
    let el = $event.target;
    if(el.tagName === 'SECTION') this.onAction.emit({type: MODAL_ALL_HIDE});
  }

  // METHODS

  onModalAction(params: any) {
    this.onAction.emit(params);
  }

  show() {
    this.active = true;
  }

  hide() {
    this.active = false;
  }
}
