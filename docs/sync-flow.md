# Sync Flow

Mutations update IndexedDB immediately and enqueue an operation. `sync.syncNow()` pulls remote changes, then processes pending local operations sequentially.

Successful operations are marked `synced`. Failed operations are retried with exponential backoff.
