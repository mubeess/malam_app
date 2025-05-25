import React, { useState, useEffect } from 'react';
import type { Book } from '../../api/types';
import FileUpload from '../../components/FileUpload';

type BookFormData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;

interface BookFormProps {
  initialData?: Partial<Book>;
  onSubmit: (formData: BookFormData) => void;
  isSaving?: boolean;
  submitButtonText?: string;
}

const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSubmit,
  isSaving = false,
  submitButtonText = 'Save Book',
}) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    category: '',
    language: 'Hausa', // Default language
    publishYear: undefined, // Or new Date().getFullYear()
    // Ensure all fields in BookFormData are initialized
    isbn: '',
    publisher: '',
    pageCount: 0,
    // Add any other fields that might be part of BookFormData but not in initialData typically
  });
  const [uploadStatus, setUploadStatus] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      // Ensure all fields from initialData are correctly mapped
      // And provide defaults for fields that might be missing in Partial<Book> but required in BookFormData
      setFormData({
        title: initialData.title || '',
        author: 'Sheikh Abubakar Mukhtar',
        description: initialData.description || '',
        coverImage: initialData.coverImage || '',
        category: initialData.category || '',
        language: initialData.language || 'English',
        publishYear: initialData.publishYear || undefined,
        isbn: initialData.isbn || '',
        publisher: initialData.publisher || '',
        pageCount: initialData.pageCount || 0,
        // Map other fields as necessary
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'publishYear' || name === 'pageCount'
          ? value === ''
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white shadow-md rounded-lg">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        <h2 className="text-xl font-semibold">Upload Cover Page</h2>

        <FileUpload
          onUploadComplete={(url) => {
            setFormData({ ...formData, coverImage: url });
            setUploadStatus('Upload successful!');
          }}
          onUploadStart={() => {
            setUploadStatus('Starting upload...');
          }}
          onUploadError={(error) => {
            setUploadStatus(`Error: ${error}`);
          }}
          accept=".png,.jpg,.jpeg"
          maxSizeMB={5}
          placeholder="Upload Video/Audio"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
          Language <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="language"
          id="language"
          value={formData.language}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div> */}

      <div>
        <label htmlFor="publishYear" className="block text-sm font-medium text-gray-700">
          Publish Year
        </label>
        <input
          type="number"
          name="publishYear"
          id="publishYear"
          value={formData.publishYear === undefined ? '' : formData.publishYear}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Example of other fields if they were part of Book type */}
      {/*
      <div>
        <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">ISBN</label>
        <input type="text" name="isbn" id="isbn" value={formData.isbn} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div>
        <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">Publisher</label>
        <input type="text" name="publisher" id="publisher" value={formData.publisher} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div>
        <label htmlFor="pageCount" className="block text-sm font-medium text-gray-700">Page Count</label>
        <input type="number" name="pageCount" id="pageCount" value={formData.pageCount === undefined ? '' : formData.pageCount} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      */}

      <div>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
