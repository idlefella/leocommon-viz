import type { Metadata } from "next";
import "./globals.scss";
import { Sidebar } from "./sidebar";

export const metadata: Metadata = {
  title: "LeoCommon Explorer",
  description: "Lorem ipsum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      </head>
      <body className="layout-fluid">
        <div className="page">
          <aside
            className="navbar navbar-vertical navbar-expand-lg"
            data-bs-theme="dark"
          >
            <Sidebar />
          </aside>
          <div className="page-wrapper">{children}</div>
        </div>
      </body>
    </html>
  );
}
