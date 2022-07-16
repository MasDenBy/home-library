import { join } from 'path-browserify';

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
    private root: string;

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
            followingPath = join(this.currentPath, path);
        } else {
            followingPath = path;
        }

        this.openPath(followingPath);
    }

    back(): void {
        if (!this.currentPath || this.currentPath.length === 1) {
            return;
        }

        const separator = '/';
        const parts = this.currentPath.split(separator);

        if(parts.length > 1) {
            parts.pop();
        }

        let path = parts.join(separator);

        if(path.length < this.root.length) {
            path = this.root;
        }

        this.openPath(path);
    }

    private openPath(path: string = ''): void {
        this.fileManagerService.getPaths(path).subscribe((data: IPath) => {
            this.folders = data.folders;
            this.currentPath = data.path;
            if(!this.root) {
                this.root = data.path;
            }
        });
    }
}
