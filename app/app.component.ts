import { Component, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import {CommunicateService} from './assets/services/communicate.service';
import {DictionaryService} from './assets/services/dictionary.service';
import {StoreService} from './config/store.service';
import {TooltipService} from './assets/services/tooltip.service';
import {UserService} from './assets/services/user.service';
import {middlewareSharedWorker} from './config/sharedWorker';

import {FETCH_LOCALIZATION_STRINGS} from './components/header/actions'

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
  providers: [CommunicateService, StoreService, TooltipService, UserService]
})

export class AppComponent implements OnDestroy {

  subscription: Subscription;

  constructor(
    private dictionaryService: DictionaryService,
    private communication: CommunicateService,
    private store: StoreService,
    private tooltipService: TooltipService,
    private userService: UserService,
  ) {

    this.store.init({
      dictionary: this.dictionaryService,
      tooltip: this.tooltipService,
      user: this.userService,
    }, {
      header: this.setHeader.bind(this),
      modal: this.setModal.bind(this),
      notify: this.setNotify.bind(this),
      person: this.setPerson.bind(this),
      tooltip: this.setTooltip.bind(this),
      userList: this.setUserList.bind(this)
    });

    this.subscription = this.communication.appCmpOn.subscribe((params: any) => {
      this.store.dispatch(params);
    });

    this.store.dispatch({
      type: FETCH_LOCALIZATION_STRINGS,
      payload: {lang: 'ru'}
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

  headerProps: any = null;
  setHeader(state: any): void {
    this.headerProps = state;
  }

  tooltipProps: any = null;
  setTooltip(state: any): void {
    this.tooltipProps = state;
  }

  notifyProps: any = null;
  setNotify(state: any): void {
    this.notifyProps = state;
  }

  modalProps: any = null;
  setModal(state: any): void {
    this.modalProps = state;
  }
}
