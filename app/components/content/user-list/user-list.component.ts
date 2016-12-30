/**
 * Created by s.evdokimov on 23.12.2016.
 */

import {Component, Input ,Output, EventEmitter} from '@angular/core';
import {IUser} from '../../../assets/interfaces/user';


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
      case 'GET_USERS':
        this.userList = props.payload.users;
        break;
      case 'NEW_USER':
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
      this.onAction.emit({type: 'PAGINATION'});
    }
  }

  handlerSort($event: any):boolean {
    let el: HTMLElement = $event.target;
    if(el.dataset['sortBy'] === undefined) return false;

    let sortType = el.dataset['sortBy'];
    let sortDirection = el.dataset['directionBy'];
    this.onAction.emit({type: 'SORT', payload: {type: sortType, direction: sortDirection}});

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
        this.editUser($event, 'edit');
        break;
      case 'delete-btn':
        this.deleteUser($event, 'delete');
        break;
    }
  }

  editUser($event: any, type: string) {
    let el: HTMLElement = this.getRow($event.target);
    let id = parseInt(el.querySelector('.row__link').textContent);
    this.onAction.emit({type: 'SHOW_EDIT_MODAL', payload: {id: id}});
  }

  deleteUser($event: any, type: string) {
    let el: HTMLElement = this.getRow($event.target);
    let id = parseInt(el.querySelector('.row__link').textContent);
    this.onAction.emit({type: 'DELETE_USER', payload: {id: id}});
  }

  addUser($event: any, type: string) {
    this.onAction.emit({type: 'SHOW_ADD_MODAL'});
  }

  getRow(el:any): HTMLElement {
    if(el.tagName === 'TR') return el;
    return this.getRow(el['parentNode']);
  }
}
