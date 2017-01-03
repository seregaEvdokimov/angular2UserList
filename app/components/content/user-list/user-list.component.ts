/**
 * Created by s.evdokimov on 23.12.2016.
 */

import {Component, Input ,Output, EventEmitter} from '@angular/core';
import {IUser} from '../../../assets/interfaces/user';

import {USER_LIST_PAGINATION, USER_LIST_SORT, USER_DELETE, FETCH_USER_LIST, USER_NEW} from './actions';
import {TOOLTIP_SHOW, TOOLTIP_HIDE, TOOLTIP_MOVE} from '../../additional/tooltip/actions';
import {MODAL_CREATE_SHOW, MODAL_EDIT_SHOW} from '../../additional/modal/actions';


@Component({
  moduleId: module.id,
  selector: 'user-list-component',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.css']
})


export class UserlistComponent {
  @Output() onAction = new EventEmitter();
  @Input()
  set props(props: any) {
    if(!props) return;

    switch(props.type) {
      case FETCH_USER_LIST:
        this.userList = props.payload.users;
        break;
      case USER_NEW:
        this.newItem = props.payload.user;
        break;
    }
  }

  newItem: IUser;
  userList: IUser[] = [];

  handlerScroll($event: any) {
    let el: HTMLElement = $event.target;

    let currentScroll = el.scrollTop + el.clientHeight;
    let maxScroll = el.scrollHeight;

    if(currentScroll == maxScroll) {
      this.onAction.emit({type: USER_LIST_PAGINATION});
    }
  }

  handlerSort($event: any):boolean {
    let el: HTMLElement = $event.target;
    if(el.dataset['sortBy'] === undefined) return false;

    let sortType = el.dataset['sortBy'];
    let sortDirection = el.dataset['directionBy'];
    this.onAction.emit({
      type: USER_LIST_SORT,
      payload: {type: sortType, direction: sortDirection}
    });

    let nodes = [].slice.apply(el.parentNode.childNodes);
    for(let i = 0, len = nodes.length; i < len; i++) {
      if(nodes[i].nodeType === 1) nodes[i].classList.remove('active');
    }

    el.className = 'row__' + sortType + ' active ' + sortDirection;
    el.dataset['directionBy'] = (sortDirection === 'asc') ? 'desc' : 'asc';
  }

  handlerControl($event: any):boolean {
    let el: HTMLElement = $event.target;
    if(el.tagName !== 'A') return false;

    let classes = el.classList;
    switch(classes[1]) {
      case 'edit-btn':
        this.editUser($event);
        break;
      case 'delete-btn':
        this.deleteUser($event);
        break;
    }
  }

  handlerMouse($event: any): boolean {
    let type = $event.type;
    let el = $event.target;
    let id = parseInt(this.getRow(el).querySelector('.row__link').textContent);
    let tooltip = el.dataset.tooltip;

    if(tooltip) {
      switch(type) {
        case 'mousemove':
          this.onAction.emit({
            type: TOOLTIP_MOVE,
            payload: {coords: {x: $event.pageX, y: $event.pageY}}
          });
          break;
        case 'mouseover':
          this.onAction.emit({
            type: TOOLTIP_SHOW,
            payload: {id: id, type: tooltip, coords: {x: $event.pageX, y: $event.pageY}}
          });
          break;
        case 'mouseout':
          this.onAction.emit({
            type: TOOLTIP_HIDE,
            payload: {type: tooltip}
          });
          break;
      }
    }

    return true;
  }

  editUser($event: any) {
    let el: HTMLElement = this.getRow($event.target);
    let id = parseInt(el.querySelector('.row__link').textContent);
    this.onAction.emit({
      type: MODAL_EDIT_SHOW,
      payload: {id: id}
    });
  }

  deleteUser($event: any) {
    let el: HTMLElement = this.getRow($event.target);
    let id = parseInt(el.querySelector('.row__link').textContent);
    this.onAction.emit({
      type: USER_DELETE,
      payload: {id: id}
    });
  }

  addUser($event: any) {
    this.onAction.emit({type: MODAL_CREATE_SHOW});
  }

  getRow(el:any): HTMLElement {
    if(!el || el.tagName === 'TR') return el;
    return this.getRow(el['parentNode']);
  }
}
