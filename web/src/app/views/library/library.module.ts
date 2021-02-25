import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {ListboxModule} from 'primeng/listbox';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputTextModule} from 'primeng/inputtext';

import { LibraryListComponent } from './list/library-list.component';
import { ManageLibraryComponent } from './manage/manage-library.component';

import { LibraryService } from './services/library.service';
import { LibraryRoutingModule } from './library-routing.module';

@NgModule({
    imports: [
        FormsModule,
        ButtonModule,
        ToastModule,
        ListboxModule,
        ConfirmDialogModule,
        InputTextModule,
        LibraryRoutingModule
    ],
    declarations: [
        LibraryListComponent,
        ManageLibraryComponent
    ],
    providers: [ LibraryService ]
})
export class LibraryModule { }
