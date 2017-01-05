/**
 * Created by s.evdokimov on 05.01.2017.
 */

import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/subject';

@Injectable()
export class CommunicateService {
  constructor() {}

  // Observable string sources
  private appCmpSource = new Subject();
  private personSource = new Subject();
  private userListSource = new Subject();

  // Observable string streams
  appCmpOn = this.appCmpSource.asObservable();
  personOn = this.personSource.asObservable();
  userListOn = this.userListSource.asObservable();

  // Service message commands
  appCmpEmit(data: any) {
    this.appCmpSource.next(data);
  }

  personEmit(data: any) {
    this.personSource.next(data);
  }

  userListEmit(data: any) {
    this.userListSource.next(data);
  }
}
