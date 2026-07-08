# API Reference

## `createSyncEngine(options)`

Creates an Open Sync engine.

- `dbName`: IndexedDB database name.
- `collections`: collection names to register.
- `adapter`: backend adapter.
- `autoSync`: defaults to `true`.
- `retryLimit`: defaults to `3`.

## Collection API

- `create(input)`
- `update(id, patch)`
- `delete(id)`
- `findById(id)`
- `findAll()`
- `clear()`

## Engine API

- `syncNow()`
- `getStatus()`
- `subscribe(listener)`
- `conflicts.list()`
- `conflicts.resolve(id, strategy, manualRecord)`
