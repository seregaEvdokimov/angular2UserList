/**
 * Created by s.evdokimov on 23.12.2016.
 */

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent }  from '../app.component';
import { HeaderComponent }  from '../components/header/header.component';
import { UserlistComponent }  from '../components/content/user-list/user-list.component';
import { ModalComponent }  from '../components/additional/modal/modal.component';
import { TooltipComponent }  from '../components/additional/tooltip/tooltip.component';
import { NotifyComponent }  from '../components/additional/notify/notify.component';

import {LivetimeDirective} from '../assets/directives/livetime.directive';

import {DictionaryService} from '../assets/services/dictionary.service';

export let imports = [
  BrowserModule,
  ReactiveFormsModule,
  HttpModule
];

export let declarations = [
  AppComponent,
  HeaderComponent,
  UserlistComponent,
  ModalComponent,
  TooltipComponent,
  NotifyComponent,

  LivetimeDirective
];

export let providers = [
  DictionaryService
];

export let bootstrap = [
  AppComponent
];