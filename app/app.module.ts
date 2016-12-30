import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { HeaderComponent }  from './components/header/header.component';
import { UserlistComponent }  from './components/content/user-list/user-list.component';
import { ModalComponent }  from './components/additional/modal/modal.component';

import {LivetimeDirective} from './assets/directives/livetime.directive';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, HttpModule],
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
