/**
 * Created by s.evdokimov on 26.12.2016.
 */

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UploadFileService} from '../../../assets/services/uploadFile.service';

import {IModal} from '../../../assets/interfaces/modal';
import {SHOULD_UPDATE_USER, USER_CREATE, USER_UPDATE} from '../../content/user-list/actions';
import {MODAL_EDIT_SHOW, MODAL_EDIT_HIDE, MODAL_CREATE_SHOW, MODAL_CREATE_HIDE, MODAL_CONFIRM_SHOW, MODAL_ALL_HIDE} from './actions';


@Component({
  moduleId: module.id,
  selector: 'modal-component',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css'],
  providers: [UploadFileService]
})

export class ModalComponent {
  @Output() onAction = new EventEmitter();
  @Input()
  set props(props: any) {
    if(!props) return;

    switch(props.type) {
      case MODAL_EDIT_SHOW:
        this.editModal.model = props.payload.model;
        this.currentModal = this.editModal;
        this.show();
        break;
      case MODAL_EDIT_HIDE:
        this.currentModal = this.editModal;
        this.hide();
        break;
      case MODAL_CREATE_SHOW:
        this.currentModal = this.createModal;
        this.show();
        break;
      case MODAL_CREATE_HIDE:
        this.currentModal = this.createModal;
        this.hide();
        break;
      case MODAL_CONFIRM_SHOW:
        this.confirmModal.model = props.payload.model;
        this.currentModal = this.confirmModal;
        this.resetModals();
        this.show();
        break;
      case MODAL_ALL_HIDE:
        this.resetModals();
        break;
    }
  }

  currentModal: any;
  globalModal: IModal = {
    id: 'global',
    active: false
  };
  createModal: IModal = {
    id: 'create',
    active: false
  };
  editModal: IModal = {
    id: 'edit',
    active: false
  };
  confirmModal: IModal = {
    id: 'confirm',
    active: false
  };

  myForm: FormGroup;
  constructor(public uploader: UploadFileService) {
    this.myForm = new FormGroup({
      avatar: new FormControl(),
      name: new FormControl([Validators.required, Validators.pattern(/^\w+\s*\w*$/i)]),
      email: new FormControl([Validators.required, Validators.pattern(/^[\w\.]+@\w+\.\w+$/i)]),
      birth: new FormControl([Validators.required]),
      date: new FormControl([Validators.required]),
      id: new FormControl([Validators.required, Validators.pattern(/^\d+$/i)])
    });
  }

  show(): void {
    this.myForm.patchValue({
      avatar: this.currentModal.model ? this.currentModal.model.avatar : '',
      name:   this.currentModal.model ? this.currentModal.model.name : '',
      email:  this.currentModal.model ? this.currentModal.model.email : '',
      birth:  this.currentModal.model ? this.currentModal.model.birth : '',  // 2017-01-31
      date:   this.currentModal.model ? this.currentModal.model.date : '',   // 2017-01-31
      id:     this.currentModal.model ? this.currentModal.model.id : '',
    });

    this.globalModal.active = true;
    this.currentModal.active = true;
  }


  beforeHide(): void {
    if(this.currentModal.id === 'edit') {
      let value = this.myForm.value;
      value.avatar = this.avatar ? this.avatar.getAttribute('src') : value.avatar;
      this.onAction.emit({
        type: SHOULD_UPDATE_USER,
        payload: {user: value}
      });
    } else {
      this.hide();
    }
  }

  hide(): void {
    this.myForm.reset();
    this.currentModal.active = false;
    this.globalModal.active = false;
  }

  save(): void {
    let value = this.myForm.value;
    value.avatar = this.avatar ? this.avatar.getAttribute('src') : value.avatar;

    switch(this.currentModal.id) {
      case 'create':
        this.onAction.emit({
          type: USER_CREATE,
          payload: {user: value}
        });
        break;
      case 'edit':
        this.onAction.emit({
          type: USER_UPDATE,
          payload: {user: value}
        });
        break;
      case 'confirm':
        this.onAction.emit({
          type: USER_UPDATE,
          payload: {user: this.currentModal.model}
        });
        break;
    }

    this.onAction.emit({
      type: MODAL_ALL_HIDE
    });
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
      case 'ok':
        this.save();
        break;
      case 'cancel':
        this.resetModals();
        break;
    }
  }

  avatar: HTMLElement;
  handlerUploadFile($event: any, img: HTMLElement): void {
    let input: HTMLElement = $event.target;

    this.avatar = img;
    this.uploader.read(input, this.insertImage.bind(this));
  }

  insertImage(file: string): void {
    this.avatar.setAttribute('src', file);
  }

  closeModals($event: any): void {
    let el: HTMLElement = $event.target;
    if(el.tagName == 'SECTION') this.beforeHide();
  }

  resetModals() {
    this.myForm.reset();

    this.confirmModal.active = false;
    this.createModal.active = false;
    this.editModal.active = false;
    this.globalModal.active = false;
  }
}
