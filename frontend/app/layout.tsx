import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "./pwa-register";

export const metadata: Metadata = {
  title: "SkillCircle | Find your people, build what matters",
  description: "A thoughtful network for students who want to learn, build, and find their next collaborator.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f6f7f2",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><PwaRegister />{children}</body>
    </html>
  );
}
