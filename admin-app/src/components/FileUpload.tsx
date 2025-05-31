/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useRef, useState } from 'react';
import { useFileUpload } from '../utils';

interface FileUploadItem {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  onFileUploadComplete?: (url: string, file: File) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  maxFiles?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onFileUploadComplete,
  onUploadStart,
  onUploadError,
  accept = '*/*',
  maxSizeMB = 10,
  maxFiles = 5,
  placeholder = 'Tap to upload files',
  className = '',
  disabled = false,
  multiple = true,
}) => {
  const { uploadFile } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadItems, setUploadItems] = useState<FileUploadItem[]>([]);

  const validateFile = (file: File): string | null => {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

    if (file.size > maxSize) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleFilesSelect = async (files: File[]) => {
    // Validate file count
    if (uploadItems.length + files.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Create upload items
    const newItems: FileUploadItem[] = files.map((file) => ({
      file,
      id: generateId(),
      status: 'pending' as const,
      progress: 0,
    }));

    // Validate each file
    const validItems: FileUploadItem[] = [];
    for (const item of newItems) {
      const validationError = validateFile(item.file);
      if (validationError) {
        onUploadError?.(validationError);
        continue;
      }
      validItems.push(item);
    }

    if (validItems.length === 0) return;

    setUploadItems((prev) => [...prev, ...validItems]);
    onUploadStart?.();

    // Upload files concurrently
    const uploadPromises = validItems.map(async (item) => {
      // Update status to uploading
      setUploadItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading' as const } : i))
      );

      try {
        const url = await uploadFile(item.file);

        if (url) {
          // Update status to completed
          setUploadItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, status: 'completed' as const, url, progress: 100 } : i
            )
          );
          onFileUploadComplete?.(url, item.file);
          return { ...item, url };
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: 'error' as const, error: errorMessage } : i
          )
        );
        return null;
      }
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    const successfulUrls = results.filter((item) => item !== null);

    if (successfulUrls.length > 0) {
      onUploadComplete(successfulUrls);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFilesSelect(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      handleFilesSelect(files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const removeFile = (id: string) => {
    setUploadItems((prev) => prev.filter((item) => item.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isUploading = uploadItems.some((item) => item.status === 'uploading');
  const hasFiles = uploadItems.length > 0;

  return (
    <div className={`w-full max-w-[100%] overflow-hidden ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
        multiple={multiple}
      />

      {/* Upload area */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${hasFiles ? 'min-h-[80px]' : 'min-h-[120px]'} flex flex-col justify-center items-center
        `}
      >
        {!hasFiles && (
          <>
            {/* Upload icon */}
            <svg
              className="w-8 h-8 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-600 font-medium mb-1">{placeholder}</p>
            <p className="text-xs text-gray-400">
              {multiple
                ? `Drop up to ${maxFiles} files here or click to browse`
                : 'Drop a file here or click to browse'}
            </p>
          </>
        )}

        {hasFiles && (
          <div className="w-full">
            <p className="text-gray-600 font-medium mb-2">
              {multiple ? 'Click to add more files' : 'Click to replace file'}
            </p>
          </div>
        )}
      </div>

      {/* File list */}
      {hasFiles && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {uploadItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center flex-1 min-w-0">
                {/* File icon */}
                <div className="flex-shrink-0 mr-3">
                  {item.status === 'completed' ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : item.status === 'error' ? (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  ) : item.status === 'uploading' ? (
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg
                        className="animate-spin w-4 h-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.file.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500">{formatFileSize(item.file.size)}</p>
                    {item.status === 'uploading' && (
                      <p className="text-xs text-blue-600">Uploading...</p>
                    )}
                    {item.status === 'completed' && (
                      <p className="text-xs text-green-600">Complete</p>
                    )}
                    {item.status === 'error' && (
                      <p className="text-xs text-red-600">{item.error || 'Failed'}</p>
                    )}
                  </div>

                  {/* Progress bar for uploading files */}
                  {item.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(item.id);
                }}
                className="ml-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={item.status === 'uploading'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File type hint */}
      {accept !== '*/*' && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Accepted files: {accept.replace(/\./g, '').toUpperCase()}
        </p>
      )}

      {/* File count info */}
      {multiple && (
        <p className="text-xs text-gray-400 mt-1 text-center">
          {uploadItems.length} of {maxFiles} files selected
        </p>
      )}
    </div>
  );
};

export default FileUpload;
