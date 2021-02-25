import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorage } from './common';
import { Constants } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  constructor(
    private router: Router,
    private sessionStorage: SessionStorage){}

  search(pattern: string): void {
    if (pattern) {
      this.sessionStorage.setItem(Constants.OffsetKey, '0');

      this.router.navigateByUrl(`/books/search/${pattern}`);
    }
  }
}
