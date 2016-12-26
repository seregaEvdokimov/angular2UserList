import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div id="app">
      <header-component></header-component>
      <user-list-component></user-list-component>
    </div>
  `,
})
export class AppComponent  {}
