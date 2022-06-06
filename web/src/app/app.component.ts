import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage } from './common';
import { LoadingComponent } from './common/components/loading/loading.component';
import { Constants } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  providers: [ LoadingComponent ]
})
export class AppComponent {
  constructor(
    private router: Router,
    private sessionStorage: SessionStorage){}

  search(pattern: string): void {
    if (pattern) {
      this.sessionStorage.setItem(Constants.offsetKey, '0');

      this.router.navigateByUrl(`/books/search/${pattern}`);
    }
  }
}
