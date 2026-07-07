import { useState } from "react";
import { createRoot } from "react-dom/client";
import { SyncProvider, useCollection, useCreate, useDelete, useSyncStatus, useUpdate } from "@synckit/react";
import type { SyncAdapter, SyncRecord } from "@synckit/core";
import "./styles.css";

interface Task extends SyncRecord {
  title: string;
  completed?: boolean;
}

const memory = new Map<string, SyncRecord>();
const adapter: SyncAdapter = {
  async create(_collection, record) {
    memory.set(record.id, record);
    return record;
  },
  async update(_collection, id, patch) {
    const next = { ...memory.get(id), ...patch } as SyncRecord;
    memory.set(id, next);
    return next;
  },
  async delete(_collection, id) {
    memory.delete(id);
  },
  async pull() {
    return [...memory.values()];
  }
};

function TodoApp() {
  const { records } = useCollection<Task>("tasks");
  const createTask = useCreate<Task>("tasks");
  const updateTask = useUpdate<Task>("tasks");
  const deleteTask = useDelete("tasks");
  const status = useSyncStatus();
  const [title, setTitle] = useState("");

  return (
    <main>
      <header>
        <h1>Offline Todo</h1>
        <span>{status?.online ? "Online" : "Offline"} · {status?.pending ?? 0} pending</span>
      </header>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim()) return;
          void createTask({ title: title.trim(), completed: false });
          setTitle("");
        }}
      >
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add a task" />
        <button>Add</button>
      </form>
      <ul>
        {records.map((task) => (
          <li key={task.id}>
            <label>
              <input checked={Boolean(task.completed)} type="checkbox" onChange={() => void updateTask(task.id, { completed: !task.completed })} />
              {task.title}
            </label>
            <button onClick={() => void deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <SyncProvider config={{ dbName: "synckit-react-todo", collections: ["tasks"], adapter }}>
    <TodoApp />
  </SyncProvider>
);
