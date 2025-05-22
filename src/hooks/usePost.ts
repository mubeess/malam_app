import { useState } from 'react';
import { postFetcher } from '@amukhtar/api/posts/postApi';
import { Post } from '@amukhtar/api/types';

export const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [allPost, setAllPosts] = useState<Post[] | []>([]);
  const [error, setError] = useState('');
  const getAllPosts = async () => {
    try {
      setLoading(true);
      const response = await postFetcher();
      setAllPosts(response);
      console.log(response);
      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to fetch posts. Please try again later.');

      setLoading(false);
    }
  };

  return { getAllPosts, allPost, loading, error };
};
