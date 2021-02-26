import { DomSanitizer } from '@angular/platform-browser';

import { ImageService } from '../image.service';
import { TestBed } from '@angular/core/testing';

describe('ImageService', () => {
    let service: ImageService;
    let domSanitizer: jasmine.SpyObj<DomSanitizer>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ImageService,
                { provide: DomSanitizer, useValue: jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']) }
            ]
        });

        service = TestBed.inject(ImageService);
        domSanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
    });

    describe('prepareBase64Image', () => {
        it('should return no image when image is null', () => {
            const image = service.prepareBase64Image(null);

            expect(image).toEqual('/assets/images/no_image.png');
        });

        it('should bypassSecurityTrustResourceUrl when image is not null', () => {
            service.prepareBase64Image('image');

            expect(domSanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('data:image/png;base64,image');
        });
    });
});
