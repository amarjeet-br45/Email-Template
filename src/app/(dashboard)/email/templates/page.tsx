"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Send } from "lucide-react";
import { mockTemplates } from "@/lib/mock-data";
import { getSavedTemplates, deleteTemplate, SavedTemplate } from "@/utils/storage";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function TemplatesPage() {
    const [activeTab, setActiveTab] = useState<"library" | "saved">("library");
    const [searchQuery, setSearchQuery] = useState("");
    const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    useEffect(() => {
        if (activeTab === "saved") {
            setSavedTemplates(getSavedTemplates());
        }
    }, [activeTab]);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this template?")) {
            deleteTemplate(id);
            setSavedTemplates(getSavedTemplates());
            setOpenMenuId(null);
        }
    };

    const filteredTemplates = (activeTab === "library" ? mockTemplates : savedTemplates).filter((template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
                <Link
                    href="/email/templates/create"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-hover hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    Create a Template
                </Link>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("library")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                            activeTab === "library"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Template Library
                    </button>
                    <button
                        onClick={() => setActiveTab("saved")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
                            activeTab === "saved"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Saved Templates
                    </button>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredTemplates.map((template) => (
                        <div key={template.id} className="relative group">
                            <div className="flex flex-col rounded-xl border border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-md h-full relative">
                                <Link
                                    href={`/email/templates/editor/${template.id}`}
                                    className="aspect-[4/3] w-full overflow-hidden bg-gray-100 rounded-t-xl"
                                >
                                    <img
                                        src={template.image}
                                        alt={template.name}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                </Link>
                                <div className="flex items-center justify-between p-4">
                                    <Link
                                        href={`/email/templates/editor/${template.id}`}
                                        className="flex-1 truncate"
                                    >
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 truncate mr-2">
                                            {template.name}
                                        </h3>
                                    </Link>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === template.id ? null : template.id);
                                            }}
                                            className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>

                                        {openMenuId === template.id && (
                                            <div className="absolute right-0 top-full mt-1 w-32 rounded-lg bg-white p-1 shadow-xl border border-gray-100 z-50">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        alert(`Template "${template.name}" sent successfully!`);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                                                >
                                                    <Send className="h-3.5 w-3.5" />
                                                    Send mail
                                                </button>
                                                <Link
                                                    href={`/email/templates/editor/${template.id}`}
                                                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={(e) => handleDelete(e, template.id)}
                                                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-500">
                    <p>{searchQuery ? "No templates found matching your search." : activeTab === "library" ? "No templates available." : "No saved templates yet."}</p>
                    {activeTab === "saved" && !searchQuery && (
                        <button
                            onClick={() => setActiveTab("library")}
                            className="mt-2 text-blue-600 hover:underline"
                        >
                            Browse library
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
