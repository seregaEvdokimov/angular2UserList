/**
 * Created by s.evdokimov on 30.12.2016.
 */

import {Injectable} from '@angular/core';
import {UserService} from '../assets/services/user.service';
import {TooltipService} from '../assets/services/tooltip.service';

import {FETCH_USER_LIST, USER_LIST_SORT, USER_UPDATE, SHOULD_UPDATE_USER, USER_CREATE, USER_DELETE} from '../components/content/user-list/actions';
import {MODAL_EDIT_SHOW, MODAL_CREATE_SHOW, MODAL_ALL_HIDE, MODAL_CONFIRM_SHOW} from '../components/additional/modal/actions';
import {TOOLTIP_SHOW, TOOLTIP_HIDE, TOOLTIP_MOVE} from '../components/additional/tooltip/actions';

@Injectable()
export class StoreService {
  userService: UserService;
  tooltipService: TooltipService;
  callbacks: any;

  constructor() {}

  init(services: any, callbacks: any): void {
    this.userService = services.user;
    this.tooltipService = services.tooltip;

    this.callbacks = callbacks;
  }

  dispatch(action: any): void {
    console.log('DISPATCH', action);
    switch(action.type) {
      // USER
      case FETCH_USER_LIST:
        this.userService.getUsers(action.payload, this.callbacks.userList);
        break;
      case USER_LIST_SORT:
        this.userService.sort(action.payload, this.callbacks.userList);
        break;
      case SHOULD_UPDATE_USER:
        let status = this.userService.compare(action.payload.user);
        let type = status ? MODAL_ALL_HIDE : MODAL_CONFIRM_SHOW;
        this.callbacks.modal({
          type: type,
          payload: {model: action.payload.user}
        });
        break;
      case USER_UPDATE:
        this.userService.updateUser(action.payload, this.callbacks.userList);
        break;
      case USER_CREATE:
        this.userService.createUser(action.payload, this.callbacks.userList);
        break;
      case USER_DELETE:
        this.userService.deleteUser(action.payload, this.callbacks.userList);
        break;

      // MODAL
      case MODAL_EDIT_SHOW:
        let user = this.userService.getById(action.payload.id);
        this.callbacks.modal({
          type: MODAL_EDIT_SHOW,
          payload: {model: user}
        });
        break;
      case MODAL_CREATE_SHOW:
        this.callbacks.modal({type: MODAL_CREATE_SHOW});
        break;
      case MODAL_ALL_HIDE:
        this.callbacks.modal({type: MODAL_ALL_HIDE});
        break;

      // TOOLTIP
      case TOOLTIP_SHOW:
        this.tooltipService.getData(action.payload, this.callbacks.tooltip);
        break;
      case TOOLTIP_HIDE:
        this.callbacks.tooltip({
          type: TOOLTIP_HIDE,
          payload: action.payload
        });
        break;
      case TOOLTIP_MOVE:
        this.callbacks.tooltip({
          type: TOOLTIP_MOVE,
          payload: action.payload
        });
        break;
      // case 'PAGINATION':
      //   let limit = this.userService.getCount() + 10;
      //   this.userService.getUsers({start: 0, limit:limit, callback: action.payload.callback});
      //   break;
    }
  }
}
