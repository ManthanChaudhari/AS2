"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          {/* <SidebarProvider>
            <AppSidebar />

            <SidebarInset className="flex flex-col min-h-screen">
              <Header />

              <main className="flex-1 p-6 bg-slate-50">
                {children}
              </main>

            </SidebarInset>
          </SidebarProvider> */}
           <main className="flex-1">
                {children}
              </main>
        </ClientProviders>
      </body>
    </html>
  );
}