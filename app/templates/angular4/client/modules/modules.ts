import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    WelcomeComponent
  ],
  bootstrap: [ WelcomeComponent ]
})
export class AppModule { }
