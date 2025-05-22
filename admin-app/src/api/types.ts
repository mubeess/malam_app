export interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface Book {
  id: string; // Assuming string ID, adjust if numeric
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  // Add other relevant book properties as needed
}

export interface BooksResponse {
  data: Book[];
  pagination: PaginationData;
}

export interface AudioReference {
  id: string; // Assuming string ID
  title: string;
  url: string;
  duration?: string; // e.g., "5:30"
  // Add other relevant audio properties as needed
}

export interface AudioReferencesResponse {
  data: AudioReference[];
  pagination: PaginationData;
}

export interface VideoReference {
  id: string; // Assuming string ID
  title: string;
  url: string;
  thumbnail?: string;
  duration?: string; // e.g., "10:00"
  // Add other relevant video properties as needed
}

export interface VideoReferencesResponse {
  data: VideoReference[];
  pagination: PaginationData;
}
