import {expect} from "chai"
import {describe, it} from "mocha"
import SimpleCache from "../src/SimpleCache.js"

describe("Setting and read variables", () => {
    const cache = new SimpleCache(100)

    it("set first variable", () => {
        const result = cache.set("one", 1)

        expect(result).to.equal(1)
        expect(cache.size).to.equal(1)

        expect(cache.hit).to.equal(0)
        expect(cache.miss).to.equal(0)
        expect(cache.expired).to.equal(0)
    })

    it("set second variable", () => {
        const result = cache.set("two", 1)

        expect(result).to.equal(1)
        expect(cache.size).to.equal(2)
    })

    it("get first variable", () => {
        expect(cache.get("one")).to.equal(1)
    })

    it("update the first variable", () => {
        const result = cache.set("one", 0)

        expect(result).to.equal(0)
        expect(cache.size).to.equal(2)
    })

    it("get first variable", () => {
        expect(cache.get("one")).to.equal(0)
    })

    it("get second variable", () => {
        expect(cache.get("two")).to.equal(1)
    })
})

describe("Test clear", () => {
    const cache = new SimpleCache(10)

    it("test clear", () => {
        expect(cache.set("two", 1)).to.equal(1)
        expect(cache.set("one", 1)).to.equal(1)
        expect(cache.get("one")).to.equal(1)
        expect(cache.hit).to.equal(1)

        cache.clear()

        expect(cache.miss).to.equal(0)
        expect(cache.get("one")).to.equal(undefined)
        expect(cache.miss).to.equal(1)
        expect(cache.get("two")).to.equal(undefined)
        expect(cache.miss).to.equal(2)
    })
})

describe("Test delete", () => {
    const cache = new SimpleCache(10)

    it("test delete", () => {
        expect(cache.set("two", 1)).to.equal(1)
        expect(cache.set("one", 1)).to.equal(1)
        expect(cache.get("one")).to.equal(1)
        expect(cache.hit).to.equal(1)

        cache.delete("one")

        expect(cache.miss).to.equal(0)
        expect(cache.get("one")).to.equal(undefined)
        expect(cache.miss).to.equal(1)
        expect(cache.get("two")).to.equal(1)
        expect(cache.hit).to.equal(2)
        expect(cache.miss).to.equal(1)
    })
})

describe("Setting variables isolation", () => {
    const first = new SimpleCache(100)
    const second = new SimpleCache(50)

    it("set first variable in first cache", () => {
        const result = first.set("one", 1)

        expect(result).to.equal(1)
        expect(first.size).to.equal(1)
        expect(second.size).to.equal(0)
    })

    it("set second variable in first cache", () => {
        const result = first.set("two", 1)

        expect(result).to.equal(1)
        expect(first.size).to.equal(2)
        expect(second.size).to.equal(0)
    })

    it("update the first variable in first cache", () => {
        const result = first.set("one", 0)

        expect(result).to.equal(0)
        expect(first.size).to.equal(2)
        expect(second.size).to.equal(0)
    })
})

describe("Test expiration", async () => {
    const cache = new SimpleCache(10)

    it("set first variable", async () => {
        expect(cache.set("one", 1)).to.equal(1)
        expect(cache.get("one")).to.equal(1)
        expect(cache.hit).to.equal(1)

        await new Promise(resolve => setTimeout(resolve, 20))
        expect(cache.get("one")).to.equal(undefined)
        expect(cache.hit).to.equal(1)
        expect(cache.expired).to.equal(1)
    })

    it("set first variable", async () => {
        expect(cache.set("one", 1)).to.equal(1)
        expect(cache.get("one")).to.equal(1)
        expect(cache.hit).to.equal(2)

        await new Promise(resolve => setTimeout(resolve, 20))
        expect(cache.get("one")).to.equal(undefined)
        expect(cache.hit).to.equal(2)
        expect(cache.expired).to.equal(2)
    })
})

describe("Test handle function", async () => {
    const cache = new SimpleCache(10)

    it("handle first variable", () => {
        expect(cache.get("one")).to.equal(undefined)
        expect(cache.handle("one", () => 1)).to.equal(1)
        expect(cache.hit).to.equal(0)

        expect(cache.get("one")).to.equal(1)
        expect(cache.hit).to.equal(1)
    })

    it("handle second variable with promise", async () => {
        expect(cache.get("two")).to.equal(undefined)
        expect(await cache.handle("two", async () => 2)).to.equal(2)
        expect(cache.hit).to.equal(1)

        expect(cache.get("two")).to.equal(2)
        expect(cache.hit).to.equal(2)
    })
})