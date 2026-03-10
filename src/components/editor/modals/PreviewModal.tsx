"use client";

import React, { useState } from "react";
import { X, Monitor, Smartphone, ExternalLink } from "lucide-react";
import { EditorBlock } from "@/lib/editor-types";
import { cn } from "@/lib/utils";
import EmailCanvas from "../EmailCanvas";

interface PreviewModalProps {
    blocks: EditorBlock[];
    onClose: () => void;
}

export default function PreviewModal({ blocks, onClose }: PreviewModalProps) {
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-2xl z-10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="h-8 w-px bg-gray-100" />
                    <div>
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Preview Mode</h2>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">Test your email responsiveness</p>
                    </div>
                </div>

                {/* Viewport Toggles */}
                <div className="flex items-center gap-1 rounded-[24px] bg-gray-50 p-1.5 border border-gray-100 shadow-inner">
                    <button
                        onClick={() => setPreviewMode("desktop")}
                        className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            previewMode === "desktop"
                                ? "bg-white text-blue-600 shadow-xl scale-105"
                                : "text-gray-400 hover:text-gray-900"
                        )}
                    >
                        <Monitor className="h-4 w-4" />
                        Desktop
                    </button>
                    <button
                        onClick={() => setPreviewMode("mobile")}
                        className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            previewMode === "mobile"
                                ? "bg-white text-blue-600 shadow-xl scale-105"
                                : "text-gray-400 hover:text-gray-900"
                        )}
                    >
                        <Smartphone className="h-4 w-4" />
                        Mobile
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
                        <ExternalLink className="h-4 w-4" />
                        Send Test Email
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-gray-100/50 overflow-y-auto p-12 custom-scrollbar flex justify-center">
                <div
                    className={cn(
                        "bg-white transition-all duration-500 ease-in-out shadow-[0_64px_128px_-24px_rgba(0,0,0,0.1)] overflow-hidden",
                        previewMode === "mobile" ? "w-[375px]" : "w-[600px]"
                    )}
                >
                    <EmailCanvas
                        blocks={blocks}
                        previewMode={previewMode}
                        onSelect={() => { }}
                        onDelete={() => { }}
                        selectedId={null}
                    />
                </div>
            </div>
        </div>
    );
}
