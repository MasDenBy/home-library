import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BooksListComponent } from './list/books-list.component';
import { BookDetailsComponent } from './details/book-details.component';
import { BookEditComponent } from './edit/book-edit.component';

const routes: Routes = [
  { path: '', component: BooksListComponent },
  { path: 'books/:id', component: BookDetailsComponent },
  { path: 'books/:id/edit', component: BookEditComponent },
  { path: 'books/search/:pattern', component: BooksListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }
