# Migrations

Open Sync supports lightweight schema migration hooks through `schemaVersion` and `migrate` on `createSyncEngine`.

```ts
const sync = createSyncEngine({
  dbName: "app",
  collections: ["tasks"],
  adapter,
  schemaVersion: 2,
  async migrate({ db, fromVersion, toVersion }) {
    console.log(`Migrating from ${fromVersion} to ${toVersion}`);
    await db.meta.put({ key: "migrated:v2", value: true });
  }
});
```

## When Migrations Run

The migration hook runs when the configured `schemaVersion` is greater than the database version already opened by the browser. Open Sync keeps its internal stores stable:

- `records`
- `queue`
- `conflicts`
- `meta`

Use migrations for app-level metadata changes, record backfills, queue cleanup, or one-off local state transitions.

## Migration Context

The migration receives:

- `db`: the `OpenSyncDatabase` instance.
- `fromVersion`: currently `1` for the base schema.
- `toVersion`: the configured `schemaVersion`.

## Guidelines

- Keep migrations idempotent where possible.
- Avoid long-running network work inside migrations.
- Prefer writing migration markers into `db.meta`.
- Test migrations against existing databases before releasing.
- Do not delete pending queue operations unless the user has a recovery path.

## Example: Backfill Records

```ts
async migrate({ db }) {
  const records = await db.records.toArray();
  for (const record of records) {
    if (!record.updatedAt) {
      await db.records.update(record.storageId, {
        updatedAt: new Date().toISOString()
      });
    }
  }
}
```