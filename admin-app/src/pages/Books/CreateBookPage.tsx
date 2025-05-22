import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BookForm from './BookForm';
import { createBook } from '../../api/booksApi';
import type { Book } from '../../api/types';

// Define the type for the data expected by createBook, excluding id, createdAt, updatedAt
type BookCreationData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;

const CreateBookPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: BookCreationData) => {
    setIsSaving(true);
    setError(null);
    try {
      await createBook(formData);
      navigate('/books');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while creating the book.');
      }
      setIsSaving(false); // Only set isSaving to false if there's an error
    }
    // Do not set isSaving to false here if successful, as the page will navigate away
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create New Book</h1>
        <Link
          to="/books"
          className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
        >
          &larr; Back to Book List
        </Link>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <BookForm onSubmit={handleSubmit} isSaving={isSaving} submitButtonText="Create Book" />
    </div>
  );
};

export default CreateBookPage;
