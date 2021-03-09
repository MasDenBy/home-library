import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { EditorModule } from 'primeng/editor';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';

import { BooksRoutingModule } from './books-routing.module';

import { BooksListComponent } from './list/books-list.component';
import { BookDetailsComponent } from './details/book-details.component';
import { BookEditComponent } from './edit/book-edit.component';
import { BookService } from './services/book.service';
import { ImageService, SessionStorage, WindowWrapper } from '../../common';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ButtonModule,
        BooksRoutingModule,
        DataViewModule,
        InputTextModule,
        InputNumberModule,
        EditorModule,
        SplitButtonModule,
        ConfirmDialogModule,
        ToastModule
    ],
    declarations: [
        BookDetailsComponent,
        BookEditComponent,
        BooksListComponent
    ],
    providers: [
        BookService,
        ImageService,
        SessionStorage,
        ConfirmationService,
        MessageService,
        WindowWrapper
    ]
})
export class BooksModule { }
