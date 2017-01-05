/**
 * Created by s.evdokimov on 05.01.2017.
 */

import {Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

import {IUser} from '../../../assets/interfaces/user';

import {CommunicateService} from '../../../assets/services/communicate.service';

import {FETCH_PERSON_INFORM} from './actions';


@Component({
  moduleId: module.id,
  selector: 'person',
  templateUrl: 'person.component.html',
  styleUrls: ['person.component.css']
})


export class PersonComponent implements OnDestroy {
  params: any;
  subscription: Subscription;
  person: IUser = {
    id: null,
    name: null,
    email: null,
    date: null,
    birth: null,
    avatar: null,
    timePassed: null
  };


  constructor(private route: ActivatedRoute, private communicate: CommunicateService) {
    this.subscription = this.communicate.personOn.subscribe((props: any) => {
      switch(props.type) {
        case FETCH_PERSON_INFORM:
          this.person = props.payload;
          break;
      }
    });

    this.route.params.subscribe((params) => {
      this.params = params;
      this.communicate.appCmpEmit({
        type: FETCH_PERSON_INFORM,
        payload: params
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
