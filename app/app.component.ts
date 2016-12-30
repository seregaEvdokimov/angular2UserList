import { Component } from '@angular/core';
import {StoreService} from './assets/services/store.service';
import {UserService} from './assets/services/user.service';
import {IUser} from './assets/interfaces/user';

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
    </div>
  `,
  providers: [StoreService, UserService]
})

export class AppComponent  {
  modalProps: any = null;
  userListProps: any = null;

  constructor(private store: StoreService, private userService: UserService) {
    this.store.init({user: this.userService});

    this.store.dispatch({
      type: 'LOAD_USERS',
      payload: {start: 0, limit: 10, callback: this.loadUsers.bind(this)}
    });
  }

  // ACTIONS
  onAction(params: any): void {
    // console.log('onAction', params);
    switch(params.type) {
      case 'PAGINATION':
        this.store.dispatch({
          type: 'PAGINATION',
          payload: {callback: this.loadUsers.bind(this)}
        });
        break;
      case 'SORT':
        this.store.dispatch({
          type: 'SORT',
          payload: {
            type: params.payload.type,
            direction: params.payload.direction,
            callback: this.loadUsers.bind(this)}
        });
        break;
      case 'SHOW_EDIT_MODAL':
        this.store.dispatch({
          type: 'SHOW_MODAL',
          payload: {
            id: params.payload.id,
            type: 'EDIT',
            callback: this.showModal.bind(this)}
        });
        break;
      case 'SHOW_ADD_MODAL':
        this.store.dispatch({
          type: 'SHOW_MODAL',
          payload: {
            type: 'CREATE',
            callback: this.showModal.bind(this)}
        });
        break;
      case 'UPDATE_USER':
        this.store.dispatch({
          type: 'UPDATE_USER',
          payload: {
            user: params.payload.user,
            callback: this.updatedUser.bind(this)}
        });
        break;
      case 'CREATE_USER':
        this.store.dispatch({
          type: 'CREATE_USER',
          payload: {
            user: params.payload.user,
            callback: this.createdUser.bind(this)}
        });
        break;
      case 'DELETE_USER':
        this.store.dispatch({
          type: 'DELETE_USER',
          payload: {
            id: params.payload.id,
            callback: this.deletedUser.bind(this)}
        });
        break;
    }
  }

  // CALLBACKS
  loadUsers(data: IUser[]): void {
    this.userListProps = {
      type: 'GET_USERS',
      payload: {users: data}
    };
  }

  showModal(type: string, data: IUser): void {
    this.modalProps = {
      type: (type === 'EDIT') ? 'SHOW_EDIT_MODAL' : 'SHOW_ADD_MODAL',
      payload: {model: data}
    }
  }

  updatedUser(res: any): void {
    this.modalProps = {type: 'HIDE_EDIT_MODAL'};
    this.loadUsers(res);
  }

  createdUser(res: any) {
    this.modalProps = {type: 'HIDE_ADD_MODAL'};
    this.userListProps = {
      type: 'NEW_USER',
      payload: {user: res.pop()}
    };
  }

  deletedUser(res: any) {
    this.loadUsers(res);
  }
}
