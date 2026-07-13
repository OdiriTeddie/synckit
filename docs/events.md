# Events

Open Sync exposes lifecycle events for observability, UI state, logging, and diagnostics. Subscribe with `sync.on(event, listener)`.

```ts
const unsubscribe = sync.on("sync:success", (status) => {
  console.log(status.lastSyncedAt);
});

unsubscribe();
```

## Available Events

### `sync:start`

Emitted when `sync.syncNow()` starts processing. Payload: `SyncStatus`.

```ts
sync.on("sync:start", (status) => {
  console.log(status.pending);
});
```

### `sync:success`

Emitted after pull and queue processing complete successfully. Payload: `SyncStatus`.

### `sync:error`

Emitted when `sync.syncNow()` fails outside an individual operation retry path. Payload:

```ts
{
  error: unknown;
  status: SyncStatus;
}
```

### `operation:success`

Emitted when a queued operation is successfully processed by the adapter. Payload: `QueuedOperation`.

### `operation:error`

Emitted when an adapter call fails for a queued operation and Open Sync either schedules a retry or marks it as failed. Payload: `QueuedOperation` with `lastError`, `retryCount`, and retry metadata.

### `conflict`

Emitted when the adapter reports `{ conflict: true }` and Open Sync stores a local conflict. Payload: `SyncConflict`.

## Status Subscriptions vs Events

Use `sync.subscribe(listener)` when UI needs the latest aggregate status:

```ts
const unsubscribe = sync.subscribe((status) => {
  renderBadge(status.pending, status.failed);
});
```

Use `sync.on()` for discrete lifecycle events, logs, toast notifications, and diagnostics.