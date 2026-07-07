# React Integration

Use `@synckit/react` to provide an engine and consume collection state.

```tsx
<SyncProvider config={{ dbName: "app", collections: ["tasks"], adapter }}>
  <App />
</SyncProvider>
```

Hooks include `useCollection`, `useCreate`, `useUpdate`, `useDelete`, and `useSyncStatus`.
