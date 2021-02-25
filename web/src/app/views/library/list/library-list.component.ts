import { Component, OnInit } from '@angular/core';

import {ConfirmationService, MessageService} from 'primeng/api';

import { ILibrary } from '../models/library.model';
import { LibraryService } from '../services/library.service';


@Component({
    templateUrl: './library-list.component.html',
    selector: 'app-library-list',
    styleUrls: ['./library-list.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class LibraryListComponent implements OnInit {
    constructor(
        private libraryService: LibraryService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService) {}

    Libraries: ILibrary[];

    ngOnInit(): void {
        this.getLibraries();
    }

    delete(id: number): void {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this library folder?',
            accept: () => {
                this.libraryService.delete(id).subscribe(
                    x => null,
                    error => this.messageService.add({severity: 'error', summary: 'Library folder was not deleted'}),
                    () => {
                        this.messageService.add({severity: 'success', summary: 'Library folder was deleted'});
                        this.getLibraries();
                    }
                );
            }
        });
    }

    private getLibraries(): void {
        this.libraryService.getLibraries().subscribe((data: ILibrary[]) => {
            this.Libraries = data;
        });
    }
}
