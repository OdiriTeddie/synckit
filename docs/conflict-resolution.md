# Conflict Resolution

If an adapter returns `{ conflict: true, serverRecord }`, Open Sync stores a local conflict and marks the operation as conflicted.

```ts
const conflicts = await sync.conflicts.list();
await sync.conflicts.resolve(conflicts[0].id, "server-wins");
```

Supported strategies are `client-wins`, `server-wins`, and `manual`.
