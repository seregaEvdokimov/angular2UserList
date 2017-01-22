/**
 * Created by s.evdokimov on 23.12.2016.
 */


// MODULES
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {appRoutes} from './router';

// COMPONENTS
import {AppComponent}  from '../app.component';
import {HeaderComponent}  from '../components/header/header.component';
import {UserlistComponent}  from '../components/content/user-list/user-list.component';
import {PersonComponent}  from '../components/content/person/person.component';
import {ModalComponent}  from '../components/additional/modal/modal.component';
import {CreateModalComponent} from '../components/additional/modal/create/create.component';
import {UpdateModalComponent} from '../components/additional/modal/update/update.component';
import {ConfirmModalComponent} from '../components/additional/modal/confirm/confirm.component';
import {UploadModalComponent} from '../components/additional/modal/upload/upload.component';
import {TooltipComponent}  from '../components/additional/tooltip/tooltip.component';
import {NotifyComponent}  from '../components/additional/notify/notify.component';

// DIRECTIVES
import {LivetimeDirective} from '../assets/directives/livetime.directive';

// SERVICES
import {DictionaryService} from '../assets/services/dictionary.service';



// EXPORTS
export let imports = [
  BrowserModule,
  ReactiveFormsModule,
  HttpModule,
  RouterModule.forRoot(appRoutes)
];


export let declarations = [
  AppComponent,
  HeaderComponent,
  UserlistComponent,
  PersonComponent,
  ModalComponent,
  CreateModalComponent,
  UpdateModalComponent,
  UploadModalComponent,
  ConfirmModalComponent,
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
