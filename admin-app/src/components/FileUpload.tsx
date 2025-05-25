import React, { useRef, useState } from 'react';
import { useFileUpload } from '../utils';
// Import your hook

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadStart,
  onUploadError,
  accept = '*/*',
  maxSizeMB = 10,
  placeholder = 'Tap to upload file',
  className = '',
  disabled = false,
}) => {
  const { uploadFile, isUploading, uploadError, uploadProgress } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File): string | null => {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

    if (file.size > maxSize) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onUploadError?.(validationError);
      return;
    }

    setSelectedFile(file);
    onUploadStart?.();

    const url = await uploadFile(file);

    if (url) {
      onUploadComplete(url);
    } else if (uploadError && onUploadError) {
      onUploadError(uploadError);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
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
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full max-w-[100%] overflow-hidden ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
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
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          min-h-[120px] flex flex-col justify-center items-center
        `}
      >
        {!isUploading && !selectedFile && (
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
          </>
        )}

        {/* Loading state */}
        {isUploading && (
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-center mb-3">
              <svg className="animate-spin w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
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

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>

            <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>

            {selectedFile && (
              <p className="text-xs text-gray-400 mt-1 truncate">
                ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>
        )}

        {/* Success state */}
        {!isUploading && selectedFile && !uploadError && (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-500"
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
            <p className="text-green-600 font-medium mb-1">Upload complete!</p>
            <p className="text-[10px] text-gray-400 truncate">
              ({formatFileSize(selectedFile.size)})
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-red-500 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        </div>
      )}

      {/* File type hint */}
      {accept !== '*/*' && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Accepted files: {accept.replace(/\./g, '').toUpperCase()}
        </p>
      )}
    </div>
  );
};
export default FileUpload;
