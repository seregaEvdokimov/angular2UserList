import { Component } from '@angular/core';
import {StoreService} from './config/store.service';
import {UserService} from './assets/services/user.service';
import {TooltipService} from './assets/services/tooltip.service';

import {FETCH_USER_LIST} from './components/content/user-list/actions'

@Component({
  selector: 'my-app',
  template: `
    <div id="app">
      <header-component></header-component>
      
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
    </div> 
  `,
  providers: [StoreService, UserService, TooltipService]
})

export class AppComponent  {
  modalProps: any = null;
  userListProps: any = null;
  tooltipProps: any = null;

  constructor(
    private store: StoreService,
    private userService: UserService,
    private tooltipService: TooltipService
  ) {

    this.store.init({
      user: this.userService,
      tooltip: this.tooltipService
    }, {
      userList: this.setUserList.bind(this),
      modal: this.setModal.bind(this),
      tooltip: this.setTooltip.bind(this),
    });

    this.store.dispatch({
      type: FETCH_USER_LIST,
      payload: {start: 0, limit: 10}
    });
  }

  onAction(params: any): void {
    this.store.dispatch(params);
  }

  setUserList(state: any): void {
    this.userListProps = state;
  }

  setTooltip(state: any): void {
    this.tooltipProps = state;
  }

  setModal(state: any): void {
    this.modalProps = state;
  }
}
