import { Injectable } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable()
export class ImageService {
    constructor(private domSanitizer: DomSanitizer){}

    prepareBase64Image(image: string): SafeResourceUrl {
        if (!image) {
            return 'assets/images/no_image.png';
        }

        return this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${image}`);
    }
}
