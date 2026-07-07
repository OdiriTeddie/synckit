# Writing Adapters

Adapters define how SyncKit talks to your backend. SyncKit does not assume REST, GraphQL, RPC, or a specific database.

```ts
const adapter = {
  create: async (collection, record) => api.create(collection, record),
  update: async (collection, id, patch) => api.update(collection, id, patch),
  delete: async (collection, id) => api.remove(collection, id),
  pull: async (collection, since) => api.changedSince(collection, since)
};
```
