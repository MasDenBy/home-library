import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { FileManagerService, IndexService } from '../../../common';
import { LibraryService } from '../services/library.service';
import { IPath } from 'src/app/models';

@Component({
    templateUrl: './manage-library.component.html',
    selector: 'app-manage-library',
    styleUrls: ['./manage-library.component.scss'],
    providers: [MessageService]
})
export class ManageLibraryComponent implements OnInit {
    folders: string[];
    currentPath: string;

    constructor(
        private fileManagerService: FileManagerService,
        private messageService: MessageService,
        private indexService: IndexService,
        private libraryService: LibraryService,
        private router: Router){}

    ngOnInit(): void {
        this.openPath();
    }

    save(): void {
        this.libraryService.create(this.currentPath).subscribe(
            x => this.indexService.indexLibrary(x).subscribe(),
            error => this.messageService.add({severity: 'error', summary: 'Library folder was not added'}),
            () => this.router.navigateByUrl('/libraries')
        );
    }

    openFolder(path: string): void {
        let followingPath;

        if (this.currentPath) {
            followingPath = this.currentPath.length === 1 ? `\\${path}` : `${this.currentPath}\\${path}`;
        } else {
            followingPath = path;
        }

        this.openPath(followingPath);
    }

    back(): void {
        if (!this.currentPath || this.currentPath.length === 1) {
            return;
        }

        const index = this.currentPath.lastIndexOf('\\');
        const path = index === 0 ? '\\' : this.currentPath.substring(0, index);

        this.openPath(path);
    }

    private openPath(path: string = ''): void {
        this.fileManagerService.getPaths(path).subscribe((data: IPath) => {
            this.folders = data.folders;
            this.currentPath = data.path;
        });
    }
}
