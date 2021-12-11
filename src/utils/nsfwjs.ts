export type LABEL = 'Drawing' | 'Hentai' | 'Porn' | 'Neutral' | 'Sexy';

export interface Content {
    type: "gif" | "image";
    name: string;
    url: string;
}

export interface Category {
    name: LABEL;
    accuracy: number;
}

// pleasantcord's server configuration. Unique per server.
export interface Configuration {
    // Minimum accuracy level to be classified as NSFW
    readonly accuracy: number;
    // List of image categories
    readonly categories: LABEL[];
    // Determine if possible NSFW contents should be deleted or not.
    readonly delete: boolean;
}

export const BASE_CONFIG: Configuration = {
    accuracy: 0.75,
    categories: ['Hentai', 'Porn'],
    delete: true,
};