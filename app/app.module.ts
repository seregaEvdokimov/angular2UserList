import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';
import { HeaderComponent }  from './components/header/header.component';
import { UserlistComponent }  from './components/content/user-list/user-list.component';
import { ModalComponent }  from './components/additional/modal/modal.component';

import {LivetimeDirective} from './assets/directives/livetime.directive';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    AppComponent,
    HeaderComponent,
    UserlistComponent,
    ModalComponent,

    LivetimeDirective
  ],
  providers: [ModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
