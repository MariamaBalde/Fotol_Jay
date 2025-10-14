import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Platform } from '@angular/cdk/platform';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [Platform]
})
export class AppModule { }