import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgxStepperModule } from '@valentingavran/ngx-stepper';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, NgxStepperModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
