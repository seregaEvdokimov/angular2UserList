/**
 * Created by s.evdokimov on 19.01.2017.
 */
import {Component, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {DictionaryService} from '../../../../assets/services/dictionary.service';

import {TRANSLATE} from '../../../header/actions';
import {USER_CREATE} from '../../../content/user-list/actions';
import {
  MODAL_CREATE_SHOW,
  MODAL_CREATE_HIDE,

  MODAL_UPLOAD_SHOW,
  MODAL_UPLOAD_FILE
} from '../actions';


@Component({
  moduleId: module.id,
  selector: 'create-modal',
  templateUrl: 'create.component.html',
  styleUrls: ['create.component.css']
})


export class CreateModalComponent {

  // INIT

  // nodes to translate
  @ViewChild('TCaption')   TCaption: ElementRef;
  @ViewChild('TAvatar')    TAvatar: ElementRef;
  @ViewChild('TAvatarBtn') TAvatarBtn: ElementRef;
  @ViewChild('TName')      TName: ElementRef;
  @ViewChild('TEmail')     TEmail: ElementRef;
  @ViewChild('TBirth')     TBirth: ElementRef;
  @ViewChild('TTime')      TTime: ElementRef;
  @ViewChild('TSave')      TSave: ElementRef;
  @ViewChild('TCancel')    TCancel: ElementRef;
  @ViewChild('picture')    picture: ElementRef;

  @Output() onAction = new EventEmitter();
  @Input()
  set props(props: any) {
    if(!props) return;

    switch(props.type) {
      case TRANSLATE:
        this.translate();
        break;
      case MODAL_CREATE_SHOW:
        this.show();
        break;
      case MODAL_CREATE_HIDE:
        this.hide();
        break;
      case MODAL_UPLOAD_FILE:
        this.uploadedAvatar(props.payload);
        break;
    }
  }

  active: boolean = false;
  disabled: boolean = false;
  createForm: FormGroup;

  constructor(private dictionary: DictionaryService) {
    this.createForm = new FormGroup({
      name:  new FormControl(null, [Validators.required, Validators.pattern(/^\w+\s*\w*$/i)]),
      email: new FormControl(null, [Validators.required, Validators.pattern(/^[\w\.]+@\w+\.\w+$/i)]),
      birth: new FormControl(null, [Validators.required]),
      date:  new FormControl(null, [Validators.required])
    });
  }

  // LISTENERS

  handlerControls($event: any) {
    let el: HTMLElement = $event.target;
    if(el.tagName !== 'BUTTON') return false;

    let classes = el.classList;
    switch(classes[1]) {
      case 'add-btn':
        let user = this.createForm.value;
        user.avatar = this.reDrawImage(this.picture.nativeElement);

        this.onAction.emit({
          type: USER_CREATE,
          payload: {user: user}
        });

        this.onAction.emit({type: MODAL_CREATE_HIDE});
        break;
      case 'cancel-btn':
        this.onAction.emit({type: MODAL_CREATE_HIDE});
        break;
    }
  }

  // METHODS

  show() {
    this.picture.nativeElement.setAttribute('src', '');
    this.disabled = false;
    this.active = true;
  }

  hide() {
    this.disabled = false;
    this.active = false;
  }

  uploadAvatar($event: any) {
    this.disabled = true;
    this.onAction.emit({type: MODAL_UPLOAD_SHOW, payload: {form: 'create'}});
  }

  uploadedAvatar(data: any) {
    this.disabled = false;
    if(data.file) this.picture.nativeElement.setAttribute('src', data.file);
  }

  reDrawImage(image: any) {
    let width = image.clientWidth;
    let height = image.clientHeight;

    let image_canvas: any = document.createElement('canvas');
    image_canvas.width = width;
    image_canvas.height = height;
    image_canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    return image_canvas.toDataURL("image/png");
  }

  translate() {
    this.TCaption.nativeElement.textContent   = this.dictionary.t(['forms', 'create_caption']);
    this.TAvatar.nativeElement.textContent    = this.dictionary.t(['forms', 'create_avatar']);
    this.TAvatarBtn.nativeElement.textContent = this.dictionary.t(['forms', 'create_avatar_btn']);
    this.TName.nativeElement.textContent      = this.dictionary.t(['forms', 'create_name']);
    this.TEmail.nativeElement.textContent     = this.dictionary.t(['forms', 'create_email']);
    this.TBirth.nativeElement.textContent     = this.dictionary.t(['forms', 'create_birth']);
    this.TTime.nativeElement.textContent      = this.dictionary.t(['forms', 'create_time']);
    this.TSave.nativeElement.textContent      = this.dictionary.t(['forms', 'create_save']);
    this.TCancel.nativeElement.textContent    = this.dictionary.t(['forms', 'create_cancel']);
  }
}
