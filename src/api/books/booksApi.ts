import axiosInstance from '../axiosInstance';
import { Book, BooksResponse } from '../types';

// Get all books
export const fetchBooks = async (): Promise<BooksResponse> => {
  const response = await axiosInstance.get<BooksResponse>('/books');
  return response.data;
};

// Get a single book by ID
export const fetchBookById = async (id: number): Promise<Book> => {
  const response = await axiosInstance.get<Book>(`/books/${id}`);
  return response.data;
};

// Create a new book
export const createBook = async (
  bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Book> => {
  const response = await axiosInstance.post<Book>('/books/add', bookData);
  return response.data;
};

// Update an existing book
export const updateBook = async (id: number, bookData: Partial<Book>): Promise<Book> => {
  const response = await axiosInstance.put<Book>(`/books/${id}`, bookData);
  return response.data;
};

// Delete a book
export const deleteBook = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/books/${id}`);
};
