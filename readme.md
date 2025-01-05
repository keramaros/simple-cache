# Simple Cache Class

This class provides a lightweight caching class that wraps the native JavaScript `Map()` object, offering a simple and efficient caching solution. The class is designed to manage in-memory data storage with features such as data retrieval, insertion, and removal.

## Features

- **Fast Access**: Built on top of `Map()`, ensuring quick insertion and retrieval.
- **Data Expiration**: Supports configurable expiration time for cached items.
- **Statistics**: Keeps track of cache hit/miss in total and per variable.

## Installation

Simply clone the repository and include the class in your project.

```bash
git clone https://github.com/keramaros/simple-cache.git
```

## Usage

Basic functionality described below

```typescript
const cache = new SimpleCache<number>(100) //100 ms life time

//set a cache variable
cache.set("first", 50)

//retrive a cache variable
const first = cache.get("first")

//delete a cache variable
cache.delete("first")

//get number of saved variables
cache.size

//reset cache
cache.clear()
```

The `handle` function checks if the variable exists; if it does, it returns the value; otherwise, it runs the function, sets the variable, and returns the value.

```typescript
const simple = cache.handle("sum", () => 100 + 10)

//or use promise
const value = await cache.handle("sum", async () => 100 + 10)
```