"use client";

import { useState, useRef } from "react";
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadModalProps {
    onClose: () => void;
    onUpload: (url: string) => void;
}

export default function ImageUploadModal({ onClose, onUpload }: ImageUploadModalProps) {
    const [tab, setTab] = useState<"upload" | "url">("upload");
    const [url, setUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    onUpload(event.target.result as string);
                    onClose();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlSubmit = () => {
        if (url) {
            onUpload(url);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">Add Image</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Choose your source</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex bg-gray-50/50 p-2 m-4 rounded-2xl border border-gray-100">
                    <button
                        onClick={() => setTab("upload")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            tab === "upload" ? "bg-white text-blue-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <Upload className="h-3.5 w-3.5" />
                        Upload
                    </button>
                    <button
                        onClick={() => setTab("url")}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            tab === "url" ? "bg-white text-blue-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <LinkIcon className="h-3.5 w-3.5" />
                        Link URL
                    </button>
                </div>

                <div className="p-6 pt-0 flex-1">
                    {tab === "upload" ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="h-48 border-2 border-dashed border-gray-100 rounded-[1.5rem] bg-gray-50/20 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-blue-50/30 hover:border-blue-200 transition-all group"
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                            <div className="h-12 w-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-blue-600 border border-gray-100 group-hover:scale-110 transition-transform">
                                <Upload className="h-6 w-6" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Select a file</p>
                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">JPG, PNG or GIF up to 5MB</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Image Address</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="w-full pl-9 rounded-xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none bg-white shadow-sm"
                                        placeholder="Paste link here..."
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleUrlSubmit}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                            >
                                Insert Image
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
