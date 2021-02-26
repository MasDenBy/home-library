export class SessionStorage {
    private readonly storage: Storage;

    constructor() {
        this.storage = window.sessionStorage;
    }

    getItem(key: string): string | null {
        return this.storage.getItem(key);
    }

    setItem(key: string, value: string): void {
        this.storage.setItem(key, value);
    }
}
