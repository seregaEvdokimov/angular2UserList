/**
 * Created by s.evdokimov on 19.01.2017.
 */

import {Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit} from '@angular/core';

import {UploadFileService} from '../../../../assets/services/uploadFile.service';
import {ResizeServices} from '../../../../assets/services/resize.service';

import {TRANSLATE} from '../../../header/actions';
import {MODAL_UPLOAD_HIDE, MODAL_UPLOAD_SHOW} from '../actions';

@Component({
  moduleId: module.id,
  selector: 'upload-modal',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.css'],
  providers: [UploadFileService, ResizeServices]
})


export class UploadModalComponent implements AfterViewInit{
  // nodes to translate
  @ViewChild('TCaption') TCaption: ElementRef;
  @ViewChild('TPicture') TPicture: ElementRef;
  @ViewChild('TSave')    TSave: ElementRef;
  @ViewChild('TCancel')  TCancel: ElementRef;

  @ViewChild('area') area: ElementRef;
  @ViewChild('picture') picture: ElementRef;

  @Output() onAction = new EventEmitter();
  @Input()
  set props(props: any) {
    if(!props) return;

    switch(props.type) {
      case TRANSLATE:
        this.translate();
        break;
      case MODAL_UPLOAD_SHOW:
        this.forEntity = props.payload.form;
        this.show();
        break;
      case MODAL_UPLOAD_HIDE:
        this.hide();
        break;
    }
  }

  active: boolean = false;
  forEntity: string = '';

  constructor(private uploader: UploadFileService, private resizer: ResizeServices) {}

  ngAfterViewInit() {}

  show() {
    this.active = true;
  }

  hide() {
    this.active = false;
  }

  handlerUploadFile($event: any) {
    let input: HTMLElement = $event.target;
    this.uploader.read(input, this.insertImage.bind(this));
  }

  insertImage(file: string) {
    this.picture.nativeElement.setAttribute('src', file);
    this.resizer.init(this.picture.nativeElement, this.area.nativeElement, this.resizeImage.bind(this));
  }

  resizeImage(file: string) {
    this.picture.nativeElement.setAttribute('src', file);
  }

  handlerControls($event: any) {
    let el: HTMLElement = $event.target;
    if(el.tagName !== 'BUTTON') return false;

    let classes = el.classList;
    switch(classes[1]) {
      case 'add-btn':
        let file = this.resizer.crop();
        this.onAction.emit({
          type: MODAL_UPLOAD_HIDE,
          payload: {file: file, entity: this.forEntity}
        });
        break;
      case 'cancel-btn':
        this.onAction.emit({
          type: MODAL_UPLOAD_HIDE,
          payload: {file: false, entity: this.forEntity}
        });
        break;
    }
  }

  translate() {

  }

}
