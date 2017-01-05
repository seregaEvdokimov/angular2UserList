/**
 * Created by s.evdokimov on 05.01.2017.
 */

import {Routes} from '@angular/router';

import {UserlistComponent}  from '../components/content/user-list/user-list.component';
import {PersonComponent}  from '../components/content/person/person.component';


export const appRoutes: Routes = [
  {
    path: '',
    component: UserlistComponent
  },
  {
    path: 'user/:id',
    component: PersonComponent
  }
];
