/**
 * Created by s.evdokimov on 23.12.2016.
 */

import {Component} from '@angular/core';

import {IUser} from '../../../assets/interfaces/user';
import {USERS} from '../../../assets/interfaces/user';


@Component({
  moduleId: module.id,
  selector: 'user-list-component',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.css']
})

export class UserlistComponent {
  userList: IUser[] = [];

  constructor() {
    this.userList = this.formatData(USERS);
  }

  formatData(data: IUser[]): IUser[] {
    data.forEach(function(item) {

      let date: any = new Date(item.birth);
      date = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

      item.startDate = date;
    });

    return data;
  }
}
