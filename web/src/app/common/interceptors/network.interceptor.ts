import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../components/loading/loading.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  private completedRequests = 0;
  constructor(private loader: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loader.loadingOn();
    this.totalRequests++;

    return next.handle(request).pipe(
      finalize(() => {
        this.completedRequests++;

        if (this.completedRequests === this.totalRequests) {
            this.loader.loadingOff();
            this.completedRequests = 0;
            this.totalRequests = 0;
          }
      })
    );
  }
}
