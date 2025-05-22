import { useState } from 'react';
import {
  fetchBooks,
  fetchBookById,
  createBook,
  updateBook,
  deleteBook,
} from '@amukhtar/api/books/booksApi';
import { Book } from '@amukhtar/api/types';

export const useBooks = () => {
  const [loading, setLoading] = useState(false);
  const [allBooks, setAllBooks] = useState<Book[] | []>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [error, setError] = useState('');

  // Get all books
  const getAllBooks = async () => {
    try {
      setLoading(true);

      const response = await fetchBooks();
      setAllBooks(response?.books);

      setLoading(false);
      return response;
    } catch (error) {
      console.log(error, 'loggg', 'err');
      setError('Failed to fetch books. Please try again later.');
      setLoading(false);
    }
  };

  // Get a single book by ID
  const getBook = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetchBookById(id);
      setCurrentBook(response);
      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to fetch book. Please try again later.');
      setLoading(false);
    }
  };

  // Add a new book
  const addBook = async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await createBook(bookData);
      setAllBooks((prevBooks) => [...prevBooks, response]);
      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to add book. Please try again later.');
      setLoading(false);
    }
  };

  // Update an existing book
  const editBook = async (id: number, bookData: Partial<Book>) => {
    try {
      setLoading(true);
      const response = await updateBook(id, bookData);
      setAllBooks((prevBooks) => prevBooks.map((book) => (book.id === id ? response : book)));
      if (currentBook?.id === id) {
        setCurrentBook(response);
      }
      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to update book. Please try again later.');
      setLoading(false);
    }
  };

  // Delete a book
  const removeBook = async (id: number) => {
    try {
      setLoading(true);
      await deleteBook(id);
      setAllBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      if (currentBook?.id === id) {
        setCurrentBook(null);
      }
      setLoading(false);
      return true;
    } catch (error) {
      setError('Failed to delete book. Please try again later.');
      setLoading(false);
      return false;
    }
  };

  return {
    getAllBooks,
    getBook,
    addBook,
    editBook,
    removeBook,
    allBooks,
    currentBook,
    loading,
    error,
  };
};
