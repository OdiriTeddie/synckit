# Queue Management

Open Sync stores every local mutation as a durable queued operation in IndexedDB. The queue is collection-aware and survives page reloads, tab closes, and offline sessions.

## Operation Shape

Queued operations include:

- `id`: queue operation id.
- `collection`: collection name.
- `type`: `create`, `update`, or `delete`.
- `recordId`: affected record id.
- `payload`: adapter payload for the mutation.
- `status`: `pending`, `syncing`, `synced`, `failed`, or `conflict`.
- `retryCount`: number of failed attempts.
- `createdAt`: ISO timestamp for queue ordering.
- `nextAttemptAt`: next retry time when backoff is active.
- `lastAttemptedAt`: last sync attempt timestamp.
- `lastError`: most recent adapter error message.
- `syncedAt`: timestamp when the operation was marked synced.

## Listing Operations

```ts
const all = await sync.queue.list();
const failed = await sync.queue.list("failed");
const pending = await sync.queue.list("pending");
```

`list()` returns operations ordered by `createdAt` so developers can render a queue inspector or support UI.

## Retrying Failed Operations

```ts
const [operation] = await sync.queue.list("failed");
await sync.queue.retry(operation.id);
await sync.syncNow();
```

`retry()` resets the operation to `pending`, clears `nextAttemptAt`, and clears `lastError`. It does not mutate the local record; it only schedules the existing operation for another sync attempt.

## Discarding Operations

```ts
await sync.queue.discard(operationId);
```

`discard()` removes an operation from the queue. Use it carefully: it does not roll back local IndexedDB state. It is intended for admin tooling, user-approved recovery flows, or situations where a developer has reconciled the local record manually.

## Clearing Synced Operations

```ts
await sync.queue.clearSynced();
```

Synced operations remain visible until cleared. This makes post-sync inspection possible, but production apps may periodically clear synced operations to keep IndexedDB small.

## Retry Policy

By default Open Sync retries failed operations up to 3 attempts using these delays:

```ts
[1000, 2000, 4000, 8000]
```

Customize retry behavior when creating the engine:

```ts
const sync = createSyncEngine({
  dbName: "app",
  collections: ["tasks"],
  adapter,
  retryLimit: 5,
  retryDelays: [500, 1000, 2000, 5000]
});
```

When the retry limit is exhausted, operations remain in `failed` status until retried, discarded, or otherwise resolved.