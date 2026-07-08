import type { ReactNode } from "react";

export const metadata = {
  title: "Open Sync Next.js Demo",
  description: "Local-first CRUD demo powered by Open Sync."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
