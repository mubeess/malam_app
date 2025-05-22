import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import BookForm from './BookForm';
import { fetchBookById, updateBook } from '../../api/booksApi';
import { Book } from '../../api/types';

// Define the type for the data expected by updateBook, excluding id, createdAt, updatedAt
// For updates, typically all fields are optional (Partial<Book>), but BookForm expects Omit<...>
// The `updateBook` API function itself likely takes Partial<Book>.
// The BookForm will provide the full Omit<...> structure.
type BookUpdateData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;

const EditBookPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Book ID is missing.');
      setLoading(false);
      return;
    }

    const getBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedBook = await fetchBookById(Number(id));
        setBook(fetchedBook);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while fetching book details.');
        }
      } finally {
        setLoading(false);
      }
    };

    getBookDetails();
  }, [id]);

  const handleSubmit = async (formData: BookUpdateData) => {
    if (!id) {
      setError('Cannot update book without an ID.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      // Pass only the fields that BookForm provides.
      // The updateBook API might internally use Partial<Book>
      await updateBook(Number(id), formData); 
      navigate('/books');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while updating the book.');
      }
      setIsSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 text-lg p-10">Loading book details...</p>;
  }

  if (error && !book) { // Show error prominently if book could not be loaded
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-6">
           <Link to="/books" className="text-blue-600 hover:text-blue-800">&larr; Back to Book List</Link>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }
  
  if (!book) { // Should ideally be covered by error state if loading is false
    return <p className="text-center text-red-600 text-lg p-10">Book not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Book</h1>
        <Link
          to="/books"
          className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
        >
          &larr; Back to Book List
        </Link>
      </div>

      {error && ( // Display error related to submission, if any
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <BookForm
        initialData={book} // Pass the full book object; BookForm will pick what it needs
        onSubmit={handleSubmit}
        isSaving={isSaving}
        submitButtonText="Update Book"
      />
    </div>
  );
};

export default EditBookPage;
