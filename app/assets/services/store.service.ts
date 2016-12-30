/**
 * Created by s.evdokimov on 30.12.2016.
 */

import {Injectable} from '@angular/core';
import {UserService} from '../services/user.service';

@Injectable()
export class StoreService {
  userService: UserService;

  constructor() {}

  init(services: any): void {
    this.userService = services.user;
  }

  dispatch(action: any): void {
    // console.log('DISPATCH', action);
    switch(action.type) {
      case 'LOAD_USERS':
        this.userService.getUsers(action.payload);
        break;
      case 'PAGINATION':
        let limit = this.userService.getCount() + 10;
        this.userService.getUsers({start: 0, limit:limit, callback: action.payload.callback});
        break;
      case 'SORT':
        this.userService.sort(action.payload);
        break;
      case 'SHOW_MODAL':
        let user = (action.payload.id) ? this.userService.getById(action.payload.id) : {};
        action.payload.callback(action.payload.type, user);
        break;
      case 'UPDATE_USER':
        this.userService.updateUser({user: action.payload.user, callback: action.payload.callback});
        break;
      case 'DELETE_USER':
        this.userService.deleteUser({id: action.payload.id, callback: action.payload.callback});
        break;
      case 'CREATE_USER':
        this.userService.createUser({user: action.payload.user, callback: action.payload.callback});
        break;
    }
  }
}
