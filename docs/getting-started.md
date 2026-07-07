# Getting Started

Install the core package and Dexie-backed engine:

```sh
pnpm add @synckit/core dexie
```

Create an engine with a database name, collection names, and a backend adapter.

```ts
const sync = createSyncEngine({
  dbName: "my-app",
  collections: ["tasks"],
  adapter
});
```
