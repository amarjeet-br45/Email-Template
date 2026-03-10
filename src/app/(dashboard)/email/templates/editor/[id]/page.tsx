"use client";

import { useState, use, useCallback, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
    X,
    Save,
    Send,
    Layout,
    Monitor,
    Smartphone,
    Undo,
    Redo
} from "lucide-react";
import { BlockType, EditorBlock } from "@/lib/editor-types";
import BlockPanel from "@/components/editor/BlockPanel";
import EmailCanvas from "@/components/editor/EmailCanvas";
import ImageUploadModal from "@/components/editor/modals/ImageUploadModal";
import PreviewModal from "@/components/editor/modals/PreviewModal";
import { saveTemplate, getTemplateById } from "@/utils/storage";
import { cn } from "@/lib/utils";
import SendTestEmailModal from "@/components/editor/modals/SendTestEmailModal";

const getDefaultContent = (type: BlockType) => {
    switch (type) {
        case "heading": return { text: "Text here", fontSize: 24, textAlign: "left", color: "#111827" };
        case "paragraph": return { text: "Start typing here...", lineHeight: 1.5, color: "#374151" };
        case "button": return {
            text: "Button text",
            link: "",
            backgroundColor: "#2563eb",
            textColor: "#ffffff",
            borderRadius: 4,
            paddingX: 20,
            paddingY: 10,
            width: "auto",
            align: "center"
        };
        case "image": return {
            url: "",
            width: 100,
            widthMode: "auto",
            alt: "",
            align: "center",
            link: "",
            linkAction: "Open Website",
            target: "_blank",
            padding: { top: 0, right: 0, bottom: 0, left: 0 }
        };
        case "divider": return { thickness: 1, color: "#e5e7eb", spacing: 20 };
        case "product-recommendation": return { title: "Product Title", price: "$0.00", image: "", ctaText: "Buy Now" };
        case "order-summary": return { items: [{ name: "Item", qty: 1, price: "$0.00" }], subtotal: "$0.00", shipping: "$0.00", total: "$0.00" };
        case "social": return {
            iconType: "circle-black",
            icons: [{ platform: "facebook", url: "https://facebook.com/" }, { platform: "twitter", url: "https://twitter.com/" }],
            align: "center",
            iconSize: 32,
            iconSpacing: 10
        };
        case "video": return { url: "" };
        case "menu": return { items: [{ label: "Link", url: "#" }], align: "center", color: "#374151" };
        case "columns": return { count: 2, columns: [{ id: `col-${Date.now()}-0`, blocks: [] }, { id: `col-${Date.now()}-1`, blocks: [] }] };
        case "html": return { html: "<div style='color: #999; text-align: center;'>Custom HTML Block</div>" };
        default: return {};
    }
};

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    // Initialize with a default text block as per requirements
    const [blocks, setBlocks] = useState<EditorBlock[]>([]);
    const [history, setHistory] = useState<{ past: EditorBlock[][], future: EditorBlock[][] }>({ past: [], future: [] });
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"design" | "settings">("design");
    const [templateName, setTemplateName] = useState(id === "blank" ? "Untitled Template" : `${id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isSendTestModalOpen, setIsSendTestModalOpen] = useState(false);
    const [imageToUpdateId, setImageToUpdateId] = useState<string | null>(null);

    // Set initial block
    useEffect(() => {
        if (id !== "blank") {
            const saved = getTemplateById(id);
            if (saved) {
                setBlocks(saved.blocks);
                setTemplateName(saved.name);
                return;
            }
        }

        if (blocks.length === 0) {
            setBlocks([{
                id: `block-initial-${Date.now()}`,
                type: "heading",
                content: { text: "Text here", fontSize: 24, textAlign: "left", color: "#d1d5db" } // Placeholder style
            }]);
        }
    }, [id]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addToHistory = useCallback((currentBlocks: EditorBlock[]) => {
        setHistory(prev => ({
            past: [...prev.past.slice(-19), blocks], // Keep last 20 states
            future: []
        }));
        setBlocks(currentBlocks);
    }, [blocks]);

    const undo = useCallback(() => {
        if (history.past.length === 0) return;
        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, history.past.length - 1);
        setHistory({
            past: newPast,
            future: [blocks, ...history.future]
        });
        setBlocks(previous);
    }, [blocks, history]);

    const redo = useCallback(() => {
        if (history.future.length === 0) return;
        const next = history.future[0];
        const newFuture = history.future.slice(1);
        setHistory({
            past: [...history.past, blocks],
            future: newFuture
        });
        setBlocks(next);
    }, [blocks, history]);

    const updateBlock = useCallback((id: string, content: any) => {
        const updated = blocks.map((b) => (b.id === id ? { ...b, content } : b))
            .map(b => {
                if (b.type === "columns") {
                    const colContent = b.content as any;
                    const newCols = colContent.columns.map((col: any) => ({
                        ...col,
                        blocks: col.blocks.map((nb: any) => nb.id === id ? { ...nb, content } : nb)
                    }));
                    return { ...b, content: { ...colContent, columns: newCols } };
                }
                return b;
            });
        addToHistory(updated);
    }, [blocks, addToHistory]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const isNew = active.data.current?.isNew;
        const type = active.data.current?.type as BlockType;

        if (over.id.toString().startsWith("slot-")) {
            const [_, blockId, colIndex] = over.id.toString().split("-");
            const newBlockId = `block-${Date.now()}`;
            const newBlock: EditorBlock = {
                id: newBlockId,
                type: type,
                content: getDefaultContent(type),
            };

            setBlocks((prev) => prev.map(b => {
                if (b.id === blockId) {
                    const colContent = b.content as any;
                    const newCols = [...colContent.columns];
                    newCols[parseInt(colIndex)].blocks = [...newCols[parseInt(colIndex)].blocks, newBlock];
                    return { ...b, content: { ...colContent, columns: newCols } };
                }
                return b;
            }));

            setSelectedBlockId(newBlockId);
            if (type === "image") {
                setImageToUpdateId(newBlockId);
                setIsUploadModalOpen(true);
            }
        }
        if (isNew && (over.id === "canvas" || blocks.some(b => b.id === over.id))) {
            const newBlockId = `block-${Date.now()}`;
            const newBlock: EditorBlock = {
                id: newBlockId,
                type: type,
                content: getDefaultContent(type),
            };

            // If dropped on an existing block, insert after it
            const overIndex = blocks.findIndex(b => b.id === over.id);
            if (overIndex !== -1) {
                const newBlocks = [...blocks];
                newBlocks.splice(overIndex + 1, 0, newBlock);
                addToHistory(newBlocks);
            } else {
                addToHistory([...blocks, newBlock]);
            }

            setSelectedBlockId(newBlockId);

            if (type === "image") {
                setImageToUpdateId(newBlockId);
                setIsUploadModalOpen(true);
            }
        }
        else if (!isNew && active.id !== over.id) {
            const oldIndex = blocks.findIndex((i) => i.id === active.id);
            const newIndex = blocks.findIndex((i) => i.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                addToHistory(arrayMove(blocks, oldIndex, newIndex));
            }
        }

        setActiveId(null);
    };

    const deleteBlock = useCallback((id: string) => {
        const filteredMain = blocks.filter((b) => b.id !== id);
        const updated = filteredMain.map(b => {
            if (b.type === "columns") {
                const colContent = b.content as any;
                const newCols = colContent.columns.map((col: any) => ({
                    ...col,
                    blocks: col.blocks.filter((nb: any) => nb.id !== id)
                }));
                return { ...b, content: { ...colContent, columns: newCols } };
            }
            return b;
        });
        addToHistory(updated);
        if (selectedBlockId === id) setSelectedBlockId(null);
    }, [blocks, selectedBlockId, addToHistory]);

    const handleImageUpload = (url: string) => {
        if (imageToUpdateId) {
            updateBlock(imageToUpdateId, { url });
            setIsUploadModalOpen(false);
            setImageToUpdateId(null);
        }
    };

    const handleSave = () => {
        const uniqueId = id === "blank" ? `template-${Date.now()}` : id;
        // Try to find the first image to use as preview
        let previewImage = "https://images.unsplash.com/photo-1626908013943-df94de54984c?q=80&w=400&h=300&auto=format&fit=crop";
        const imageBlock = blocks.find(b => b.type === "image");
        if (imageBlock && imageBlock.content.url) {
            previewImage = imageBlock.content.url;
        }

        saveTemplate({
            id: uniqueId,
            name: templateName,
            blocks: blocks,
            image: previewImage
        });

        if (id === "blank") {
            router.push(`/email/templates/editor/${uniqueId}`);
        }

        // Show success state or toast if needed
        alert("Template saved successfully!");
    };

    const findBlock = (id: string | null): EditorBlock | null => {
        if (!id) return null;
        for (const b of blocks) {
            if (b.id === id) return b;
            if (b.type === "columns") {
                for (const col of b.content.columns) {
                    for (const nb of col.blocks) {
                        if (nb.id === id) return nb as EditorBlock;
                    }
                }
            }
        }
        return null;
    };

    const selectedBlock = findBlock(selectedBlockId);

    const id_prefix = useId();

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-100 h-screen overflow-hidden font-sans">
            {/* Header - Branding removed as per requirements */}
            <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shrink-0 shadow-sm z-10 transition-all">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push("/email/templates")}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all hover:rotate-90"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="h-8 w-px bg-gray-100" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Email Title</span>
                        <input
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="text-sm font-black text-gray-900 focus:outline-none focus:text-blue-600 bg-transparent -ml-1 border-none focus:ring-0 p-0"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 rounded-2xl bg-gray-50 p-1.5 border border-gray-100">
                        <button
                            onClick={undo}
                            disabled={history.past.length === 0}
                            className={cn(
                                "rounded-xl p-2 transition-all",
                                history.past.length > 0 ? "text-gray-900 hover:bg-white shadow-sm" : "text-gray-300"
                            )}
                        >
                            <Undo className="h-4 w-4" />
                        </button>
                        <button
                            onClick={redo}
                            disabled={history.future.length === 0}
                            className={cn(
                                "rounded-xl p-2 transition-all",
                                history.future.length > 0 ? "text-gray-900 hover:bg-white shadow-sm" : "text-gray-300"
                            )}
                        >
                            <Redo className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="h-6 w-px bg-gray-100" />
                    <div className="flex items-center gap-1 rounded-2xl bg-gray-50 p-1.5 border border-gray-100">
                        <button
                            onClick={() => setPreviewMode("desktop")}
                            className={cn(
                                "rounded-xl p-2 transition-all",
                                previewMode === "desktop" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-900"
                            )}
                        >
                            <Monitor className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setPreviewMode("mobile")}
                            className={cn(
                                "rounded-xl p-2 transition-all",
                                previewMode === "mobile" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-900"
                            )}
                        >
                            <Smartphone className="h-4 w-4" />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsPreviewModalOpen(true)}
                        className="flex items-center gap-2 rounded-2xl border-2 border-gray-100 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-white hover:border-gray-200 transition-all active:scale-95"
                    >
                        <Layout className="h-4 w-4" />
                        Preview
                    </button>
                    <button
                        onClick={() => setIsSendTestModalOpen(true)}
                        className="flex items-center gap-2 rounded-2xl border-2 border-blue-100 bg-blue-50 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-blue-600 hover:bg-blue-100 transition-all active:scale-95"
                    >
                        <Send className="h-4 w-4" />
                        Send Test
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 rounded-2xl bg-gray-900 px-8 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-black transition-all active:scale-95"
                    >
                        <Save className="h-4 w-4" />
                        Save
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <DndContext
                    id={id_prefix}
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex-1 overflow-y-auto bg-gray-100 p-12 custom-scrollbar">
                        <EmailCanvas
                            blocks={blocks}
                            selectedId={selectedBlockId}
                            onSelect={setSelectedBlockId}
                            onDelete={deleteBlock}
                            previewMode={previewMode}
                        />
                    </div>

                    <aside className="w-[380px] border-l border-gray-100 bg-white flex flex-col shrink-0 z-20 shadow-[-8px_0_24px_rgba(0,0,0,0.03)]">
                        <div className="flex border-b border-gray-50">
                            <button
                                onClick={() => setActiveTab("design")}
                                className={cn(
                                    "flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 transition-all",
                                    activeTab === "design" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-300 hover:text-gray-500"
                                )}
                            >
                                Content
                            </button>
                            <button
                                onClick={() => setActiveTab("settings")}
                                className={cn(
                                    "flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b-4 transition-all",
                                    activeTab === "settings" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-300 hover:text-gray-500"
                                )}
                            >
                                Properties
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden bg-gray-50/10">
                            {activeTab === "design" ? (
                                <BlockPanel
                                    selectedBlock={selectedBlock}
                                    onUpdateBlock={updateBlock}
                                    onDeselect={() => setSelectedBlockId(null)}
                                    onDeleteBlock={deleteBlock}
                                    previewMode={previewMode}
                                    onPreviewModeChange={setPreviewMode}
                                />
                            ) : (
                                <div className="p-8 space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-300">Subject</label>
                                        <input type="text" className="w-full rounded-xl border border-gray-200 p-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none bg-white transition-all shadow-sm" placeholder="Template Subject" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-300">Preheader</label>
                                        <textarea className="w-full rounded-xl border border-gray-200 p-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none bg-white transition-all shadow-sm" placeholder="Preview text..." rows={5} />
                                    </div>
                                    <div className="pt-6 space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-300">Global Style</label>
                                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <span className="text-xs font-black uppercase tracking-tight text-gray-900">Background Color</span>
                                            <input type="color" defaultValue="#ffffff" className="h-10 w-10 p-0 rounded-xl border-none cursor-pointer shadow-inner" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    <DragOverlay dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                                active: {
                                    opacity: '0.3',
                                },
                            },
                        }),
                    }}>
                        {activeId ? (
                            <div className="flex flex-col items-center justify-center gap-4 rounded-[2.5rem] border-4 border-blue-600 bg-white p-8 shadow-[0_48px_80px_rgba(0,0,0,0.15)] scale-110 pointer-events-none w-[180px] transition-all">
                                <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <Layout className="h-8 w-8 text-blue-600" />
                                </div>
                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest block leading-none">Moving Block</span>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {isUploadModalOpen && (
                <ImageUploadModal
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={handleImageUpload}
                />
            )}

            {isPreviewModalOpen && (
                <PreviewModal
                    blocks={blocks}
                    onClose={() => setIsPreviewModalOpen(false)}
                />
            )}

            {isSendTestModalOpen && (
                <SendTestEmailModal
                    isOpen={isSendTestModalOpen}
                    onClose={() => setIsSendTestModalOpen(false)}
                    blocks={blocks}
                    templateName={templateName}
                />
            )}
        </div>
    );
}
