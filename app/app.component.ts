import { Component } from '@angular/core';

import {StoreService} from './config/store.service';
import {UserService} from './assets/services/user.service';
import {TooltipService} from './assets/services/tooltip.service';
import {DictionaryService} from './assets/services/dictionary.service';
import {middlewareSharedWorker} from './config/sharedWorker';

import {FETCH_USER_LIST} from './components/content/user-list/actions'

@Component({
  selector: 'my-app',
  template: `
    <div id="app">
      <header-component
        [props]="headerProps"  
        (onAction)="onAction($event)"
      ></header-component>
      
      <user-list-component 
        [props]="userListProps"  
        (onAction)="onAction($event)"
      ></user-list-component>
      
      <modal-component 
        [props]="modalProps"  
        (onAction)="onAction($event)"
      ></modal-component>
      
      <tooltip-component
        [props]="tooltipProps"  
        (onAction)="onAction($event)"
      ></tooltip-component>
      
      <notify-component
        [props]="notifyProps"  
        (onAction)="onAction($event)"
      ></notify-component>
    </div> 
  `,
  providers: [StoreService, UserService, TooltipService]
})

export class AppComponent  {
  modalProps: any = null;
  userListProps: any = null;
  headerProps: any = null;
  tooltipProps: any = null;
  notifyProps: any = null;

  constructor(
    private store: StoreService,
    private userService: UserService,
    private tooltipService: TooltipService,
    private dictionaryService: DictionaryService
  ) {

    this.store.init({
      user: this.userService,
      tooltip: this.tooltipService,
      dictionary: this.dictionaryService
    }, {
      userList: this.setUserList.bind(this),
      header: this.setHeader.bind(this),
      modal: this.setModal.bind(this),
      tooltip: this.setTooltip.bind(this),
      notify: this.setNotify.bind(this),
    });

    this.store.dispatch({
      type: FETCH_USER_LIST,
      payload: {start: 0, limit: 10}
    });

    middlewareSharedWorker(this.store, window);
  }

  onAction(params: any): void {
    this.store.dispatch(params);
  }

  setUserList(state: any): void {
    this.userListProps = state;
  }

  setHeader(state: any): void {
    this.headerProps = state;
  }

  setTooltip(state: any): void {
    this.tooltipProps = state;
  }

  setNotify(state: any): void {
    this.notifyProps = state;
  }

  setModal(state: any): void {
    this.modalProps = state;
  }
}
