import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import "./auth.css";

export const metadata: Metadata = {
  title: "PayFlow — Get paid without the awkward follow-up.",
  description: "A simple payment follow-up workspace for freelancers and solo service businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
