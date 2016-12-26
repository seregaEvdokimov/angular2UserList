import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';
import { HeaderComponent }  from './components/header/header.component';
import { UserlistComponent }  from './components/content/user-list/user-list.component';

import {LivetimeDirective} from './assets/directives/livetime.directive';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    AppComponent,
    HeaderComponent,
    UserlistComponent,

    LivetimeDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
