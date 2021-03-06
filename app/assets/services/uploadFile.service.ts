/**
 * Created by s.evdokimov on 28.12.2016.
 */

import {Injectable} from '@angular/core';

@Injectable()
export class UploadFileService {

  // INIT

  fileReader: any = new FileReader();
  callback: any;
  node: HTMLElement;

  constructor() {}

  // METHODS

  read(node: HTMLElement, callback: any) {
    this.node = node;
    this.callback = callback;

    let fileList: FileList = node['files'];
    this.fileReader.readAsDataURL(fileList[0]);
    this.fileReader.onload = this.insertImage.bind(this);
  }

  insertImage(event: any) {
    // var file = this.drawImage(event.target.result);
    var file = event.target.result;
    this.callback(file);
  };

  // drawImage(file: string) {
  //   var canvas = document.createElement('canvas');
  //   var ctx = canvas.getContext('2d');
  //
  //   var img = new Image();
  //   img.src = file;
  //
  //   var width = 195;
  //   var height = 135;
  //
  //   var x_ratio = width / img.width;
  //   var y_ratio = height / img.height;
  //
  //   var ratio = Math.min(x_ratio, y_ratio);
  //   var use_ratio = x_ratio < y_ratio ? 1 : 0;
  //
  //   var w = use_ratio ? width : Math.ceil(img.width * ratio);
  //   var h = !use_ratio ? height : Math.ceil(img.height * ratio);
  //
  //   canvas.setAttribute('width', w + 'px');
  //   canvas.setAttribute('height', h + 'px');
  //   ctx.drawImage(img, 0, 0,  w, h);
  //
  //   file = canvas.toDataURL();
  //   return file;
  // };
}
