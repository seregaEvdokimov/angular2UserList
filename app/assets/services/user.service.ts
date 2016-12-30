/**
 * Created by s.evdokimov on 28.12.2016.
 */

import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {IUser} from '../interfaces/user';

@Injectable()
export class UserService {
  users: IUser[];
  count: number;

  sortType: string = 'id';
  sortDirection: string = 'asc';

  constructor(private http: Http) {}

  getUsers(payload: any): void {
    let params = new URLSearchParams();
    params.set('start', payload.start + '');
    params.set('limit', payload.limit + '');

    this.http.get('http://localhost:4001/user', {search: params}).subscribe(res => {
      this.users = this.equivalent(res.json());
      this.count = this.users.length;
      this.sort({
        type: this.sortType,
        direction: this.sortDirection,
        callback: payload.callback
      });
    });
  }

  createUser(payload: any): any {
    this.http.post('http://localhost:4001/user', payload.user).subscribe(res => {
      this.users.push(res.json());
      this.users = this.equivalent(this.users);
      payload.callback(this.users);
    });
  }

  updateUser(payload: any): any {
    let compare: boolean = this.compare(payload.user);
    if(!compare) {
      payload.user.birth = new Date(payload.user['birth']);
      payload.user.date = new Date(payload.user['date']);
      this.http.put('http://localhost:4001/user', payload.user).subscribe(res => {
        this.users = this.users.map(function(item) {
          if(item.id === res.json().id) item = res.json();
          return item;
        });
        this.users = this.equivalent(this.users);
        payload.callback(this.users);
      });
    } else {
      payload.callback(this.users);
    }
  }

  deleteUser(payload: any): any {
    let params = new URLSearchParams();
    params.set('id', payload.id + '');

    this.http.delete('http://localhost:4001/user', {search: params}).subscribe(res => {
      this.users = this.users.reduce(function(acc, item) {
        if(item.id !== res.json().id) acc.push(item);
        return acc;
      }, []);
      this.users = this.equivalent(this.users);
      payload.callback(this.users);
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
      item.startDate = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    });

    return data;
  }

  sort(payload: any): void {
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

    payload.callback(this.users);
  }

  getCount(): number {
    return this.count;
  }

  getAll(): IUser[] {
    return this.users;
  }

  getById(id: number): IUser {
    return this.users.filter(function(item) {
      return item.id === id;
    })[0];
  }
}