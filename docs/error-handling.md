# Error Handling

Open Sync throws `OpenSyncError` for public API failures. The error has a stable `code` field that apps can use for recovery flows and UI messages.

```ts
import { OpenSyncError } from "@open-sync/core";

try {
  await sync.collection("tasks").update("missing", { title: "Nope" });
} catch (error) {
  if (error instanceof OpenSyncError && error.code === "record_not_found") {
    showToast("That task no longer exists.");
  }
}
```

## Error Codes

### `collection_not_registered`

Thrown when `sync.collection(name)` is called for a collection not listed in `createSyncEngine({ collections })`.

### `record_not_found`

Thrown when updating or deleting a missing record, or a record that has already been tombstoned locally.

### `duplicate_record`

Thrown when creating a record with an `id` that already exists as an active record in the same collection.

### `conflict_not_found`

Thrown when resolving a conflict id that does not exist.

### `manual_resolution_required`

Thrown when resolving a conflict with strategy `manual` without passing a replacement record.

### `adapter_error`

Thrown when `sync.syncNow()` fails outside the per-operation retry path. Individual queued operation failures are usually recorded on the operation as `lastError` and exposed through queue APIs/events.

### `invalid_configuration`

Thrown by React bindings when `<SyncProvider>` receives neither `sync` nor `config`.

### `provider_missing`

Thrown by React hooks when they are used outside `<SyncProvider>`.

## Adapter Failures

Adapter failures during queued operations do not immediately throw to the UI. Open Sync records the error on the operation, increments `retryCount`, and either schedules a retry or marks the operation `failed`.

```ts
const failed = await sync.queue.list("failed");
console.log(failed[0]?.lastError);
```

Use queue APIs and events for recovery:

```ts
sync.on("operation:error", (operation) => {
  reportError(operation.lastError);
});
```