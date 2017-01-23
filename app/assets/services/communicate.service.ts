/**
 * Created by s.evdokimov on 05.01.2017.
 */

import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/subject';

@Injectable()
export class CommunicateService {
  constructor() {}

  private appCmpSource = new Subject();
  appCmpOn = this.appCmpSource.asObservable();
  appCmpEmit(data: any) {
    this.appCmpSource.next(data);
  }


  private personSource = new Subject();
  personOn = this.personSource.asObservable();
  personEmit(data: any) {
    this.personSource.next(data);
  }


  private userListSource = new Subject();
  userListOn = this.userListSource.asObservable();
  userListEmit(data: any) {
    this.userListSource.next(data);
  }
}
