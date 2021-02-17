import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";

import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';

import { BooksRoutingModule } from './books-routing.module';

import { BooksList } from './list/books-list.component';
import { BookDetails } from './details/book-details.component';
import { BookEdit } from './edit/book-edit.component';
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
        EditorModule,
        SplitButtonModule,
        ConfirmDialogModule,
        ToastModule
    ],
    declarations: [
        BookDetails,
        BookEdit,
        BooksList
    ],
    providers:[
        BookService,
        ImageService,
        SessionStorage,
        ConfirmationService,
        MessageService,
        WindowWrapper
    ]
})
export class BooksModule { }