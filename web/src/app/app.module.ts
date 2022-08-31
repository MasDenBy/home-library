import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BooksModule } from './views/books';
import { LibraryModule } from './views/library';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { LoadingComponent } from './common/components/loading/loading.component';
import { LoadingService } from './common/components/loading/loading.service';

import {
  FileManagerService,
  HttpService,
  IndexService,
  UiService,
  NetworkInterceptor
} from './common';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BooksModule,
    LibraryModule,
    ProgressSpinnerModule
  ],
  providers: [
    FileManagerService,
    HttpService,
    IndexService,
    LoadingService,
    UiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
