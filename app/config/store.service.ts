/**
 * Created by s.evdokimov on 30.12.2016.
 */

import {Injectable} from '@angular/core';

import {IUser} from "../assets/interfaces/user";

import {UserService} from '../assets/services/user.service';
import {TooltipService} from '../assets/services/tooltip.service';
import {DictionaryService} from '../assets/services/dictionary.service';

import {FETCH_PERSON_INFORM} from '../components/content/person/actions';
import {NOTIFY_ADD, NOTIFY_SWITCH} from '../components/additional/notify/actions';
import {SEARCH, FETCH_LOCALIZATION_STRINGS} from '../components/header/actions';
import {
  TOOLTIP_SHOW,
  TOOLTIP_HIDE,
  TOOLTIP_MOVE
} from '../components/additional/tooltip/actions';
import {
  USER_READ,
  USER_NEW,
  USER_CREATE,
  USER_SHOULD_UPDATE,
  USER_UPDATE,
  USER_DELETE,

  USER_LIST_SORT,
  USER_LIST_PAGINATION,
  USER_TIME_PASSED,
} from '../components/content/user-list/actions';
import {
  MODAL_CREATE_SHOW,
  MODAL_CREATE_HIDE,

  MODAL_EDIT_SHOW,
  MODAL_EDIT_HIDE,

  MODAL_CONFIRM_SHOW,
  MODAL_CONFIRM_HIDE,

  MODAL_UPLOAD_SHOW,
  MODAL_UPLOAD_HIDE,

  MODAL_ALL_HIDE
} from '../components/additional/modal/actions';


@Injectable()
export class StoreService {

  // INIT

  userService: UserService;
  tooltipService: TooltipService;
  dictionaryService: DictionaryService;
  callbacks: any;

  constructor() {}

  // METHODS

  init(services: any, callbacks: any): void {
    this.userService = services.user;
    this.tooltipService = services.tooltip;
    this.dictionaryService = services.dictionary;

    this.callbacks = callbacks;
  }

  dispatch(action: any): void {
    let user: IUser;
    let users: IUser[];
    // console.log('DISPATCH', action);
    switch(action.type) {
      // HEADER
      case FETCH_LOCALIZATION_STRINGS:
        this.dictionaryService.loadLocalization(action.payload, this.callbacks);
        break;
      case SEARCH:
        this.userService.searchUser(action.payload, this.callbacks.userList);
        break;

      // USER
      case USER_READ:
        users = this.userService.getAll();
        if(!users.length) {
          this.userService.loadUsers(action.payload, this.callbacks.userList);
        } else {
          this.callbacks.userList({
            type: USER_READ,
            payload: {users: users}
          })
        }
        break;
      case USER_LIST_SORT:
        this.userService.sort(action.payload, this.callbacks.userList);
        break;
      case USER_LIST_PAGINATION:
        let limit = this.userService.getCount() + 10;
        this.userService.loadUsers({start: 0, limit:limit}, this.callbacks.userList);
        break;
      case USER_TIME_PASSED:
        this.callbacks.notify({
          type: NOTIFY_ADD,
          payload: {message: this.dictionaryService.getMessage(action.payload.user, ['notify', 'timePassed'])}
        });
        break;
      case USER_SHOULD_UPDATE:
        this.callbacks.modal({
          type: MODAL_CONFIRM_SHOW,
          payload: action.payload
        });
        break;
      case USER_UPDATE:
        this.userService.updateUser(action.payload, this.callbacks.userList);
        this.callbacks.notify({
          type: NOTIFY_ADD,
          payload: {message: this.dictionaryService.getMessage(action.payload.user, ['notify', 'updateUser'])}
        });
        break;
      case USER_NEW:
        this.userService.newUser(action.payload, this.callbacks.userList);
        this.callbacks.notify({
          type: NOTIFY_ADD,
          payload: {message: this.dictionaryService.getMessage(action.payload.user, ['notify', 'createUser'])}
        });
        break;
      case USER_CREATE:
        this.userService.createUser(action.payload, this.callbacks.userList);
        this.callbacks.notify({
          type: NOTIFY_ADD,
          payload: {message: this.dictionaryService.getMessage(action.payload.user, ['notify', 'createUser'])}
        });
        break;
      case USER_DELETE:
        user = this.userService.deleteUser(action.payload.id, this.callbacks.userList);
        this.callbacks.notify({
          type: NOTIFY_ADD,
          payload: {message: this.dictionaryService.getMessage(user, ['notify', 'deleteUser'])}
        });
        break;

      // PERSON
      case FETCH_PERSON_INFORM:
        this.userService.loadUser(parseInt(action.payload.id), this.callbacks.person);
        break;

      // MODAL
      case MODAL_EDIT_SHOW:
        user = this.userService.getById(action.payload.id);
        this.callbacks.modal({
          type: MODAL_EDIT_SHOW,
          payload: user
        });
        break;
      case MODAL_EDIT_HIDE:
        this.callbacks.modal({type: MODAL_EDIT_HIDE});
        break;
      case MODAL_CREATE_SHOW:
        this.callbacks.modal({type: MODAL_CREATE_SHOW});
        break;
      case MODAL_CREATE_HIDE:
        this.callbacks.modal({type: MODAL_CREATE_HIDE});
        break;
      case MODAL_UPLOAD_SHOW:
        this.callbacks.modal({
          type: MODAL_UPLOAD_SHOW,
          payload: action.payload
        });
        break;
      case MODAL_UPLOAD_HIDE:
        this.callbacks.modal({
          type: MODAL_UPLOAD_HIDE,
          payload: action.payload
        });
        break;
      case MODAL_CONFIRM_HIDE:
        this.callbacks.modal({type: MODAL_CONFIRM_HIDE});
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

      // NOTIFY
      case NOTIFY_SWITCH:
        this.callbacks.notify({
          type: NOTIFY_SWITCH,
          payload: action.payload
        });
        break;
    }
  }
}
