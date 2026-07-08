"use client";

import { useState } from "react";
import { SyncProvider, useCollection, useCreate, useDelete, useUpdate } from "@open-sync/react";
import type { SyncAdapter, SyncRecord } from "@open-sync/core";

interface Customer extends SyncRecord {
  name: string;
  plan: string;
}

const remote = new Map<string, SyncRecord>();
const adapter: SyncAdapter = {
  async create(_collection, record) {
    remote.set(record.id, record);
    return record;
  },
  async update(_collection, id, patch) {
    const record = { ...remote.get(id), ...patch } as SyncRecord;
    remote.set(id, record);
    return record;
  },
  async delete(_collection, id) {
    remote.delete(id);
  },
  async pull() {
    return [...remote.values()];
  }
};

function CrudDemo() {
  const { records } = useCollection<Customer>("customers");
  const createCustomer = useCreate<Customer>("customers");
  const updateCustomer = useUpdate<Customer>("customers");
  const deleteCustomer = useDelete("customers");
  const [name, setName] = useState("");

  return (
    <main style={{ maxWidth: 720, margin: "48px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Next.js CRUD Demo</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) return;
          void createCustomer({ name, plan: "Team" });
          setName("");
        }}
      >
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Customer name" />
        <button>Create</button>
      </form>
      {records.map((customer) => (
        <p key={customer.id}>
          {customer.name} · {customer.plan}
          <button onClick={() => void updateCustomer(customer.id, { plan: customer.plan === "Team" ? "Enterprise" : "Team" })}>Toggle plan</button>
          <button onClick={() => void deleteCustomer(customer.id)}>Delete</button>
        </p>
      ))}
    </main>
  );
}

export default function Page() {
  return (
    <SyncProvider config={{ dbName: "open-sync-nextjs-demo", collections: ["customers"], adapter }}>
      <CrudDemo />
    </SyncProvider>
  );
}
