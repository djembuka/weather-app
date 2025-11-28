const CACHE_TTL = 10 * 60 * 1_000;

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

export class Cache {
    private prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix.toLocaleLowerCase();
    }

    storage = localStorage;

    getKey = (name: string): string => {
        return `${this.prefix}_${name.toLocaleLowerCase()}`;
    };

    get<T>(name: string): T | null {
        const key = this.getKey(name);
        const raw = this.storage.getItem(key);
        if (!raw) return null;

        try {
            const entry: CacheEntry<T> = JSON.parse(raw);

            if (Date.now() - entry.timestamp > CACHE_TTL) {
                this.storage.removeItem(key);
                return null;
            }

            return entry.data;
        } catch {
            return null;
        }
    }

    set<T>(name: string, data: T): void {
        const key = this.getKey(name);
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now()
        };

        this.storage.setItem(key, JSON.stringify(entry));
    }
};