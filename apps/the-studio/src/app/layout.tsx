"use client";
import "./globals.css";
import "./satoshi.css";

import { useState, useEffect, useContext, Suspense } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import { AuthProvider } from "@/context/AuthContext";
import AppLoading from "@/components/AppLoading";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <html suppressHydrationWarning lang="en">
        <body>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            <AppLoading>
              <div className="flex h-screen overflow-hidden">
                {/* <!-- ===== Sidebar Start ===== --> */}
                {
                  <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                }

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                  {/* <!-- ===== Header Start ===== --> */}
                  {
                    <Header
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />
                  }

                  {/* <!-- ===== Main Content Start ===== --> */}
                  <main>
                    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                      {children}
                    </div>
                  </main>
                </div>
              </div>
            </AppLoading>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
