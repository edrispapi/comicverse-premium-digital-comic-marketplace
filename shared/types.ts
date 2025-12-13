export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
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
  rating: number; // 1-5
  pages: number;
  releaseDate: string;
  previewImageUrls: string[];
  chapters: Chapter[];
  audioUrl?: string;
  duration?: string; // e.g., '2h 15m'
}