import { Component } from '@angular/core';
import { LoadingComponent } from './common/components/loading/loading.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  providers: [ LoadingComponent ]
})
export class AppComponent {
}
