import { EditorBlock } from "@/lib/editor-types";

export interface SavedTemplate {
    id: string;
    name: string;
    blocks: EditorBlock[];
    updatedAt: string;
    image?: string;
}

const STORAGE_KEY = "akaame_saved_templates";

export const getSavedTemplates = (): SavedTemplate[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveTemplate = (template: Omit<SavedTemplate, "updatedAt">) => {
    const templates = getSavedTemplates();
    const now = new Date().toISOString();

    const index = templates.findIndex(t => t.id === template.id);
    if (index !== -1) {
        templates[index] = { ...template, updatedAt: now };
    } else {
        templates.push({ ...template, updatedAt: now });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
};

export const deleteTemplate = (id: string) => {
    const templates = getSavedTemplates();
    const filtered = templates.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getTemplateById = (id: string): SavedTemplate | undefined => {
    return getSavedTemplates().find(t => t.id === id);
};
