"use client"

import * as React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeItem: string;
  setActiveItem: (item: string) => void;
  onOpenNewModal: () => void;
}

export function DashboardLayout({
  children,
  activeItem,
  setActiveItem,
  onOpenNewModal,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Header bar */}
      <Header
        collapsed={collapsed}
        onOpenNewModal={onOpenNewModal}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 p-4 sm:p-6 md:p-8 ${
          collapsed ? "md:pl-22" : "md:pl-68"
        }`}
      >
        <div className="mx-auto max-w-7xl space-y-6">{children}</div>
      </main>
    </div>
  );
}
