import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibraryListComponent } from './list/library-list.component';
import { ManageLibraryComponent } from './manage/manage-library.component';

const routes: Routes = [
  { path: '', component: LibraryListComponent },
  { path: 'libraries/manage', component: ManageLibraryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule { }
