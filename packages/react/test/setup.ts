import "fake-indexeddb/auto";

const databases: string[] = [];

Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
  configurable: true,
  value: true
});

export function trackDatabase(name: string): string {
  databases.push(name);
  return name;
}

function deleteDatabase(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error(`Deleting IndexedDB database ${name} was blocked.`));
  });
}

export async function cleanupDatabases(): Promise<void> {
  while (databases.length) {
    await deleteDatabase(databases.pop()!);
  }
}