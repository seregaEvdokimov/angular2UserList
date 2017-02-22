/**
 * Created by s.evdokimov on 22.01.2017.
 */

import {Component, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {DictionaryService} from '../../../../assets/services/dictionary.service';

import {TRANSLATE} from '../../../header/actions';
import {USER_UPDATE, USER_SHOULD_UPDATE} from '../../../content/user-list/actions';
import {
  MODAL_EDIT_SHOW,
  MODAL_EDIT_HIDE,

  MODAL_UPLOAD_SHOW,
  MODAL_UPLOAD_FILE
} from '../actions';


@Component({
  moduleId: module.id,
  selector: 'update-modal',
  templateUrl: 'update.component.html',
  styleUrls: ['update.component.css']
})


export class UpdateModalComponent {

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
      case MODAL_EDIT_SHOW:
        this.show(props.payload);
        break;
      case MODAL_EDIT_HIDE:
        this.hide();
        break;
      case MODAL_UPLOAD_FILE:
        this.uploadedAvatar(props.payload);
        break;
    }
  }

  active: boolean = false;
  disabled: boolean = false;
  updateForm: FormGroup;

  constructor(private dictionary: DictionaryService) {
    this.updateForm = new FormGroup({
      name:  new FormControl(null, [Validators.required, Validators.pattern(/^\w+\s*\w*$/i)]),
      email: new FormControl(null, [Validators.required, Validators.pattern(/^[\w\.]+@\w+\.\w+$/i)]),
      birth: new FormControl(null, [Validators.required]),
      date:  new FormControl(null, [Validators.required]),
      id:  new FormControl(null, [Validators.required])
    });
  }

  // LISTENERS

  handlerControls($event: any) {
    let el: HTMLElement = $event.target;
    if(el.tagName !== 'BUTTON') return false;

    let classes = el.classList;
    let user = this.updateForm.value;
    user.avatar = this.reDrawImage(this.picture.nativeElement);

    switch(classes[1]) {
      case 'add-btn':
        this.onAction.emit({
          type: USER_UPDATE,
          payload: {user: user}
        });

        this.onAction.emit({type: MODAL_EDIT_HIDE});
        break;
      case 'cancel-btn':
        this.disabled = true;

        this.onAction.emit({
          type: USER_SHOULD_UPDATE,
          payload: {user: user}
        });
        break;
    }
  }

  // METHODS

  show(data: any) {
    this.picture.nativeElement.setAttribute('src', data.avatar);
    this.updateForm.patchValue({
      name: data.name,
      date: data.date,
      birth: data.birth,
      email: data.email,
      id: data.id
    });

    this.disabled = false;
    this.active = true;
  }

  hide() {
    this.disabled = false;
    this.active = false;
  }

  uploadAvatar($event: any) {
    this.disabled = true;
    this.onAction.emit({type: MODAL_UPLOAD_SHOW, payload: {form: 'update'}});
  }

  uploadedAvatar(data: any) {
    this.disabled = false;
    if(data.file) this.picture.nativeElement.setAttribute('src', data.file);
  }

  reDrawImage(image: any) {
    let src = image.getAttribute('src');
    if(/^https?/.test(src)) return src;

    let width = image.clientWidth;
    let height = image.clientHeight;

    let image_canvas: any = document.createElement('canvas');
    image_canvas.width = width;
    image_canvas.height = height;

    image_canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    console.log(image_canvas.toDataURL());
    return image_canvas.toDataURL("image/png");
  }

  translate() {
    this.TCaption.nativeElement.textContent    = this.dictionary.t(['forms', 'edit_caption']);
    this.TAvatar.nativeElement.textContent     = this.dictionary.t(['forms', 'edit_avatar']);
    this.TAvatarBtn.nativeElement.textContent  = this.dictionary.t(['forms', 'edit_avatar_btn']);
    this.TName.nativeElement.textContent       = this.dictionary.t(['forms', 'edit_name']);
    this.TEmail.nativeElement.textContent      = this.dictionary.t(['forms', 'edit_email']);
    this.TBirth.nativeElement.textContent      = this.dictionary.t(['forms', 'edit_birth']);
    this.TTime.nativeElement.textContent       = this.dictionary.t(['forms', 'edit_time']);
    this.TSave.nativeElement.textContent       = this.dictionary.t(['forms', 'edit_save']);
    this.TCancel.nativeElement.textContent     = this.dictionary.t(['forms', 'edit_cancel']);
  }
}
