/**
 * Created by s.evdokimov on 23.12.2016.
 */

import {Component, Output, EventEmitter} from '@angular/core';

import {IUser} from '../../../assets/interfaces/user';
import {USERS} from '../../../assets/interfaces/user';
import {ModalComponent} from '../../additional/modal/modal.component';

@Component({
  moduleId: module.id,
  selector: 'user-list-component',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.css'],
  providers: [ModalComponent]
})

export class UserlistComponent {
  @Output() onModal = new EventEmitter();

  userList: IUser[] = [];
  sortType: string = 'id';
  sortDirection: string = 'asc';

  constructor(private modal: ModalComponent) {
    this.userList = this.formatData(USERS);
  }

  formatData(data: IUser[]): IUser[] {
    data.forEach(function(item) {

      let date: any = new Date(item.birth);
      date = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

      item.startDate = date;
    });

    data = this.sortData(data);
    return data;
  }

  sortData(data: IUser[]): IUser[] {
    let sortType: string = this.sortType;
    let sortDirection: string = this.sortDirection;

    let sorted: IUser[] = data.sort(function(v1, v2) {
      let p1 = (sortType == 'date' || sortType == 'birth') ? new Date(v1[sortType]).getTime() : v1[sortType];
      let p2 = (sortType == 'date' || sortType == 'birth') ? new Date(v2[sortType]).getTime() : v2[sortType];
      let res = 0;

      if (sortDirection == 'asc') res = (p1 > p2) ? 1 : -1;
      if (sortDirection == 'desc') res = (p1 > p2) ? -1 : 1;
      return res;
    });

    return sorted;
  }

  handlerSort($event: any):boolean {
    let el: HTMLElement = $event.target;
    if(el.dataset['sortBy'] === undefined) return false;

    this.sortType = el.dataset['sortBy'];
    this.sortDirection = el.dataset['directionBy'];
    this.userList = this.sortData(this.userList);

    let nodes = [].slice.apply(el.parentNode.childNodes);
    for(let i = 0, len = nodes.length; i < len; i++) {
      if(nodes[i].nodeType === 1) nodes[i].classList.remove('active');
    }

    el.className = 'row__' + this.sortType + ' active ' + this.sortDirection;
    el.dataset['directionBy'] = (this.sortDirection === 'asc') ? 'desc' : 'asc';
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
    this.onModal.emit({type: type, action: 'show'});
  }

  deleteUser($event: any, type: string) {
    alert('delete');
  }

  addUser($event: any, type: string) {
    this.onModal.emit({type: type, action: 'show'});
  }
}
