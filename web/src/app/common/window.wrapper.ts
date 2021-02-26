import { Injectable } from '@angular/core';

@Injectable()
export class WindowWrapper {
    public createObjectURL(object: any): string {
        return window.URL.createObjectURL(object);
    }

    public revokeObjectURL(url: string): void{
        window.URL.revokeObjectURL(url);
    }
}
