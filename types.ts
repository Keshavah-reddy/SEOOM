export enum Platform {
  YOUTUBE = 'YouTube',
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
  LINKEDIN = 'LinkedIn',
  TWITTER = 'Twitter'
}

export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  TELUGU = 'Telugu'
}

export interface GeneratedContent {
  title: string;
  description: string;
  tags: string[];
  strategy: string;
  validityScore: number;
  sources?: Array<{ title: string; uri: string }>;
}

export interface DualPlatformContent {
  youtube: GeneratedContent;
  instagram: GeneratedContent;
}

export interface HistoryItem {
  id: string;
  topic: string;
  timestamp: number;
  content: DualPlatformContent;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}