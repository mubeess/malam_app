import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { Link, useNavigate } from 'react-router-dom';
import { fetchBooks, deleteBook } from '../../api/booksApi'; // Imported deleteBook
import { Book } from '../../api/types';

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Can be used for general errors or success messages
  const [isDeleting, setIsDeleting] = useState<boolean>(false); // For delete operation loading state
  const navigate = useNavigate();

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchBooks();
      setBooks(response.data || []);
      setError(null); // Clear previous errors/messages
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching books.');
      }
    } finally {
      setLoading(false);
    }
  }, []); // useCallback to memoize loadBooks

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleEdit = (id: string | number) => {
    navigate(`/books/edit/${id}`);
  };

  const handleDeleteBook = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setIsDeleting(true); // Indicate deletion is in progress
      setError(null); // Clear previous messages
      try {
        await deleteBook(Number(id));
        // Instead of filtering, re-fetch to ensure data consistency
        // setBooks(books.filter(book => book.id !== id)); 
        await loadBooks(); // Re-fetch books
        // Optionally, set a success message (could use setError for this if enhanced)
        // For now, successful re-fetch is the indicator.
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to delete book: ${err.message}`);
        } else {
          setError('An unknown error occurred while deleting the book.');
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Book Management</h1>
        <Link
          to="/books/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Create New Book
        </Link>
      </div>

      {/* Display general loading message */}
      {loading && !isDeleting && <p className="text-center text-gray-600 text-lg">Loading books...</p>}
      {/* Display deleting message */}
      {isDeleting && <p className="text-center text-gray-600 text-lg">Deleting book...</p>}
      
      {/* Display error or success messages */}
      {error && <p className={`text-center p-3 rounded-lg text-lg ${error.startsWith('Failed to delete') ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`}>{error}</p>}
      
      {!loading && !error && books.length === 0 && (
        <p className="text-center text-gray-600 text-lg">No books found. <Link to="/books/new" className="text-blue-600 hover:underline">Add one now!</Link></p>
      )}

      {!loading && books.length > 0 && ( // Ensure table doesn't show if loading initial data
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Author</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Language</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {books.map((book) => (
                <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{book.id}</td>
                  <td className="py-3 px-4">{book.title}</td>
                  <td className="py-3 px-4">{book.author}</td>
                  <td className="py-3 px-4">{book.category || 'N/A'}</td>
                  <td className="py-3 px-4">{book.language || 'N/A'}</td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => handleEdit(book.id)} 
                      disabled={isDeleting} // Disable edit while deleting
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-md mr-2 text-sm transition duration-150 ease-in-out disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      disabled={isDeleting} // Disable delete button while an operation is in progress
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition duration-150 ease-in-out disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookListPage;
