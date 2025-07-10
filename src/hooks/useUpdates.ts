import { useEffect, useState } from 'react';

import { updateFetcher } from '@amukhtar/api/updates/updateApi';

export const useUpdates = () => {
  const [loading, setLoading] = useState(false);
  const [update, setupdates] = useState(undefined);
  const [error, setError] = useState('');
  const getUpdate = async () => {
    try {
      setLoading(true);
      const response = await updateFetcher();
      setupdates(response);

      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to fetch posts. Please try again later.');

      setLoading(false);
    }
  };

  useEffect(() => {
    getUpdate();
  }, []);

  return { getUpdate, update, loading, error };
};
