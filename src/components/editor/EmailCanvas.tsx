"use client";

import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Plus, GripVertical, Trash2, ExternalLink, Columns as ColumnsIcon, X,
    Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Slack,
    MessageCircle, Mail, Globe, Phone, MapPin, User
} from "lucide-react";
import {
    EditorBlock, HeadingContent, ParagraphContent, ButtonContent,
    ImageContent, SocialContent, DividerContent, MenuContent,
    HTMLContent, ProductContent, OrderSummaryContent, VideoContent,
    ColumnContent, IconType
} from "@/lib/editor-types";
import { cn } from "@/lib/utils";

const PLATFORM_ICONS: Record<string, any> = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    github: Github,
    slack: Slack,
    whatsapp: MessageCircle,
    email: Mail,
    website: Globe,
    phone: Phone,
    map: MapPin,
    profile: User,
};

interface SortableRowProps {
    block: EditorBlock;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate?: (id: string, content: any) => void;
    isNested?: boolean;
}

function ColumnSlot({ blockId, colIndex, blocks, onSelect, onDelete, onUpdate, selectedId }: { blockId: string, colIndex: number, blocks: EditorBlock[], onSelect: (id: string) => void, onDelete: (id: string) => void, onUpdate?: (id: string, content: any) => void, selectedId: string | null }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `slot-${blockId}-${colIndex}`,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex-1 min-h-[120px] rounded-2xl border-2 border-dashed transition-all p-2",
                isOver ? "bg-blue-50 border-blue-400 scale-[1.02]" : "bg-gray-50/30 border-gray-100"
            )}
        >
            <div className="space-y-4">
                {blocks.map((b) => (
                    <SortableRow
                        key={b.id}
                        block={b}
                        isSelected={selectedId === b.id}
                        onSelect={onSelect}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                        isNested
                    />
                ))}
            </div>
            {blocks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full py-8 text-gray-300">
                    <Plus className="h-4 w-4 opacity-30" />
                    <span className="text-[8px] font-black uppercase tracking-widest mt-2">{isOver ? "Drop Here" : "Slot"}</span>
                </div>
            )}
        </div>
    );
}

function SortableRow({ block, isSelected, onSelect, onDelete, onUpdate, isNested = false }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: block.id, disabled: isNested });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const renderBlockContent = () => {
        switch (block.type) {
            case "heading": {
                const c = block.content as HeadingContent & { padding?: any };
                const p = c.padding || { top: 16, right: 32, bottom: 16, left: 32 };
                return (
                    <div style={{ paddingTop: `${p.top}px`, paddingRight: `${p.right}px`, paddingBottom: `${p.bottom}px`, paddingLeft: `${p.left}px` }}>
                        <h2
                            contentEditable={!!onUpdate}
                            suppressContentEditableWarning
                            onBlur={(e) => {
                                if (onUpdate && e.currentTarget.innerText !== c.text) {
                                    onUpdate(block.id, { ...c, text: e.currentTarget.innerText });
                                }
                            }}
                            className="w-full font-bold focus:outline-none whitespace-pre-wrap outline-none"
                            style={{ fontSize: `${c?.fontSize || 24}px`, textAlign: c?.textAlign || 'left', color: c?.color || '#111827' }}
                        >
                            {c?.text || "Text here"}
                        </h2>
                    </div>
                );
            }
            case "paragraph": {
                const c = block.content as ParagraphContent & { padding?: any };
                const p = c.padding || { top: 16, right: 32, bottom: 16, left: 32 };
                return (
                    <div style={{ paddingTop: `${p.top}px`, paddingRight: `${p.right}px`, paddingBottom: `${p.bottom}px`, paddingLeft: `${p.left}px` }}>
                        <p
                            contentEditable={!!onUpdate}
                            suppressContentEditableWarning
                            onBlur={(e) => {
                                if (onUpdate && e.currentTarget.innerText !== c.text) {
                                    onUpdate(block.id, { ...c, text: e.currentTarget.innerText });
                                }
                            }}
                            className="w-full focus:outline-none whitespace-pre-wrap outline-none"
                            style={{ lineHeight: c?.lineHeight || 1.5, color: c?.color || '#374151', textAlign: c?.textAlign || 'left' }}
                        >
                            {c?.text || "Start typing here..."}
                        </p>
                    </div>
                );
            }
            case "button": {
                const c = block.content as ButtonContent & { padding?: any };
                const p = c.padding || { top: 16, right: 32, bottom: 16, left: 32 };
                const alignment = c?.align || "center";
                const widthMode = c?.widthMode || "auto";
                const customWidth = c?.width || 200;

                return (
                    <div className={cn("flex", {
                        "justify-start": alignment === "left",
                        "justify-center": alignment === "center",
                        "justify-end": alignment === "right",
                    })} style={{ paddingTop: `${p.top}px`, paddingRight: `${p.right}px`, paddingBottom: `${p.bottom}px`, paddingLeft: `${p.left}px` }}>
                        <a
                            href={c?.link || "#"}
                            onClick={(e) => e.preventDefault()}
                            className="inline-block transition-opacity hover:opacity-90 text-center outline-none"
                            style={{
                                backgroundColor: c?.backgroundColor || '#2563eb',
                                color: c?.textColor || '#ffffff',
                                borderRadius: `${c?.borderRadius || 4}px`,
                                padding: `${c?.paddingY || 10}px ${c?.paddingX || 20}px`,
                                fontWeight: "600",
                                textDecoration: "none",
                                width: widthMode === "full" ? "100%" : widthMode === "custom" ? `${customWidth}px` : "auto"
                            }}
                        >
                            <span
                                contentEditable={!!onUpdate}
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                    if (onUpdate && e.currentTarget.innerText !== c.text) {
                                        onUpdate(block.id, { ...c, text: e.currentTarget.innerText });
                                    }
                                }}
                                className="outline-none"
                            >
                                {c?.text || "Button text"}
                            </span>
                        </a>
                    </div>
                );
            }
            case "divider": {
                const c = block.content as DividerContent;
                return (
                    <div style={{ padding: `${c?.spacing || 10}px 0` }}>
                        <hr style={{ border: "none", borderTop: `${c?.thickness || 1}px solid ${c?.color || '#e5e7eb'}` }} />
                    </div>
                );
            }
            case "image": {
                const c = block.content as ImageContent;
                const padding = c?.padding || { top: 0, right: 0, bottom: 0, left: 0 };

                const getWidth = () => {
                    if (c?.align === "full" || c?.widthMode === "full") return "100%";
                    if (c?.widthMode === "auto") return "auto";
                    return `${c?.width || 100}%`;
                };

                const imgContent = (
                    <div className={cn("relative group/img", (c?.align === "full" || c?.widthMode === "full") ? "w-full" : "")}>
                        <img
                            src={c?.url}
                            alt={c?.alt || ""}
                            style={{
                                width: getWidth(),
                                height: "auto",
                                display: "block",
                                marginLeft: (c?.align === "center" || c?.align === "full") ? "auto" : c?.align === "right" ? "auto" : "0",
                                marginRight: (c?.align === "center" || c?.align === "full") ? "auto" : c?.align === "left" ? "auto" : "0"
                            }}
                        />
                        {c?.link && (
                            <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-md opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                                <ExternalLink className="h-3 w-3" />
                            </div>
                        )}
                    </div>
                );

                return (
                    <div
                        className={cn("flex w-full", {
                            "justify-start": c?.align === "left",
                            "justify-center": c?.align === "center" || !c?.align || c?.align === "full",
                            "justify-end": c?.align === "right",
                        })}
                        style={{
                            paddingTop: `${padding.top}px`,
                            paddingRight: `${padding.right}px`,
                            paddingBottom: `${padding.bottom}px`,
                            paddingLeft: `${padding.left}px`,
                        }}
                    >
                        {c?.url ? (
                            c.link ? (
                                <a href={c.link} target={c.target || "_blank"} rel="noopener noreferrer" className={cn("block", (c?.align === "full" || c?.widthMode === "full") ? "w-full" : "")}>
                                    {imgContent}
                                </a>
                            ) : imgContent
                        ) : (
                            <div className="flex aspect-video w-full items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-widest transition-colors hover:bg-gray-100 cursor-pointer mx-8 my-4 rounded-xl">
                                Click to add image
                            </div>
                        )}
                    </div>
                );
            }
            case "social": {
                const c = block.content as SocialContent;
                const iconType = c?.iconType || "circle-black";
                const iconSize = c?.iconSize || 32;
                const iconSpacing = c?.iconSpacing || 10;

                return (
                    <div className={cn("flex flex-wrap gap-x-0 py-4", {
                        "justify-start": c?.align === "left",
                        "justify-center": c?.align === "center" || !c?.align,
                        "justify-end": c?.align === "right",
                    })} style={{ gap: `${iconSpacing}px` }}>
                        {(c?.icons || []).map((icon, idx) => {
                            const IconComp = PLATFORM_ICONS[icon.platform] || Facebook;

                            const getStyle = (): React.CSSProperties => {
                                switch (iconType) {
                                    case "circle-black": return { backgroundColor: '#000', color: '#fff', borderRadius: '50%' };
                                    case "circle-white": return { backgroundColor: '#fff', color: '#000', borderRadius: '50%', border: '1px solid #eee' };
                                    case "circle": return { backgroundColor: 'transparent', color: '#000' };
                                    case "round-black": return { backgroundColor: '#000', color: '#fff', borderRadius: '8px' };
                                    case "round": return { backgroundColor: 'transparent', color: '#000', borderRadius: '8px' };
                                    case "square-black": return { backgroundColor: '#000', color: '#fff', borderRadius: '0' };
                                    case "square": return { backgroundColor: 'transparent', color: '#000', borderRadius: '0' };
                                    default: return {};
                                }
                            };

                            return (
                                <a
                                    key={idx}
                                    href={icon.url}
                                    onClick={(e) => e.preventDefault()}
                                    className="flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                                    style={{
                                        width: `${iconSize}px`,
                                        height: `${iconSize}px`,
                                        ...getStyle()
                                    }}
                                >
                                    <IconComp style={{ width: `${iconSize * 0.5}px`, height: `${iconSize * 0.5}px` }} />
                                </a>
                            );
                        })}
                    </div>
                );
            }
            case "menu": {
                const c = block.content as MenuContent;
                return (
                    <div className={cn("flex gap-6 py-4 flex-wrap", {
                        "justify-start": c?.align === "left",
                        "justify-center": c?.align === "center" || !c?.align,
                        "justify-end": c?.align === "right",
                    })}>
                        {(c?.items || []).map((item, idx) => (
                            <a key={idx} href={item.url} style={{ color: c?.color || '#374151' }} className="text-xs font-bold uppercase tracking-widest hover:underline">
                                {item.label}
                            </a>
                        ))}
                    </div>
                );
            }
            case "video": {
                const c = block.content as VideoContent;
                return (
                    <div className="aspect-video w-full rounded-2xl bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                        <div className="h-16 w-16 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-current border-b-[10px] border-b-transparent ml-1" />
                        </div>
                        {c?.url && <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/80 p-2 rounded-lg text-[10px] font-bold text-gray-600 border border-gray-100">
                            VIDEO LINK
                        </div>}
                    </div>
                );
            }
            case "columns": {
                const c = block.content as ColumnContent;
                return (
                    <div className="flex gap-4 py-4 w-full">
                        {c.columns.map((col, idx) => (
                            <ColumnSlot
                                key={idx}
                                blockId={block.id}
                                colIndex={idx}
                                blocks={col.blocks}
                                onSelect={onSelect}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                                selectedId={null}
                            />
                        ))}
                    </div>
                );
            }
            case "html": {
                const c = block.content as HTMLContent;
                return <div className="py-2" dangerouslySetInnerHTML={{ __html: c?.html || "<div style='color: #ccc; text-align: center; border: 1px dashed #eee; padding: 20px;'>HTML Placeholder</div>" }} />;
            }
            case "product-recommendation": {
                const c = block.content as ProductContent;
                return (
                    <div className="py-8 text-center bg-gray-50/20 rounded-3xl border border-gray-100 my-4">
                        <div className="mx-auto aspect-square w-48 rounded-2xl bg-white shadow-sm mb-4 overflow-hidden flex items-center justify-center">
                            {c?.image ? <img src={c.image} alt={c.title} className="h-full w-full object-cover" /> : <Plus className="h-6 w-6 text-gray-200" />}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">{c?.title || "Product Title"}</h4>
                        <p className="text-blue-600 font-bold text-sm mb-4">{c?.price || "$0.00"}</p>
                        <button className="rounded-xl px-6 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">{c?.ctaText || "Buy Now"}</button>
                    </div>
                );
            }
            case "order-summary": {
                const c = block.content as OrderSummaryContent;
                return (
                    <div className="py-6 border border-gray-100 rounded-3xl p-6 bg-white my-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Summary</h3>
                        <div className="space-y-3">
                            {(c?.items || []).map((item, i) => (
                                <div key={i} className="flex justify-between text-xs py-1">
                                    <span className="text-gray-500 font-medium">{item.name} x{item.qty}</span>
                                    <span className="font-bold">{item.price}</span>
                                </div>
                            ))}
                            <div className="border-t border-gray-50 pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                    <span>SUBTOTAL</span>
                                    <span>{c?.subtotal || "$0.00"}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-50">
                                    <span>TOTAL</span>
                                    <span className="text-blue-600">{c?.total || "$0.00"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            default:
                return (
                    <div className="rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 p-8 text-center text-[10px] font-black uppercase tracking-widest text-gray-300">
                        EMPTY BLOCK
                    </div>
                );
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(block.id);
            }}
            className={cn(
                "group relative border-2 transition-all hover:border-blue-400 cursor-pointer mb-2",
                isSelected ? "border-blue-600 ring-4 ring-blue-50 z-10" : "border-transparent",
                isDragging ? "z-50 opacity-40" : "",
                isNested ? "hover:border-blue-300" : ""
            )}
        >
            {!isNested && isSelected && (
                <div className="absolute top-0 right-0 p-2 flex gap-2 z-[60] group-hover:opacity-100 pointer-events-auto">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab rounded-lg bg-blue-600 p-2 shadow-xl text-white hover:bg-blue-700 transition-all hover:scale-110 active:scale-95"
                        title="Drag to move"
                    >
                        <GripVertical className="h-4 w-4" />
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(block.id);
                        }}
                        className="rounded-lg bg-red-500 p-2 shadow-xl text-white hover:bg-red-600 transition-all hover:scale-110 active:scale-95"
                        title="Delete block"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )}

            {isNested && (
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(block.id);
                        }}
                        className="p-1 rounded bg-white shadow-md text-red-500"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            )}
            <div className={cn("bg-white", isNested ? "p-2" : "p-0")}>
                {renderBlockContent()}
            </div>
            {!isNested && (
                <div className="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white shadow-xl hover:bg-black transition-all hover:scale-110 active:scale-90 ring-4 ring-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
interface EmailCanvasProps {
    blocks: EditorBlock[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate?: (id: string, content: any) => void;
    previewMode?: "desktop" | "mobile";
}
export default function EmailCanvas({ blocks, selectedId, onSelect, onDelete, onUpdate, previewMode = "desktop" }: EmailCanvasProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: "canvas",
    });
    return (
        <div
            ref={setNodeRef}
            onClick={() => onSelect("")}
            className={cn(
                "mx-auto h-full min-h-[1200px] bg-white shadow-[0_32px_64px_rgba(0,0,0,0.05)] transition-all duration-500 ease-in-out mb-32 overflow-hidden flex flex-col",
                previewMode === "mobile" ? "w-[375px]" : "w-[600px]",
                isOver ? "bg-gray-50/50 ring-4 ring-blue-500/5 ring-inset" : "ring-1 ring-gray-100"
            )}
        >
            <div className="p-0 flex-1">
                <SortableContext
                    items={blocks.map(b => b.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-0 relative min-h-[800px]">
                        {blocks.map((block) => (
                            <SortableRow
                                key={block.id}
                                block={block}
                                isSelected={selectedId === block.id}
                                onSelect={onSelect}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                            />
                        ))}
                        {blocks.length === 0 && (
                            <div className="flex h-[400px] flex-col items-center justify-center text-gray-200 gap-6 border-4 border-dashed border-gray-50 m-12 transition-all">
                                <Plus className="h-10 w-10 opacity-20" />
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Workspace is empty</p>
                                    <p className="text-[10px] font-bold text-gray-300 mt-2">DRAG CONTENT HERE</p>
                                </div>
                            </div>
                        )}
                    </div>
                </SortableContext>
                <div className="mt-50 pt-6 border-t border-gray-50 text-center text-[10px] font-bold uppercase tracking-widest text-gray-300 space-y-4 pb-24">
                    <p className="text-gray-400 font-black">SELIXER</p>
                    <p>Footer Content (Editable)</p>
                    <p>Mailing Address Info</p>
                    <div className="flex justify-center gap-6">
                        <a
                            href={`${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email={{email}}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-900 transition-colors"
                        >
                            Unsubscribe
                        </a>

                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Browser View</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
