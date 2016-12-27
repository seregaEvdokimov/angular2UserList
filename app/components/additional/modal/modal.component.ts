/**
 * Created by s.evdokimov on 26.12.2016.
 */

import {Component, Injectable, Input} from '@angular/core';

import {IModal} from '../../../assets/interfaces/modal';
import {IUser} from '../../../assets/interfaces/user';

@Injectable()
@Component({
  moduleId: module.id,
  selector: 'modal-component',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css']
})

export class ModalComponent {
  @Input()
  set action(params: any) {
    if(!params) return false;

    this.currentModal = params.type;
    switch(params.action) {
      case 'show':
        this.show(params.type);
        break;
      case 'hide':
        this.hide(params.type);
        break;
    }
  }

  currentModal: string;
  globalModal: IModal = {
    active: false
  };

  createModal: IModal = {
    active: false
  };

  editModal: IModal = {
    active: false
  };

  confirmModal: IModal = {
    active: false
  };

  constructor() {}

  show(type: string): void {
    let modal = this.getModal(type);

    this.globalModal.active = true;
    modal.active = true;
  }

  beforeShow(): void {

  }

  hide(type?: string): void {
    let modal = this.getModal(type || this.currentModal);

    modal.active = false;
    this.globalModal.active = false;
  }

  beforeHide(): void {
    this.hide();
  }

  getModal(type: string): IModal {
    switch(type) {
      case 'create':
        return this.createModal;
      case 'edit':
        return this.editModal;
      case 'confirm':
        return this.confirmModal;
    }
  }

  save(): void {
    this.hide();
  }

  handlerControls($event: any): boolean {
    let el: HTMLElement = $event.target;
    if(el.tagName !== 'BUTTON') return false;

    let classes = el.classList;
    switch(classes[1]) {
      case 'add-btn':
        this.save();
        break;
      case 'cancel-btn':
        this.beforeHide();
        break;
    }
  }

  closeModals($event: any): void {
    let el: HTMLElement = $event.target;
    if(el.tagName == 'SECTION') this.beforeHide();
  }
}
