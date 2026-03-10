"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Send,
    FileText,
    Workflow,
    Settings,
    ChevronRight,
    Database,
    Instagram,
    ShieldCheck,
    Mail,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

const menuItems = [
    { name: "Dashboard", href: "/email/dashboard", icon: LayoutDashboard },
    { name: "Audience", href: "/email/audience", icon: Users },
    { name: "Broadcasts", href: "/email/broadcasts", icon: Send },
    {
        name: "Content",
        href: "/email/templates",
        icon: FileText,
        children: [
            { name: "Templates", href: "/email/templates", icon: Mail },
            { name: "Product Feeds", href: "/email/product-feeds", icon: Database },
            { name: "Instagram Library", href: "/email/instagram-library", icon: Instagram },
            { name: "Social Proof Library", href: "/email/social-proof", icon: ShieldCheck },
        ]
    },
    { name: "Journeys", href: "/email/journeys", icon: Workflow },
    { name: "Settings", href: "/email/settings", icon: Settings },
];

function Tooltip({ text, show }: { text: string; show: boolean }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-[calc(100%+16px)] z-[100] whitespace-nowrap rounded-xl bg-slate-800 px-4 py-2 text-[14px] font-bold text-white shadow-2xl pointer-events-none flex items-center border border-white/10"
                >
                    {/* Speech Bubble Arrow */}
                    <div className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-slate-800 border-l border-b border-white/10" />
                    <span className="relative z-10">{text}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar, isMobileOpen, toggleMobile } = useSidebar();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
        if (pathname.startsWith("/email/templates") ||
            pathname.startsWith("/email/product-feeds") ||
            pathname.startsWith("/email/instagram-library") ||
            pathname.startsWith("/email/social-proof")) {
            setExpandedItems((prev) => prev.includes("Content") ? prev : [...prev, "Content"]);
        }
    }, [pathname]);

    const toggleExpand = (name: string) => {
        if (isCollapsed) {
            toggleSidebar();
            setExpandedItems((prev) => prev.includes(name) ? prev : [...prev, name]);
            return;
        }
        setExpandedItems((prev) =>
            prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
        );
    };

    if (!isMounted) return null;

    return (
        <motion.aside
            initial={{ x: -256 }}
            animate={{
                x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -256 : 0),
                width: isCollapsed ? 80 : 256,
            }}
            transition={{ duration: 0.15, ease: "linear" }}
            className={cn(
                "fixed left-0 top-0 z-50 h-screen border-r border-white/10 bg-slate-900 shadow-2xl overflow-x-hidden",
                "bg-gradient-to-b from-slate-900 via-slate-950 to-black transition-[width] duration-150 ease-linear"
            )}
        >
            <div className="relative flex h-full flex-col py-6">
                {/* Logo Section */}
                <div
                    onMouseEnter={() => isCollapsed && setHoveredItem("Logo")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                        "relative mb-10 flex items-center px-6 group cursor-pointer transition-all duration-150",
                        isCollapsed ? "justify-center px-0" : "justify-between"
                    )}
                >
                    <div className="flex items-center">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-[0_8px_16px_-4px_rgba(37,99,235,0.5)]">
                            <Mail className="h-5 w-5 text-white" />
                        </div>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.1 }}
                                className="ml-3 flex flex-col"
                            >
                                <span className="text-lg font-black text-white tracking-widest uppercase">Selixer</span>
                                <span className="text-[10px] font-medium text-blue-400 tracking-wider uppercase opacity-70">Email Template</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Toggle Button */}
                <div
                    onMouseEnter={() => isCollapsed && setHoveredItem("Toggle")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="absolute -right-3 top-8 z-[60] hidden lg:block"
                >
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSidebar();
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white shadow-xl transition-all active:scale-90"
                    >
                        <motion.div
                            animate={{ rotate: isCollapsed ? 0 : 180 }}
                            transition={{ duration: 0.15 }}
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </motion.div>
                    </button>
                    {isCollapsed && <Tooltip text={isCollapsed ? "Expand" : "Collapse"} show={hoveredItem === "Toggle"} />}
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 space-y-2 px-3 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth">
                    {menuItems.map((item) => {
                        const hasChildren = item.children && item.children.length > 0;
                        const isExpanded = expandedItems.includes(item.name) && !isCollapsed;
                        const isActive = pathname === item.href || (hasChildren && item.children?.some(child => pathname === child.href));

                        return (
                            <div
                                key={item.name}
                                className="relative group"
                                onMouseEnter={() => isCollapsed && setHoveredItem(item.name)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {hasChildren ? (
                                    <button
                                        onClick={() => toggleExpand(item.name)}
                                        className={cn(
                                            "group relative flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150",
                                            isActive
                                                ? "bg-white/10 text-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-bar"
                                                className="absolute left-0 h-6 w-1 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                                            />
                                        )}

                                        <item.icon className={cn(
                                            "h-5 w-5 shrink-0 transition-all duration-150",
                                            isActive ? "text-blue-400 scale-110" : "text-slate-500 group-hover:text-blue-300",
                                            isCollapsed ? "mx-auto" : "mr-3"
                                        )} />

                                        {!isCollapsed && (
                                            <>
                                                <span className="flex-1 text-left">{item.name}</span>
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                                    transition={{ duration: 0.1 }}
                                                >
                                                    <ChevronRight className="h-4 w-4 opacity-40 transition-transform" />
                                                </motion.div>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={() => isMobileOpen && toggleMobile()}
                                        className={cn(
                                            "group relative flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150",
                                            isActive
                                                ? "bg-white/10 text-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
                                        )}
                                    >
                                        {isActive && (
                                            <>
                                                <motion.div
                                                    layoutId="active-bar"
                                                    className="absolute left-0 h-6 w-1 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                                                />
                                                <div className="absolute inset-0 rounded-xl bg-blue-500/5 blur-md animate-pulse" />
                                            </>
                                        )}

                                        <item.icon className={cn(
                                            "h-5 w-5 shrink-0 transition-all duration-150",
                                            isActive ? "text-blue-400 scale-110" : "text-slate-500 group-hover:text-blue-300",
                                            isCollapsed ? "mx-auto" : "mr-3"
                                        )} />

                                        {!isCollapsed && (
                                            <span className="flex-1 tracking-wide">{item.name}</span>
                                        )}
                                    </Link>
                                )}

                                {isCollapsed && <Tooltip text={item.name} show={hoveredItem === item.name} />}

                                {/* Submenu items */}
                                <AnimatePresence>
                                    {hasChildren && isExpanded && !isCollapsed && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="ml-6 mt-1 space-y-1 overflow-hidden"
                                        >
                                            {item.children?.map((child) => {
                                                const isChildActive = pathname === child.href;
                                                return (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        onClick={() => isMobileOpen && toggleMobile()}
                                                        className={cn(
                                                            "group flex items-center rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-150",
                                                            isChildActive
                                                                ? "text-blue-400 bg-white/5"
                                                                : "text-slate-500 hover:text-slate-200 hover:translate-x-1"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "mr-3 h-1 w-1 rounded-full transition-all duration-300",
                                                            isChildActive ? "bg-blue-400 scale-150 shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "bg-slate-700 group-hover:bg-slate-400"
                                                        )} />
                                                        {child.name}
                                                    </Link>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="mt-auto pt-4 space-y-4 px-3">
                    {/* Logout Button */}
                    <div
                        onMouseEnter={() => isCollapsed && setHoveredItem("Logout")}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="relative group pb-4"
                    >
                        <button className={cn(
                            "group relative flex w-full items-center rounded-xl p-3 text-sm font-medium text-slate-400 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400",
                            isCollapsed ? "justify-center px-0" : ""
                        )}>
                            <LogOut className={cn(
                                "h-5 w-5 shrink-0 transition-transform duration-150",
                                isCollapsed ? "" : "mr-3"
                            )} />
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Logout
                                </motion.span>
                            )}
                            <div className="absolute inset-0 rounded-xl bg-red-500/0 blur-xl transition-all duration-150 group-hover:bg-red-500/5 pointer-events-none" />
                        </button>
                        {isCollapsed && <Tooltip text="Logout" show={hoveredItem === "Logout"} />}
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}
