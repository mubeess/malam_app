/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBooks, deleteBook } from '../../api/booksApi';
import {
  Edit3,
  Trash2,
  Plus,
  BookOpen,
  User,
  Tag,
  Globe,
  Play,
  Video,
  Music,
  MoreVertical,
  Search,
  Filter,
  Grid,
  List,
} from 'lucide-react';
import type { Book } from '../../api/types';

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchBooks();
      const booksData = response?.books || [];
      setBooks(booksData);
      setFilteredBooks(booksData);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching books.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Filter books based on search and category
  useEffect(() => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.category && book.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedCategory]);

  const handleEdit = (id: string | number) => {
    navigate(`/books/edit/${id}`);
  };

  const handleManageMedia = (id: string | number) => {
    navigate(`/books/${id}`);
  };

  const handleDeleteBook = async (id: string | number) => {
    if (
      window.confirm('Are you sure you want to delete this book? This action cannot be undone.')
    ) {
      setIsDeleting(String(id));
      setError(null);
      try {
        await deleteBook(Number(id));
        await loadBooks();
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to delete book: ${err.message}`);
        } else {
          setError('An unknown error occurred while deleting the book.');
        }
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const categories = [...new Set(books.map((book) => book.category).filter(Boolean))];

  const BookCard = ({ book }: { book: Book }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">{book.title}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <User className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="text-sm truncate">{book.author}</span>
            </div>
          </div>
          <div className="ml-2 flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              #{book.id}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {book.category && (
            <div className="flex items-center text-gray-600">
              <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{book.category}</span>
            </div>
          )}
          {book.language && (
            <div className="flex items-center text-gray-600">
              <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{book.language}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleManageMedia(book.id)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Media
          </button>
          <button
            onClick={() => handleEdit(book.id)}
            disabled={isDeleting === String(book.id)}
            className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteBook(book.id)}
            disabled={isDeleting === String(book.id)}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {isDeleting === String(book.id) ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const BookListItem = ({ book }: { book: Book }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
              #{book.id}
            </span>
            <h3 className="text-base font-semibold text-gray-900 truncate">{book.title}</h3>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {book.author}
            </span>
            {book.category && (
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {book.category}
              </span>
            )}
            {book.language && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {book.language}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => handleManageMedia(book.id)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-1.5 px-3 rounded-md text-xs transition-all duration-200 flex items-center gap-1"
          >
            <Play className="w-3 h-3" />
            Media
          </button>
          <button
            onClick={() => handleEdit(book.id)}
            disabled={isDeleting === String(book.id)}
            className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-md transition-colors duration-200 disabled:opacity-50"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleDeleteBook(book.id)}
            disabled={isDeleting === String(book.id)}
            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md transition-colors duration-200 disabled:opacity-50"
          >
            {isDeleting === String(book.id) ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Book Library
            </h1>
            <p className="text-gray-600 mt-1">Manage your book collection and media content</p>
          </div>
          <Link
            to="/books/new"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 justify-center sm:justify-start"
          >
            <Plus className="w-5 h-5" />
            Add New Book
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books by title, author, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-5 h-5 text-red-500 mr-3">⚠️</div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {filteredBooks.length === 0 && !loading ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory !== 'all'
                ? 'No books match your search'
                : 'No books in your library'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : 'Start building your collection by adding your first book'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Link
                to="/books/new"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Book
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
              </p>
            </div>

            {/* Books Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBooks.map((book) => (
                  <BookListItem key={book.id} book={book} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookListPage;
