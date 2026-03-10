"use client";

import Sidebar from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/SidebarContext";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed, isMobileOpen, toggleMobile } = useSidebar();

    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar />

            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-4 lg:hidden bg-slate-900/50 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg">
                        <Menu className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Selixer</span>
                </div>
                <button
                    onClick={toggleMobile}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </header>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={toggleMobile}
                />
            )}

            <main className={cn(
                "flex-1 transition-all duration-150 ease-linear",
                isCollapsed ? "lg:ml-20" : "lg:ml-64",
                "pt-20 lg:pt-0" // Space for mobile header
            )}>
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </SidebarProvider>
    );
}
