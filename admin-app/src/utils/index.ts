import { useState } from 'react';
import axios, { AxiosError } from 'axios';

// Type definitions
interface UploadResponse {
  success: boolean;
  file: {
    url: string;
    key: string;
    ContentType: string;
    mimetype: string;
    size: number;
  };
}

interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<string | null>;
  isUploading: boolean;
  uploadError: string;
  uploadProgress: number;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file) return null;

    setIsUploading(true);
    setUploadError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<UploadResponse>(
        'https://malam-backend.onrender.com/file/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Upload progress tracking
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      if (response.data.success) {
        return response.data.file.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      let errorMessage = 'Upload failed';

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          // Server responded with error status
          errorMessage = `Upload failed: ${axiosError.response.status} ${axiosError.response.statusText}`;
        } else if (axiosError.request) {
          // Request was made but no response received
          errorMessage = 'Upload failed: No response from server';
        } else {
          // Error in setting up the request
          errorMessage = `Upload failed: ${axiosError.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setUploadError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      // Keep progress at 100% briefly before resetting
      if (uploadProgress === 100) {
        setTimeout(() => setUploadProgress(0), 1000);
      }
    }
  };

  return { uploadFile, isUploading, uploadError, uploadProgress };
};
