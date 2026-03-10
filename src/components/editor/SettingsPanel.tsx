import React, { useState, useRef } from "react";
import {
    ChevronLeft, AlignLeft, AlignCenter, AlignRight, Type, Palette,
    Link as LinkIcon, MoveHorizontal, Square, Layers, Trash2, Plus,
    X, Video, Columns, Maximize, ChevronDown, ChevronUp, Check,
    Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Slack,
    MessageCircle, Mail, Globe, Phone, MapPin, User, GripVertical,
    Wand2, Image as ImageIcon, Link2, Target, Monitor, Smartphone,
    ChevronRight, ExternalLink, Scissors, AlignJustify
} from "lucide-react";
import {
    EditorBlock, HeadingContent, ParagraphContent, ButtonContent,
    ImageContent, DividerContent, SocialContent, MenuContent,
    ProductContent, HTMLContent, VideoContent, ColumnContent, IconType
} from "@/lib/editor-types";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
    block: EditorBlock;
    onUpdate: (id: string, content: any) => void;
    onBack: () => void;
    onDelete: (id: string) => void;
    previewMode: "desktop" | "mobile";
    onPreviewModeChange: (mode: "desktop" | "mobile") => void;
}

const SOCIAL_PLATFORMS = [
    { id: "facebook", icon: Facebook, label: "Facebook" },
    { id: "twitter", icon: Twitter, label: "Twitter" },
    { id: "instagram", icon: Instagram, label: "Instagram" },
    { id: "linkedin", icon: Linkedin, label: "LinkedIn" },
    { id: "youtube", icon: Youtube, label: "YouTube" },
    { id: "github", icon: Github, label: "GitHub" },
    { id: "slack", icon: Slack, label: "Slack" },
    { id: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
    { id: "email", icon: Mail, label: "Email" },
    { id: "website", icon: Globe, label: "Website" },
    { id: "phone", icon: Phone, label: "Phone" },
    { id: "map", icon: MapPin, label: "Location" },
    { id: "profile", icon: User, label: "Profile" },
];

const ICON_TYPES: { id: IconType; label: string }[] = [
    { id: "circle", label: "Circle" },
    { id: "circle-black", label: "Circle Black" },
    { id: "circle-white", label: "Circle White" },
    { id: "round", label: "Round" },
    { id: "round-black", label: "Round Black" },
    { id: "square", label: "Square" },
    { id: "square-black", label: "Square Black" },
];

export default function SettingsPanel({
    block,
    onUpdate,
    onBack,
    onDelete,
    previewMode,
    onPreviewModeChange
}: SettingsPanelProps) {
    const [isIconTypeOpen, setIsIconTypeOpen] = useState(false);
    const [isIconsSectionOpen, setIsIconsSectionOpen] = useState(true);

    // Image Section States
    const [isImageMainOpen, setIsImageMainOpen] = useState(true);
    const [isWidthOpen, setIsWidthOpen] = useState(true);
    const [isAlignOpen, setIsAlignOpen] = useState(true);
    const [isAltOpen, setIsAltOpen] = useState(true);
    const [isActionOpen, setIsActionOpen] = useState(true);
    const [isGeneralOpen, setIsGeneralOpen] = useState(true);
    const [showPaddingOptions, setShowPaddingOptions] = useState(false);
    const [isLinkActionTypeOpen, setIsLinkActionTypeOpen] = useState(false);
    const [isTargetSelectOpen, setIsTargetSelectOpen] = useState(false);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateContent({ url: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const updateContent = (newContent: any) => {
        onUpdate(block.id, { ...block.content, ...newContent });
    };

    const renderSocialSettings = (c: SocialContent) => (
        <div className="space-y-6">
            {/* Desktop/Mobile Tabs */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-4 border border-gray-100 shadow-inner">
                <button
                    onClick={() => onPreviewModeChange("desktop")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 py-3 rounded-[14px] transition-all text-[10px] font-black uppercase tracking-widest",
                        previewMode === "desktop" ? "bg-white text-blue-600 shadow-xl scale-105" : "text-gray-400 hover:text-gray-900"
                    )}
                >
                    <Monitor className="h-3.5 w-3.5" /> Desktop
                </button>
                <button
                    onClick={() => onPreviewModeChange("mobile")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 py-3 rounded-[14px] transition-all text-[10px] font-black uppercase tracking-widest",
                        previewMode === "mobile" ? "bg-white text-blue-600 shadow-xl scale-105" : "text-gray-400 hover:text-gray-900"
                    )}
                >
                    <Smartphone className="h-3.5 w-3.5" /> Mobile
                </button>
            </div>

            {/* Icons Accordion */}
            <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                    onClick={() => setIsIconsSectionOpen(!isIconsSectionOpen)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Icons</span>
                    {isIconsSectionOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </button>

                {isIconsSectionOpen && (
                    <div className="p-4 space-y-6">
                        {/* Icon Type Dropdown */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Icon Type</label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsIconTypeOpen(!isIconTypeOpen)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 text-sm text-gray-900 font-bold bg-white hover:border-gray-300 transition-all shadow-sm"
                                >
                                    <span>{ICON_TYPES.find(t => t.id === (c.iconType || "circle-black"))?.label}</span>
                                    <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isIconTypeOpen && "rotate-180")} />
                                </button>

                                {isIconTypeOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                                        {ICON_TYPES.map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => {
                                                    updateContent({ iconType: type.id });
                                                    setIsIconTypeOpen(false);
                                                }}
                                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-900 font-bold hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <span>{type.label}</span>
                                                {c.iconType === type.id && <Check className="h-4 w-4 text-blue-600" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social Links List */}
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Social Links</label>
                            {(c.icons || []).map((icon, idx) => {
                                const platform = SOCIAL_PLATFORMS.find(p => p.id === icon.platform) || SOCIAL_PLATFORMS[0];
                                return (
                                    <div key={idx} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4 shadow-sm group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 cursor-grab text-gray-300 hover:text-gray-500">
                                                    <GripVertical className="h-3.5 w-3.5" />
                                                </div>
                                                <platform.icon className="h-4 w-4 text-gray-900" />
                                                <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">{platform.label}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newIcons = [...c.icons];
                                                    newIcons.splice(idx, 1);
                                                    updateContent({ icons: newIcons });
                                                }}
                                                className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shadow-none"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">URL</span>
                                            <input
                                                type="text"
                                                value={icon.url}
                                                onChange={(e) => {
                                                    const newIcons = [...c.icons];
                                                    newIcons[idx].url = e.target.value;
                                                    updateContent({ icons: newIcons });
                                                }}
                                                className="w-full p-3 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none bg-white font-bold"
                                                placeholder={`https://...`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* More Options / Icon Library */}
                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4 text-center">More Options</label>
                            <div className="grid grid-cols-6 gap-2">
                                {SOCIAL_PLATFORMS.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            if (!c.icons.some(i => i.platform === p.id)) {
                                                updateContent({
                                                    icons: [...c.icons, { platform: p.id, url: `https://${p.id}.com/` }]
                                                });
                                            }
                                        }}
                                        className="aspect-square flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-900 hover:text-white transition-all text-gray-400 group shadow-sm"
                                        title={`Add ${p.label}`}
                                    >
                                        <p.icon className="h-4 w-4" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Alignment, Size, Spacing */}
                        <div className="space-y-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Align</span>
                                <div className="flex bg-gray-50 p-1 rounded-xl">
                                    {[
                                        { id: 'left', icon: AlignLeft },
                                        { id: 'center', icon: AlignCenter },
                                        { id: 'right', icon: AlignRight }
                                    ].map((btn) => (
                                        <button
                                            key={btn.id}
                                            onClick={() => updateContent({ align: btn.id })}
                                            className={cn(
                                                "p-2 rounded-lg transition-all",
                                                c.align === btn.id ? "bg-black text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
                                            )}
                                        >
                                            <btn.icon className="h-3.5 w-3.5" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Icon Size</span>
                                <div className="flex items-center gap-1">
                                    <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden h-9 bg-white shadow-sm ring-1 ring-gray-50">
                                        <input
                                            type="number"
                                            value={c.iconSize || 32}
                                            onChange={(e) => updateContent({ iconSize: parseInt(e.target.value) })}
                                            className="w-12 text-center text-xs font-black text-gray-900 focus:outline-none border-r border-gray-100 h-full p-0"
                                        />
                                        <div className="bg-gray-50 px-2 text-[10px] font-black text-gray-400 flex items-center h-full">PX</div>
                                    </div>
                                    <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden h-9 bg-white shadow-sm ml-2">
                                        <button
                                            onClick={() => updateContent({ iconSize: Math.max(16, (c.iconSize || 32) - 1) })}
                                            className="px-3 h-full hover:bg-gray-50 transition-colors text-gray-400"
                                        >-</button>
                                        <div className="w-px h-1/2 bg-gray-100 self-center" />
                                        <button
                                            onClick={() => updateContent({ iconSize: Math.min(64, (c.iconSize || 32) + 1) })}
                                            className="px-3 h-full hover:bg-gray-50 transition-colors text-gray-400"
                                        >+</button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Icon Spacing</span>
                                <div className="flex items-center gap-1">
                                    <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden h-9 bg-white shadow-sm ring-1 ring-gray-50">
                                        <input
                                            type="number"
                                            value={c.iconSpacing || 10}
                                            onChange={(e) => updateContent({ iconSpacing: parseInt(e.target.value) })}
                                            className="w-12 text-center text-xs font-black text-gray-900 focus:outline-none border-r border-gray-100 h-full p-0"
                                        />
                                        <div className="bg-gray-50 px-2 text-[10px] font-black text-gray-400 flex items-center h-full">PX</div>
                                    </div>
                                    <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden h-9 bg-white shadow-sm ml-2">
                                        <button
                                            onClick={() => updateContent({ iconSpacing: Math.max(0, (c.iconSpacing || 10) - 1) })}
                                            className="px-3 h-full hover:bg-gray-50 transition-colors text-gray-400"
                                        >-</button>
                                        <div className="w-px h-1/2 bg-gray-100 self-center" />
                                        <button
                                            onClick={() => updateContent({ iconSpacing: Math.min(50, (c.iconSpacing || 10) + 1) })}
                                            className="px-3 h-full hover:bg-gray-50 transition-colors text-gray-400"
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const Section = ({ title, isOpen, onToggle, children, icon, badge }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode, icon?: React.ReactNode, badge?: string }) => (
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm mb-2">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{title}</span>
                    {badge && <span className="px-1.5 py-0.5 rounded-md bg-blue-600 text-[8px] font-black text-white">{badge}</span>}
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {isOpen && (
                <div className="p-4 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );

    const renderHeadingSettings = (c: HeadingContent) => (
        <div className="space-y-6">
            {/* Desktop/Mobile Toggles */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 border border-gray-100 shadow-inner">
                <button
                    onClick={() => onPreviewModeChange("desktop")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 py-3 rounded-[14px] transition-all text-[10px] font-black uppercase tracking-widest",
                        previewMode === "desktop" ? "bg-white text-blue-600 shadow-xl scale-105" : "text-gray-400 hover:text-gray-900"
                    )}
                >
                    <Monitor className="h-3.5 w-3.5" /> Desktop
                </button>
                <button
                    onClick={() => onPreviewModeChange("mobile")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 py-3 rounded-[14px] transition-all text-[10px] font-black uppercase tracking-widest",
                        previewMode === "mobile" ? "bg-white text-blue-600 shadow-xl scale-105" : "text-gray-400 hover:text-gray-900"
                    )}
                >
                    <Smartphone className="h-3.5 w-3.5" /> Mobile
                </button>
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Content</label>
                <textarea
                    value={c.text || ""}
                    onChange={(e) => updateContent({ text: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-900 font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none bg-white transition-all shadow-sm"
                    rows={2}
                    placeholder="Text here"
                />
            </div>
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Typography</label>
                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <span className="text-[10px] font-bold text-gray-400 block mb-2">Size: {c.fontSize || 24}px</span>
                        <input
                            type="range" min="12" max="72"
                            value={c.fontSize || 24}
                            onChange={(e) => updateContent({ fontSize: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-900"
                        />
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Alignment</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {[
                            { id: 'left', icon: AlignLeft },
                            { id: 'center', icon: AlignCenter },
                            { id: 'right', icon: AlignRight },
                            { id: 'justify', icon: AlignJustify }
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => updateContent({ textAlign: btn.id })}
                                className={cn(
                                    "flex-1 flex justify-center p-2 rounded-lg transition-all",
                                    c.textAlign === btn.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <btn.icon className="h-4 w-4" />
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Color</label>
                    <input
                        type="color"
                        value={c.color || "#111827"}
                        onChange={(e) => updateContent({ color: e.target.value })}
                        className="h-10 w-10 p-0 border-none rounded-xl cursor-pointer shadow-sm"
                    />
                </div>
            </div>
        </div>
    );

    const renderParagraphSettings = (c: ParagraphContent) => (
        <div className="space-y-6">
            {/* Desktop/Mobile Toggles */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 border border-gray-100 shadow-inner">
                <button
                    onClick={() => onPreviewModeChange("desktop")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 py-3 rounded-[14px] transition-all text-[10px] font-black uppercase tracking-widest",
                        previewMode === "desktop" ? "bg-white text-blue-600 shadow-xl scale-105" : "text-gray-400 hover:text-gray-900"
                    )}
                >
                    <Monitor className="h-3.5 w-3.5" /> Desktop
                </button>
                <button
                    onClick={() => onPreviewModeChange("mobile")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 py-3 rounded-[14px] transition-all text-[10px] font-black uppercase tracking-widest",
                        previewMode === "mobile" ? "bg-white text-blue-600 shadow-xl scale-105" : "text-gray-400 hover:text-gray-900"
                    )}
                >
                    <Smartphone className="h-3.5 w-3.5" /> Mobile
                </button>
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Content</label>
                <textarea
                    value={c.text || ""}
                    onChange={(e) => updateContent({ text: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-900 font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none bg-white transition-all shadow-sm"
                    rows={6}
                    placeholder="Start typing here..."
                />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Alignment</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {[
                            { id: 'left', icon: AlignLeft },
                            { id: 'center', icon: AlignCenter },
                            { id: 'right', icon: AlignRight },
                            { id: 'justify', icon: AlignJustify }
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => updateContent({ textAlign: btn.id })}
                                className={cn(
                                    "flex-1 flex justify-center p-2 rounded-lg transition-all",
                                    c.textAlign === btn.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <btn.icon className="h-4 w-4" />
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Color</label>
                    <input
                        type="color"
                        value={c.color || "#374151"}
                        onChange={(e) => updateContent({ color: e.target.value })}
                        className="h-10 w-10 p-0 border-none rounded-xl cursor-pointer shadow-sm"
                    />
                </div>
            </div>
        </div>
    );

    const renderButtonSettings = (c: ButtonContent) => (
        <div className="space-y-6">
            {/* Desktop/Mobile Toggles */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 border border-gray-100 shadow-inner">
                <button
                    onClick={() => onPreviewModeChange("desktop")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 py-3 rounded-[14px] transition-all text-[10px] font-black uppercase tracking-widest",
                        previewMode === "desktop" ? "bg-white text-blue-600 shadow-xl scale-105" : "text-gray-400 hover:text-gray-900"
                    )}
                >
                    <Monitor className="h-3.5 w-3.5" /> Desktop
                </button>
                <button
                    onClick={() => onPreviewModeChange("mobile")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 py-3 rounded-[14px] transition-all text-[10px] font-black uppercase tracking-widest",
                        previewMode === "mobile" ? "bg-white text-blue-600 shadow-xl scale-105" : "text-gray-400 hover:text-gray-900"
                    )}
                >
                    <Smartphone className="h-3.5 w-3.5" /> Mobile
                </button>
            </div>

            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Label</label>
                <input
                    type="text"
                    value={c.text || ""}
                    onChange={(e) => updateContent({ text: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-900 font-bold focus:outline-none bg-white shadow-sm"
                    placeholder="Button text"
                />
            </div>
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Link URL</label>
                <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={c.link || ""}
                        onChange={(e) => updateContent({ link: e.target.value })}
                        className="w-full pl-11 rounded-xl border border-gray-200 p-4 text-sm text-gray-900 font-bold focus:outline-none bg-white shadow-sm"
                        placeholder="https://..."
                    />
                </div>
            </div>
            <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Layout</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
                    {[
                        { id: 'auto', label: 'Auto' },
                        { id: 'full', label: 'Full' },
                        { id: 'custom', label: 'Custom' }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => updateContent({ widthMode: mode.id })}
                            className={cn(
                                "py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                (c.widthMode || 'auto') === mode.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                            )}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>
                {(c.widthMode === 'custom') && (
                    <div className="pt-2">
                        <span className="text-[10px] font-bold text-gray-400 block mb-2">Width: {c.width || 200}px</span>
                        <input
                            type="range" min="50" max="500"
                            value={c.width || 200}
                            onChange={(e) => updateContent({ width: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-900"
                        />
                    </div>
                )}
                <div>
                    <span className="text-[10px] font-bold text-gray-400 block mb-2">Position</span>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {[
                            { id: 'left', icon: AlignLeft },
                            { id: 'center', icon: AlignCenter },
                            { id: 'right', icon: AlignRight }
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => updateContent({ align: btn.id })}
                                className={cn(
                                    "flex-1 flex justify-center p-2 rounded-lg transition-all",
                                    (c.align || 'center') === btn.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <btn.icon className="h-4 w-4" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Background</label>
                    <input type="color" value={c.backgroundColor || "#2563eb"} onChange={(e) => updateContent({ backgroundColor: e.target.value })} className="h-10 w-full p-0 border-none rounded-xl cursor-pointer" />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Text</label>
                    <input type="color" value={c.textColor || "#ffffff"} onChange={(e) => updateContent({ textColor: e.target.value })} className="h-10 w-full p-0 border-none rounded-xl cursor-pointer" />
                </div>
            </div>
        </div>
    );

    const renderImageSettings = (c: ImageContent) => (
        <div className="space-y-4">
            {/* Desktop/Mobile Toggles */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 border border-gray-100 shadow-inner">
                <button
                    onClick={() => onPreviewModeChange("desktop")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 py-3 rounded-[14px] transition-all text-[10px] font-black uppercase tracking-widest",
                        previewMode === "desktop" ? "bg-white text-blue-600 shadow-xl scale-105" : "text-gray-400 hover:text-gray-900"
                    )}
                >
                    <Monitor className="h-3.5 w-3.5" /> Desktop
                </button>
                <button
                    onClick={() => onPreviewModeChange("mobile")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 py-3 rounded-[14px] transition-all text-[10px] font-black uppercase tracking-widest",
                        previewMode === "mobile" ? "bg-white text-blue-600 shadow-xl scale-105" : "text-gray-400 hover:text-gray-900"
                    )}
                >
                    <Smartphone className="h-3.5 w-3.5" /> Mobile
                </button>
            </div>

            <Section title="Image" isOpen={isImageMainOpen} onToggle={() => setIsImageMainOpen(!isImageMainOpen)}>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                />
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-900 text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95"
                    >
                        Upload Image
                    </button>
                    <button className="bg-white border border-gray-200 text-gray-900 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center justify-between px-4 hover:border-gray-300 transition-all">
                        More Images <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                </div>

                {c.url && (
                    <div className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200">
                            <img src={c.url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-gray-900 truncate uppercase tracking-tighter">Current Image</p>
                            <p className="text-[9px] font-bold text-gray-400">{(c.url.length / 1024).toFixed(2)} kb</p>
                            <button
                                onClick={() => setIsCropModalOpen(true)}
                                className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-50 transition-all"
                            >
                                <Scissors className="h-3 w-3" /> Edit Image
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Image URL</label>
                        <span className="text-[9px] font-bold text-gray-300">1488 × 948</span>
                    </div>
                    <input
                        type="text"
                        value={c.url || ""}
                        onChange={(e) => updateContent({ url: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 p-4 text-xs text-gray-900 font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:outline-none bg-white transition-all shadow-sm"
                        placeholder="https://..."
                    />
                </div>
            </Section>

            <Section title="Width" isOpen={isWidthOpen} onToggle={() => setIsWidthOpen(!isWidthOpen)}>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auto On</span>
                    <button
                        onClick={() => updateContent({ widthMode: c.widthMode === "auto" ? "custom" : "auto" })}
                        className={cn(
                            "w-11 h-6 rounded-full transition-all relative p-1 shadow-inner",
                            c.widthMode === "auto" ? "bg-gray-900" : "bg-gray-200"
                        )}
                    >
                        <div className={cn(
                            "w-4 h-4 rounded-full bg-white shadow-sm transition-all transform flex items-center justify-center",
                            c.widthMode === "auto" ? "translate-x-5" : "translate-x-0"
                        )}>
                            {c.widthMode === "auto" ? <Check className="h-2 w-2 text-gray-900" /> : <X className="h-2 w-2 text-gray-400" />}
                        </div>
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <input
                            type="range" min="10" max="100"
                            value={c.width || 100}
                            onChange={(e) => updateContent({ width: parseInt(e.target.value), widthMode: "custom" })}
                            className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-900"
                        />
                        <span className="ml-4 text-[10px] font-black text-gray-900">{c.width || 100}%</span>
                    </div>
                </div>
            </Section>

            <Section title="Align" isOpen={isAlignOpen} onToggle={() => setIsAlignOpen(!isAlignOpen)}>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                    {[
                        { id: 'left', icon: AlignLeft },
                        { id: 'center', icon: AlignCenter },
                        { id: 'right', icon: AlignRight },
                        { id: 'full', icon: Maximize }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => updateContent({ align: btn.id })}
                            className={cn(
                                "flex-1 flex justify-center p-2.5 rounded-lg transition-all",
                                (c.align || 'center') === btn.id ? "bg-gray-900 text-white shadow-lg scale-105" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <btn.icon className="h-4 w-4" />
                        </button>
                    ))}
                </div>
            </Section>

            <Section title="Alternate Text" isOpen={isAltOpen} onToggle={() => setIsAltOpen(!isAltOpen)}>
                <input
                    type="text"
                    value={c.alt || ""}
                    onChange={(e) => updateContent({ alt: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-4 text-xs text-gray-900 font-bold focus:outline-none bg-white shadow-sm"
                    placeholder="Describe this image"
                />
            </Section>

            <Section title="Action" isOpen={isActionOpen} onToggle={() => setIsActionOpen(!isActionOpen)}>
                <div className="space-y-4">
                    <div className="relative">
                        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Link Action</span>
                        <button
                            onClick={() => setIsLinkActionTypeOpen(!isLinkActionTypeOpen)}
                            className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm text-[10px] font-black text-gray-900 uppercase tracking-widest hover:border-gray-200 transition-all font-bold"
                        >
                            <span>{c.linkAction || "Open Website"}</span>
                            <ChevronDown className={cn("h-3 w-3 transition-transform text-gray-400", isLinkActionTypeOpen && "rotate-180")} />
                        </button>

                        {isLinkActionTypeOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-[70] overflow-hidden py-1">
                                {["Open Website", "Send Email", "Call Phone Number"].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            updateContent({ linkAction: option });
                                            setIsLinkActionTypeOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-[10px] font-black text-gray-900 uppercase tracking-widest hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
                                    >
                                        {option}
                                        {(c.linkAction || "Open Website") === option && <Check className="h-3 w-3 text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-4 flex items-center justify-center border-r border-gray-100 text-[10px] font-black text-gray-400">URL</div>
                        <input
                            type="text"
                            value={c.link || ""}
                            onChange={(e) => updateContent({ link: e.target.value })}
                            className="flex-1 p-4 text-xs text-gray-900 font-bold focus:outline-none bg-white"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="relative">
                        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Target</span>
                        <button
                            onClick={() => setIsTargetSelectOpen(!isTargetSelectOpen)}
                            className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm text-[10px] font-black text-gray-900 uppercase tracking-widest hover:border-gray-200 transition-all font-bold"
                        >
                            <span>{c.target === "_blank" ? "New Tab" : "Same Tab"}</span>
                            <ChevronDown className={cn("h-3 w-3 transition-transform text-gray-400", isTargetSelectOpen && "rotate-180")} />
                        </button>

                        {isTargetSelectOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-[70] overflow-hidden py-1">
                                {[
                                    { label: "New Tab", value: "_blank" },
                                    { label: "Same Tab", value: "_self" }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            updateContent({ target: option.value });
                                            setIsTargetSelectOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-[10px] font-black text-gray-900 uppercase tracking-widest hover:bg-gray-50 transition-colors text-left flex items-center justify-between font-bold"
                                    >
                                        {option.label}
                                        {c.target === option.value && <Check className="h-3 w-3 text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mock Crop Modal */}
                {isCropModalOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-10 backdrop-blur-sm">
                        <div className="bg-white rounded-[40px] w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20">
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white">
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Crop Image</h3>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1">Adjust your image framing</p>
                                </div>
                                <button onClick={() => setIsCropModalOpen(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-12 flex items-center justify-center bg-gray-50/50 min-h-[400px]">
                                <div className="relative group/crop max-w-lg w-full">
                                    <img src={c.url} alt="" className="w-full rounded-2xl shadow-xl border-4 border-white opacity-40 transition-opacity" />
                                    <div className="absolute inset-4 border-2 border-white border-dashed rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] animate-pulse flex items-center justify-center">
                                        <div className="bg-white text-gray-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                                            <Scissors className="h-4 w-4" /> Ready to Crop
                                        </div>
                                    </div>
                                    {/* Crop Handles */}
                                    <div className="absolute top-2 left-2 w-4 h-4 border-l-4 border-t-4 border-white rounded-tl-sm" />
                                    <div className="absolute top-2 right-2 w-4 h-4 border-r-4 border-t-4 border-white rounded-tr-sm" />
                                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-4 border-b-4 border-white rounded-bl-sm" />
                                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-4 border-b-4 border-white rounded-br-sm" />
                                </div>
                            </div>
                            <div className="p-8 bg-white border-t border-gray-100 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setIsCropModalOpen(false)}
                                    className="px-8 py-4 rounded-2xl bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setIsCropModalOpen(false)}
                                    className="px-10 py-4 rounded-2xl bg-gray-900 text-[10px] font-black uppercase tracking-widest text-white hover:bg-black transition-all shadow-xl font-bold active:scale-95"
                                >
                                    Apply Crop
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Section>


        </div>
    );

    const renderDividerSettings = (c: DividerContent) => (
        <div className="space-y-6">
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Thickness ({c.thickness || 1}px)</label>
                <input type="range" min="1" max="10" value={c.thickness || 1} onChange={(e) => updateContent({ thickness: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-900" />
            </div>
            <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Color</label>
                <input type="color" value={c.color || "#e5e7eb"} onChange={(e) => updateContent({ color: e.target.value })} className="h-10 w-full p-0 border-none rounded-xl cursor-pointer" />
            </div>
        </div>
    );

    const renderColumnSettings = (c: ColumnContent) => (
        <div className="space-y-6">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Structure</label>
            <div className="grid grid-cols-2 gap-3">
                {[2, 3].map((count) => (
                    <button
                        key={count}
                        onClick={() => {
                            const newColumns = Array.from({ length: count }, (_, i) => ({
                                id: `column-${Date.now()}-${i}`,
                                blocks: c.columns[i]?.blocks || []
                            }));
                            updateContent({ count, columns: newColumns });
                        }}
                        className={cn(
                            "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all shadow-sm",
                            c.count === count ? "bg-black border-black text-white" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                        )}
                    >
                        <Columns className="h-6 w-6 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{count} Slots</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderPaddingSettings = (c: any) => (
            <Section title="Spacing Options" isOpen={isGeneralOpen} onToggle={() => setIsGeneralOpen(!isGeneralOpen)}>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest text-opacity-70">Container Padding</span>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-gray-400">More Options</span>
                        <button
                            onClick={() => setShowPaddingOptions(!showPaddingOptions)}
                            className={cn(
                                "w-11 h-6 rounded-full transition-all relative p-1 shadow-inner",
                                showPaddingOptions ? "bg-gray-900" : "bg-gray-200"
                            )}
                        >
                            <div className={cn(
                                "w-4 h-4 rounded-full bg-white shadow-sm transition-all transform flex items-center justify-center",
                                showPaddingOptions ? "translate-x-5" : "translate-x-0"
                            )}>
                                {showPaddingOptions ? <Check className="h-2 w-2 text-gray-900" /> : <X className="h-2 w-2 text-gray-400" />}
                            </div>
                        </button>
                    </div>
                </div>

                {showPaddingOptions ? (
                    <div className="grid grid-cols-2 gap-4">
                        {['Top', 'Right', 'Bottom', 'Left'].map((side) => {
                            const key = side.toLowerCase() as 'top' | 'right' | 'bottom' | 'left';
                            const defaultPad = (key === 'top' || key === 'bottom') ? 16 : 32;
                            return (
                                <div key={side} className="space-y-2">
                                    <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">{side}</span>
                                    <div className="flex border border-gray-100 rounded-xl overflow-hidden shadow-sm h-11 bg-white">
                                        <input
                                            type="number"
                                            value={c.padding?.[key] !== undefined ? c.padding[key] : defaultPad}
                                            onChange={(e) => updateContent({ padding: { ...(c.padding || { top: 16, right: 32, bottom: 16, left: 32 }), [key]: parseInt(e.target.value) || 0 } })}
                                            className="w-full text-center text-xs font-black text-gray-900 focus:outline-none border-r border-gray-100"
                                        />
                                        <div className="bg-gray-50 px-2 flex items-center text-[9px] font-black text-gray-900">PX</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">All Sides</span>
                        <div className="flex items-center gap-4">
                            <div className="flex border border-gray-100 rounded-xl overflow-hidden shadow-sm h-11 bg-white w-32">
                                <input
                                    type="number"
                                    value={c.padding?.top !== undefined ? c.padding.top : 16}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        updateContent({ padding: { top: val, right: val, bottom: val, left: val } });
                                    }}
                                    className="w-full text-center text-xs font-black text-gray-900 focus:outline-none border-r border-gray-100"
                                />
                                <div className="bg-gray-50 px-2 flex items-center text-[9px] font-black text-gray-900">PX</div>
                            </div>
                        </div>
                    </div>
                )}
            </Section>
    );

    const renderContent = () => {
        const c = block.content;
            return (
            <div className="space-y-6">
                {(() => {
                    switch (block.type) {
                        case "heading": return renderHeadingSettings(c);
                        case "paragraph": return renderParagraphSettings(c);
                        case "button": return renderButtonSettings(c);
                        case "image": return renderImageSettings(c);
                        case "divider": return renderDividerSettings(c);
                        case "columns": return renderColumnSettings(c);
                        case "social": return renderSocialSettings(c);
                        default: return <div className="text-xs text-gray-400 italic font-medium">Detailed settings for this block are coming soon.</div>;
                    }
                })()}
                {renderPaddingSettings(c)}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center gap-3 p-6 border-b border-gray-50">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Editing</span>
                        <span className="font-black text-sm text-gray-900 capitalize tracking-tight">{block.type.replace("-", " ")}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors shadow-none"><Trash2 className="h-4 w-4" /></button>
                        <button className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors shadow-none"><Layers className="h-4 w-4" /></button>
                        <button onClick={onBack} className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors shadow-none"><X className="h-4 w-4" /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{block.type}</h2>
                    </div>
                    {renderContent()}
                </div>

                <div className="p-8 bg-white border-t border-gray-50 shadow-[0_-8px_24px_rgba(0,0,0,0.02)]">
                    <button
                        onClick={() => onDelete(block.id)}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-100 transition-all active:scale-95"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Block
                    </button>
                </div>
        </div>
    );
}
