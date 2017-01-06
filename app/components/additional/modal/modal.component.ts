/**
 * Created by s.evdokimov on 26.12.2016.
 */

import {Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {IModal} from '../../../assets/interfaces/modal';

import {UploadFileService} from '../../../assets/services/uploadFile.service';
import {DictionaryService} from '../../../assets/services/dictionary.service';

import {TRANSLATE} from '../../header/actions';
import {SHOULD_UPDATE_USER, USER_CREATE, USER_UPDATE} from '../../content/user-list/actions';
import {MODAL_EDIT_SHOW, MODAL_EDIT_HIDE, MODAL_CREATE_SHOW, MODAL_CREATE_HIDE, MODAL_CONFIRM_SHOW, MODAL_ALL_HIDE} from './actions';


@Component({
  moduleId: module.id,
  selector: 'modal-component',
  templateUrl: 'modal.component.html',
  styleUrls: ['modal.component.css'],
  providers: [UploadFileService]
})


export class ModalComponent implements AfterViewInit {
  // nodes to translate
  @ViewChild('TCMCaption') TCMCaption: ElementRef;
  @ViewChild('TCMAvatar')  TCMAvatar: ElementRef;
  @ViewChild('TCMName')    TCMName: ElementRef;
  @ViewChild('TCMEmail')   TCMEmail: ElementRef;
  @ViewChild('TCMBirth')   TCMBirth: ElementRef;
  @ViewChild('TCMTime')    TCMTime: ElementRef;
  @ViewChild('TCMCancel')  TCMCancel: ElementRef;
  @ViewChild('TCMSave')    TCMSave: ElementRef;

  @ViewChild('TEMCaption') TEMCaption: ElementRef;
  @ViewChild('TEMAvatar')  TEMAvatar: ElementRef;
  @ViewChild('TEMName')    TEMName: ElementRef;
  @ViewChild('TEMEmail')   TEMEmail: ElementRef;
  @ViewChild('TEMBirth')   TEMBirth: ElementRef;
  @ViewChild('TEMTime')    TEMTime: ElementRef;
  @ViewChild('TEMCancel')  TEMCancel: ElementRef;
  @ViewChild('TEMSave')    TEMSave: ElementRef;

  @ViewChild('TAMCaption') TAMCaption: ElementRef;
  @ViewChild('TAMSave')    TAMSave: ElementRef;
  @ViewChild('TAMCancel')  TAMCancel: ElementRef;

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

        if(this.myForm.status === 'VALID') {
          this.resetModals();
          this.show();
        } else {
          this.resetModals();
        }
        break;
      case MODAL_ALL_HIDE:
        this.resetModals();
        break;
      case TRANSLATE:
        this.translate();
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
  constructor(public uploader: UploadFileService, private dictionary: DictionaryService) {
    this.myForm = new FormGroup({
      avatar: new FormControl(),
      name: new FormControl(null, [Validators.required, Validators.pattern(/^\w+\s*\w*$/i)]),
      email: new FormControl(null, [Validators.required, Validators.pattern(/^[\w\.]+@\w+\.\w+$/i)]),
      birth: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      id: new FormControl(null, [Validators.required, Validators.pattern(/^\d+$/i)])
    });
  }

  ngAfterViewInit() {}

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

  translate() {
    this.TCMCaption.nativeElement.textContent = this.dictionary.t(['forms', 'create_caption']);
    this.TCMAvatar.nativeElement.textContent  = this.dictionary.t(['forms', 'create_avatar']);
    this.TCMName.nativeElement.textContent    = this.dictionary.t(['forms', 'create_name']);
    this.TCMEmail.nativeElement.textContent   = this.dictionary.t(['forms', 'create_email']);
    this.TCMBirth.nativeElement.textContent   = this.dictionary.t(['forms', 'create_birth']);
    this.TCMTime.nativeElement.textContent    = this.dictionary.t(['forms', 'create_time']);
    this.TCMCancel.nativeElement.textContent  = this.dictionary.t(['forms', 'create_cancel']);
    this.TCMSave.nativeElement.textContent    = this.dictionary.t(['forms', 'create_save']);

    this.TEMCaption.nativeElement.textContent = this.dictionary.t(['forms', 'edit_caption']);
    this.TEMAvatar.nativeElement.textContent  = this.dictionary.t(['forms', 'edit_avatar']);
    this.TEMName.nativeElement.textContent    = this.dictionary.t(['forms', 'edit_name']);
    this.TEMEmail.nativeElement.textContent   = this.dictionary.t(['forms', 'edit_email']);
    this.TEMBirth.nativeElement.textContent   = this.dictionary.t(['forms', 'edit_birth']);
    this.TEMTime.nativeElement.textContent    = this.dictionary.t(['forms', 'edit_time']);
    this.TEMCancel.nativeElement.textContent  = this.dictionary.t(['forms', 'edit_cancel']);
    this.TEMSave.nativeElement.textContent    = this.dictionary.t(['forms', 'edit_save']);

    this.TAMCaption.nativeElement.textContent = this.dictionary.t(['forms', 'confirm_message']);
    this.TAMSave.nativeElement.textContent    = this.dictionary.t(['forms', 'confirm_save']);
    this.TAMCancel.nativeElement.textContent  = this.dictionary.t(['forms', 'confirm_cancel']);
  }
}
