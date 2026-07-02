import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Incident Triage Copilot",
  description: "AI-powered incident classification, security flagging, and routing",
};

const themeScript = [
  "(() => {",
  "  try {",
  "    const stored = localStorage.getItem('incident-copilot-theme');",
  "    const theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');",
  "    document.documentElement.dataset.theme = theme;",
  "    document.documentElement.style.colorScheme = theme;",
  "  } catch {",
  "    document.documentElement.dataset.theme = 'dark';",
  "    document.documentElement.style.colorScheme = 'dark';",
  "  }",
  "})();",
].join("\n");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={geistSans.variable + " " + geistMono.variable + " h-full antialiased"}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
