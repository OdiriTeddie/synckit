import Dexie, { type Table } from "dexie";
import type { QueuedOperation, SyncConflict, SyncRecord } from "@synckit/shared";

export interface StoredRecord extends SyncRecord {
  storageId: string;
  collection: string;
}

export class SyncKitDatabase extends Dexie {
  records!: Table<StoredRecord, string>;
  queue!: Table<QueuedOperation, string>;
  conflicts!: Table<SyncConflict, string>;
  meta!: Table<{ key: string; value: unknown }, string>;

  constructor(dbName: string) {
    super(dbName);

    this.version(1).stores({
      records: "storageId, id, collection, [collection+id], updatedAt, deletedAt",
      queue: "id, collection, status, createdAt, nextAttemptAt, [status+createdAt]",
      conflicts: "id, collection, recordId, resolvedAt",
      meta: "key"
    });
  }
}
