/**
 * Created by s.evdokimov on 28.12.2016.
 */

import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';

import {IUser} from '../interfaces/user';

import {FETCH_PERSON_INFORM} from '../../components/content/person/actions';
import {FETCH_USER_LIST, USER_NEW} from '../../components/content/user-list/actions';

@Injectable()
export class UserService {
  url: string = 'http://localhost:4001/user';
  users: IUser[] = [];
  count: number = null;

  sortType: string = 'id';
  sortDirection: string = 'asc';

  constructor(private http: Http) {}

  loadUsers(payload: any, callback: any): void {
    let params = new URLSearchParams();
    params.set('start', payload.start + '');
    params.set('limit', payload.limit + '');

    this.http.get(this.url, {search: params}).subscribe(res => {
      this.users = this.equivalent(res.json());
      this.count = this.users.length;
      this.sort({
        type: this.sortType,
        direction: this.sortDirection
      }, callback);
    });
  }

  loadUser(id: number, callback: any): void {
    let params = new URLSearchParams();
    params.set('id', id + '');

    this.http.get(this.url, {search: params}).subscribe(res => {
      callback({
        type: FETCH_PERSON_INFORM,
        payload: res.json()
      });
    });
  }

  createUser(payload: any, callback: any): any {
    this.http.post(this.url, payload.user).subscribe(res => {
      let user = res.json();
      this.users.push(user);
      this.users = this.equivalent(this.users);

      callback({
        type: FETCH_USER_LIST,
        payload: {users: this.users}
      });
      callback({
        type: USER_NEW,
        payload: {user: user}
      });
    });
  }

  updateUser(payload: any, callback: any): any {
    let compare: boolean = this.compare(payload.user);
    if(!compare) {
      this.http.put(this.url, payload.user).subscribe(res => {
        this.users = this.users.map(function(item) {
          if(item.id === res.json().id) item = res.json();
          return item;
        });
        this.users = this.equivalent(this.users);
        callback({
          type: FETCH_USER_LIST,
          payload: {users: this.users}
        });
      });
    } else {
      callback({
        type: FETCH_USER_LIST,
        payload: {users: this.users}
      });
    }
  }

  searchUser(data: any): IUser[] {
    let search = this.users.filter(function(item) {
      return item.name.indexOf(data.search) !== -1;
    });

    return search;
  }

  deleteUser(payload: any, callback: any): any {
    let params = new URLSearchParams();
    params.set('id', payload.id + '');

    this.http.delete(this.url, {search: params}).subscribe(res => {
      this.users = this.users.reduce(function(acc, item) {
        if(item.id !== res.json().id) acc.push(item);
        return acc;
      }, []);
      this.users = this.equivalent(this.users);
      callback({
        type: FETCH_USER_LIST,
        payload: {users: this.users}
      });
    });
  }


  compare(data: IUser): boolean {
    let res: boolean = true;
    let user = this.getById(data.id);

    for(let index in data) {
      let v1 = data[index];
      let v2 = user[index];

      if(index === 'birth' || index === 'date') {
        let timestamp1 = new Date(v1).getTime();
        let timestamp2 = new Date(v2).getTime();
        if (timestamp1 !== timestamp2) {
          res = false;
          break;
        }
      } else {
        if (v1 !== v2) {
          res = false;
          break;
        }
      }
    }
    return res;
  }

  equivalent(data: IUser[]): IUser[] {
    data.forEach(function(item) {
      let date: any = new Date(item.birth);
      var dateMonth = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      var dateDay = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();

      item.startDate = dateDay + '.' + dateMonth + '.' + date.getFullYear();
    });

    return data;
  }

  sort(payload: any, callback: any): void {
    this.sortType = payload.type || this.sortType;
    this.sortDirection = payload.direction || this.sortDirection;

    this.users = this.getAll().sort((v1, v2) => {
      let p1 = (this.sortType == 'date' || this.sortType == 'birth') ? new Date(v1[this.sortType]).getTime() : v1[this.sortType];
      let p2 = (this.sortType == 'date' || this.sortType == 'birth') ? new Date(v2[this.sortType]).getTime() : v2[this.sortType];
      let res = 0;

      if (this.sortDirection == 'asc') res = (p1 > p2) ? 1 : -1;
      if (this.sortDirection == 'desc') res = (p1 > p2) ? -1 : 1;
     return res;
    });

    callback({
      type: FETCH_USER_LIST,
      payload: {users: this.users}
    });
  }

  getCount(): number {
    return this.count;
  }

  getAll(): IUser[] {
    return this.users;
  }

  getById(id: number, callback?: any): any {
    let user = this.users.filter(item => item.id === id)[0];

    if(!user) {
      this.loadUser(id, callback);
    } else {
      return user;
    }
  }
}
