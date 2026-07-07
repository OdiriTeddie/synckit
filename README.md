# SyncKit

SyncKit is a framework-agnostic TypeScript sync engine for local-first web apps. It persists records in IndexedDB, applies optimistic mutations immediately, queues background sync operations, retries transient failures with exponential backoff, and exposes conflict resolution primitives.

```ts
import { createSyncEngine } from "@synckit/core";

const sync = createSyncEngine({
  dbName: "my-app",
  collections: ["tasks", "notes"],
  adapter
});

const task = await sync.collection("tasks").create({ title: "Buy milk" });
await sync.collection("tasks").update(task.id, { completed: true });
await sync.syncNow();
```

## Packages

- `@synckit/core`: IndexedDB storage, mutation queue, sync engine, retry logic, conflicts, and adapter contracts.
- `@synckit/react`: React provider and hooks that wrap the core package.
- `@synckit/shared`: Shared TypeScript utilities and public types.

## Documentation

See `docs/` for getting started, adapter authoring, sync flow, conflict resolution, offline mode, React integration, and API reference.
