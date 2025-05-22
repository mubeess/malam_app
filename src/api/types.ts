export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
export interface Book {
  id: number;
  title: string;
  author?: string;
  description?: string;
  coverImage?: string;
  category?: string; // e.g., 'Fiqh', 'Tafsir', 'Hadith', etc.
  language: string;
  publishYear?: number;
  createdAt: string;
  updatedAt: string;
}
export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BooksResponse {
  books: Book[];
  pagination: PaginationData;
}

export interface AudioReference {
  id?: number;
  bookId?: number;
  title?: string;
  url?: string;
  description?: string;
  duration?: number;
  speaker?: string;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AudioReferencesResponse {
  audio: AudioReference[];
  total: number;
}

export interface VideoReference {
  id: number;
  bookId: number;
  title: string;
  url: string;
  description?: string;
  duration?: number;
  speaker?: string;
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface VideoReferencesResponse {
  video: VideoReference[];
  total: number;
}
