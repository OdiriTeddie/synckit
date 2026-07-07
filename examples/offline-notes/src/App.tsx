import { useState } from "react";
import { createRoot } from "react-dom/client";
import { SyncProvider, useCollection, useCreate, useSyncStatus } from "@synckit/react";
import type { SyncAdapter, SyncRecord } from "@synckit/core";

interface Note extends SyncRecord {
  title: string;
  body: string;
}

const adapter: SyncAdapter = {
  async create(_collection, record) {
    return record;
  },
  async update() {},
  async delete() {},
  async pull() {
    return [];
  }
};

function Notes() {
  const { records } = useCollection<Note>("notes");
  const createNote = useCreate<Note>("notes");
  const status = useSyncStatus();
  const [body, setBody] = useState("");

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
      <header>
        <h1>Offline Notes</h1>
        <p>{status?.pending ?? 0} queued changes</p>
      </header>
      <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={8} style={{ width: "100%" }} />
      <button onClick={() => void createNote({ title: body.slice(0, 32) || "Untitled", body }).then(() => setBody(""))}>Save note</button>
      {records.map((note) => (
        <article key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.body}</p>
        </article>
      ))}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <SyncProvider config={{ dbName: "synckit-offline-notes", collections: ["notes"], adapter }}>
    <Notes />
  </SyncProvider>
);
