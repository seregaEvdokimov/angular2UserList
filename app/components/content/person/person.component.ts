/**
 * Created by s.evdokimov on 05.01.2017.
 */

import {Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
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
  person: IUser = null;
  subscription: Subscription;

  constructor(private route: ActivatedRoute, private location: Location, private communicate: CommunicateService) {
    this.subscription = this.communicate.personOn.subscribe((props: any) => {
      switch(props.type) {
        case FETCH_PERSON_INFORM:
          if(props.payload.length !== undefined && !props.payload.length) this.location.back();
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
