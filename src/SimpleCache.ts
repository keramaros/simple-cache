export default class SimpleCache<T extends unknown> {
    protected map: Map<string, { date: Date, value: T, hit: number }> = new Map()
    public life: number
    public hit: number = 0
    public miss: number = 0
    public expired: number = 0

    constructor(life: number = 30_000) {
        this.life = life
    }

    get size(): number {
        return this.map.size
    }

    get(key: string): T | undefined {
        if (!this.map.has(key)) {
            this.miss++
            return undefined
        }
        const obj = this.map.get(key)
        if (!obj) {
            this.miss++
            return undefined
        }
        if (obj.date < new Date(Date.now() - this.life)) {
            this.expired++
            return undefined
        }
        obj.hit++
        this.hit++
        return obj.value
    }

    set(key: string, value: T): T {
        this.map.set(key, {
            date: new Date(),
            value,
            hit: this.map.get(key)?.hit ?? 0
        })
        return value
    }

    delete(key: string): boolean {
        return this.map.delete(key)
    }

    clear(): void {
        this.map.clear()
        this.hit = 0
        this.miss = 0
        this.expired = 0
    }

    handle(key: string, callback: () => T | Promise<T>): T | Promise<T> {
        const value = this.get(key)
        if (value !== undefined) return value

        const result = callback()

        if (result instanceof Promise) {
            return result.then((value) => this.set(key, value))
        }

        this.set(key, result)
        return result
    }
}