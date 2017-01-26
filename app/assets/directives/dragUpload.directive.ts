/**
 * Created by s.evdokimov on 26.01.2017.
 */

import {Directive, ElementRef, Output, EventEmitter, Renderer, HostListener, OnInit, OnDestroy} from '@angular/core'


@Directive({
  selector: '[dragupload]',
})


export class DragUploadDirective implements OnInit, OnDestroy{

  // INIT
  @Output('onDrop') callback = new EventEmitter();

  constructor(private el: ElementRef, private renderer: Renderer) {}

  // LIFECYCLE HOOKS

  ngOnInit(): void {
    this.renderer.setElementAttribute(this.el.nativeElement, 'test', 'yes');
  }

  ngOnDestroy(): void {}

  // LISTENERS

  @HostListener('dragover', ['$event'])
  onDragover(e: any) {
    e.preventDefault();
  }

  @HostListener('dragleave', ['$event'])
  onDragleave(e: any) {
    e.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(e: any) {
    e.preventDefault();
    this.callback.emit(e.dataTransfer);
  }
}
