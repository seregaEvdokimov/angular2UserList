import { Component, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import {StoreService} from './config/store.service';
import {UserService} from './assets/services/user.service';
import {TooltipService} from './assets/services/tooltip.service';
import {DictionaryService} from './assets/services/dictionary.service';
import {CommunicateService} from './assets/services/communicate.service';
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
      
      <router-outlet></router-outlet>
      
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
  providers: [StoreService, UserService, TooltipService, CommunicateService]
})

export class AppComponent implements OnDestroy {
  modalProps: any = null;
  userListProps: any = null;
  headerProps: any = null;
  tooltipProps: any = null;
  notifyProps: any = null;
  subscription: Subscription;

  constructor(
    private store: StoreService,
    private userService: UserService,
    private tooltipService: TooltipService,
    private dictionaryService: DictionaryService,
    private communication: CommunicateService
  ) {

    this.store.init({
      user: this.userService,
      tooltip: this.tooltipService,
      dictionary: this.dictionaryService
    }, {
      userList: this.setUserList.bind(this),
      person: this.setPerson.bind(this),
      header: this.setHeader.bind(this),
      modal: this.setModal.bind(this),
      tooltip: this.setTooltip.bind(this),
      notify: this.setNotify.bind(this),
    });

    this.subscription = this.communication.appCmpOn.subscribe((params: any) => {
      this.store.dispatch(params);
    });

    middlewareSharedWorker(this.store, window);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAction(params: any): void {
    this.store.dispatch(params);
  }

  setUserList(state: any): void {
    this.communication.userListEmit(state);
  }

  setPerson(state: any): void {
    this.communication.personEmit(state);
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
