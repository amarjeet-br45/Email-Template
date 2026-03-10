"use client";

import { useDraggable } from "@dnd-kit/core";
import {
    Type,
    Image as ImageIcon,
    Square,
    Minus,
    Grid,
    ShoppingBag,
    Video,
    Share2,
    Menu,
    Code,
    Table,
    Clock,
    Heading as HeadingIcon,
    Layout,
    ShoppingCart
} from "lucide-react";
import { BlockType, EditorBlock } from "@/lib/editor-types";
import SettingsPanel from "./SettingsPanel";

interface BlockItem {
    type: BlockType;
    label: string;
    icon: any;
}

const BLOCKS: BlockItem[] = [
    { type: "columns", label: "COLUMNS", icon: Grid },
    { type: "product-recommendation", label: "PRODUCT RECOMMENDATION", icon: ShoppingBag },
    { type: "button", label: "BUTTON", icon: Square },
    { type: "divider", label: "DIVIDER", icon: Minus },
    { type: "heading", label: "HEADING", icon: HeadingIcon },
    { type: "paragraph", label: "PARAGRAPH", icon: Type },
    { type: "image", label: "IMAGE", icon: ImageIcon },
    { type: "order-summary", label: "ORDER SUMMARY", icon: ShoppingCart },
    { type: "video", label: "VIDEO", icon: Video },
    { type: "social", label: "SOCIAL", icon: Share2 },
    { type: "menu", label: "MENU", icon: Menu },
    { type: "html", label: "HTML", icon: Code },
    { type: "table", label: "TABLE", icon: Table },
    { type: "timer", label: "TIMER", icon: Clock },
];

function DraggableBlock({ block }: { block: BlockItem }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `block-${block.type}`,
        data: {
            type: block.type,
            isNew: true
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                group flex flex-col items-center justify-center aspect-square border border-gray-200 bg-white p-2 transition-all hover:border-gray-900 cursor-grab active:cursor-grabbing
                ${isDragging ? "opacity-30 scale-95 z-50 shadow-2xl" : "shadow-none"}
            `}
        >
            <div className="flex flex-1 items-center justify-center text-gray-800 transition-transform group-hover:scale-110">
                <block.icon className="h-8 w-8 stroke-[1.5]" />
            </div>
            <span className="text-[9px] font-bold text-gray-600 text-center uppercase tracking-tight leading-tight pb-2 px-1">
                {block.label}
            </span>
        </div>
    );
}

interface BlockPanelProps {
    selectedBlock: EditorBlock | null;
    onUpdateBlock: (id: string, content: any) => void;
    onDeselect: () => void;
    onDeleteBlock: (id: string) => void;
    previewMode: "desktop" | "mobile";
    onPreviewModeChange: (mode: "desktop" | "mobile") => void;
}

export default function BlockPanel({
    selectedBlock,
    onUpdateBlock,
    onDeselect,
    onDeleteBlock,
    previewMode,
    onPreviewModeChange
}: BlockPanelProps) {
    if (selectedBlock) {
        return (
            <SettingsPanel
                block={selectedBlock}
                onUpdate={onUpdateBlock}
                onBack={onDeselect}
                onDelete={onDeleteBlock}
                previewMode={previewMode}
                onPreviewModeChange={onPreviewModeChange}
            />
        );
    }

    return (
        <div className="h-full bg-white overflow-y-auto custom-scrollbar p-0">
            <div className="grid grid-cols-3 gap-0 border-l border-t border-gray-200">
                {BLOCKS.map((block) => (
                    <div key={block.type} className="border-r border-b border-gray-200">
                        <DraggableBlock block={block} />
                    </div>
                ))}
            </div>
        </div>
    );
}
