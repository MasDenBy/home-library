import { Component } from "@angular/core";
import { UiService } from "../../../common/ui.service";

@Component({
    templateUrl: './search.component.html',
    selector: 'app-search',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    constructor(
        private readonly uiService: UiService){}

    search(pattern: string): void {
        this.uiService.search(pattern);
    }
}
