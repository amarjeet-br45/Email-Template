export type BlockType =
    | "heading"
    | "paragraph"
    | "image"
    | "button"
    | "divider"
    | "social"
    | "video"
    | "html"
    | "columns"
    | "product-recommendation"
    | "order-summary"
    | "menu"
    | "table"
    | "timer";

export interface EditorBlock {
    id: string;
    type: BlockType;
    content: any;
    style?: React.CSSProperties;
}

export interface HeadingContent {
    text: string;
    fontSize: number;
    textAlign: "left" | "center" | "right" | "justify";
    color: string;
}

export interface ParagraphContent {
    text: string;
    lineHeight: number;
    color: string;
    textAlign?: "left" | "center" | "right" | "justify";
}

export interface ButtonContent {
    text: string;
    link: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
    paddingX: number;
    paddingY: number;
    widthMode: "auto" | "full" | "custom";
    width: number;
    align: "left" | "center" | "right";
}

export interface ImageContent {
    url: string;
    alt: string;
    width: number;
    widthMode: "auto" | "full" | "custom";
    align: "left" | "center" | "right" | "full";
    link: string;
    linkAction?: string;
    target: "_blank" | "_self";
    padding: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    thickness?: number;
    color?: string;
}

export interface DividerContent {
    thickness: number;
    color: string;
    spacing: number;
}

export type IconType =
    | "circle"
    | "circle-black"
    | "circle-white"
    | "round"
    | "round-black"
    | "square"
    | "square-black";

export interface SocialIcon {
    platform: string;
    url: string;
}

export interface SocialContent {
    iconType: IconType;
    icons: SocialIcon[];
    align: "left" | "center" | "right";
    iconSize: number;
    iconSpacing: number;
}

export interface VideoContent {
    url: string;
    placeholder?: string;
}

export interface HTMLContent {
    html: string;
}

export interface ColumnContent {
    count: 2 | 3;
    columns: {
        id: string;
        blocks: EditorBlock[];
    }[];
}

export interface ProductContent {
    title: string;
    price: string;
    image: string;
    ctaText: string;
    link?: string;
}

export interface OrderItem {
    name: string;
    qty: number;
    price: string;
}

export interface OrderSummaryContent {
    items: OrderItem[];
    subtotal: string;
    shipping: string;
    total: string;
}

export interface MenuItem {
    label: string;
    url: string;
}

export interface MenuContent {
    items: MenuItem[];
    align: "left" | "center" | "right";
    color: string;
}

export interface EmailLayout {
    blocks: EditorBlock[];
    settings: {
        backgroundColor: string;
        canvasColor: string;
        subject: string;
        previewText: string;
    };
}
