import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div id="app">
      <modal-component [action]="action"></modal-component>
      <header-component></header-component>
      <user-list-component (onModal)="modalAction($event)"></user-list-component>
    </div>
  `,
})

export class AppComponent  {
  action: any = null;

  modalAction(params: any) {
    this.action = params;
  }

}
