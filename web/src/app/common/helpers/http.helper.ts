import { HttpResponse } from '@angular/common/http';

export class HttpHelper {
    public static getFileNameFromHttpResponse<T>(httpResponse: HttpResponse<T>): string {
        const contentDispositionHeader = httpResponse.headers.get('Content-Disposition');
        const result = contentDispositionHeader?.split(';')[1].trim().split('=')[1];
        return result?.replace(/"/g, '');
    }
}
