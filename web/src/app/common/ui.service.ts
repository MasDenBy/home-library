import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UiService {
    public searchPattern$: Observable<string>;

    private searchPatternSubject: BehaviorSubject<string>;

    constructor() {
        this.searchPatternSubject = new BehaviorSubject('');
        this.searchPattern$ = this.searchPatternSubject.asObservable();
    }

    public search(pattern: string): void {
        this.searchPatternSubject.next(pattern);
    }
}