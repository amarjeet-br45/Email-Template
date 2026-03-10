"use client";

import { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";

import { EditorBlock } from "@/lib/editor-types";

interface SendTestEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    blocks: EditorBlock[];
    templateName: string;
}

export default function SendTestEmailModal({ isOpen, onClose, blocks, templateName }: SendTestEmailModalProps) {
    const [recipientEmail, setRecipientEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!recipientEmail) {
            setStatus({ type: "error", message: "Please enter a recipient email." });
            return;
        }

        setIsSending(true);
        setStatus(null);

        try {
            const response = await fetch("/api/send-test-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toEmail: recipientEmail,
                    subject: `Test: ${templateName}`,
                    blocks: blocks,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: "success", message: "Test email sent successfully!" });
                setTimeout(() => {
                    onClose();
                    setRecipientEmail("");
                    setStatus(null);
                }, 2000);
            } else {
                setStatus({ type: "error", message: data.error || "Failed to send email." });
            }
        } catch (error) {
            setStatus({ type: "error", message: "Something went wrong. Please try again." });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md scale-100 transform rounded-[2rem] border border-white/10 bg-slate-900 p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Send Test Email</h2>
                        <p className="text-sm text-slate-400">Send a preview of "{templateName}"</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-widest text-blue-400">Recipient Email</label>
                        <input
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="verified-email@example.com"
                            className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                        />
                    </div>

                    {status && (
                        <div className={cn(
                            "rounded-xl p-3 text-sm font-bold",
                            status.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        )}>
                            {status.message}
                        </div>
                    )}

                    <button
                        onClick={handleSend}
                        disabled={isSending}
                        className="group relative flex w-full items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                Send Test Email
                            </>
                        )}
                    </button>

                    <p className="text-[10px] text-center text-slate-500 leading-relaxed">
                        Note: If you are in AWS SES Sandbox mode, you can only send to verified email addresses.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Utility to merge class names
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
