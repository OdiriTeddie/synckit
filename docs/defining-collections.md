# Defining Collections

Collections are registered when the engine is created. They are accessed dynamically:

```ts
const tasks = sync.collection("tasks");
await tasks.create({ title: "Buy milk" });
```

Every stored record receives `id`, `version`, and `updatedAt` metadata.
