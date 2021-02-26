import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BooksModule } from './views/books';
import { LibraryModule } from './views/library';

import {
  FileManagerService,
  HttpService,
  IndexService
} from './common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BooksModule,
    LibraryModule
  ],
  providers: [
    FileManagerService,
    HttpService,
    IndexService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
