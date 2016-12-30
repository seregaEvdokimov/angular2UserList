/**
 * Created by s.evdokimov on 26.12.2016.
 */

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {UploadFileService} from '../../../assets/services/uploadFile.service';
import {IModal} from '../../../assets/interfaces/modal';


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
      case 'SHOW_EDIT_MODAL':
        this.editModal.model = props.payload.model;
        this.currentModal = this.editModal;
        this.show();
        break;
      case 'HIDE_EDIT_MODAL':
        this.currentModal = this.editModal;
        this.hide();
        break;
      case 'SHOW_ADD_MODAL':
        this.currentModal = this.createModal;
        this.show();
        break;
      case 'HIDE_ADD_MODAL':
        this.currentModal = this.createModal;
        this.hide();
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
    active: false,
    model: {}
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
    if(this.currentModal.model) {
      this.myForm.patchValue({
        avatar: this.currentModal.model.avatar || '',
        name: this.currentModal.model.name || '',
        email: this.currentModal.model.email || '',
        birth: new Date(this.currentModal.model.birth).getTime() || '',
        date: new Date(this.currentModal.model.date).getTime() || '',
        id: this.currentModal.model.id || '',
      });
    }

    this.globalModal.active = true;
    this.currentModal.active = true;
  }

  beforeHide(): void {
    this.hide();
  }

  hide(): void {
    this.myForm.reset();
    this.currentModal.active = false;
    this.globalModal.active = false;
  }

  save(): void {
    let value = this.myForm.value;

    switch(this.currentModal.id) {
      case 'create':
        this.onAction.emit({type: 'CREATE_USER', payload: {user: value}});
        break;
      case 'edit':
        this.onAction.emit({type: 'UPDATE_USER', payload: {user: value}});
        break;
      // case 'confirm':
      //   return this.confirmModal;
    }
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
}
