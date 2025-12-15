export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface PaginatedResponse<T> {
  items: T[];
  next: string | null;
}
export interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  message: string;
  time: string;
}
export interface PostReactions {
    votes: number;
    stars: number;
    up: number;
    down: number;
    emojis: { [emoji: string]: number };
    stickers: { [emoji: string]: number };
    heart: number;
}
export interface Post {
    id: string;
    user: {
        name: string;
        avatar: string;
        isCreator?: boolean;
    };
    type: 'text' | 'image' | 'video' | 'voice' | 'file';
    content: string;
    time: string;
    reactions: PostReactions;
    replies?: Comment[];
}
export interface Award {
  id: string;
  type: 'top-rated' | 'new-hot' | 'bestseller';
  earnedAt: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  pts: number;
  awards: Award[];
  libraryUnlocked: Record<string, boolean>;
}
export interface AuthResponse {
  user: User;
  token: string;
}
export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
}
export interface Genre {
  id: string;
  name: string;
}
export interface Chapter {
  id: string;
  title: string;
  progress: number; // 0-100
}
export interface Comic {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  authorIds: string[];
  genreIds: string[];
  price: number;
  rating: number; // DEPRECATED, use ratings.avg
  ratings: {
    avg: number;
    votes: number;
    up: number;
    down: number;
  };
  pages: number;
  releaseDate: string;
  previewImageUrls: string[];
  chapters: Chapter[];
  comments: Comment[];
  posts: Post[];
  awards: string[];
  audioUrl?: string;
  duration?: string; // e.g., '2h 15m'
  bannerText?: string;
}
export interface Notification {
    id: string;
    type: 'release' | 'promo' | 'system';
    title: string;
    date: string;
    read: boolean;
}
export interface UserStats {
    reads: number;
    hours: number;
    spent: number;
}