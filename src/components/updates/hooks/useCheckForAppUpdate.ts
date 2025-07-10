/* eslint-disable react-hooks/exhaustive-deps */

import useLoading from '@tradely/utils';
import { useEffect, useState } from 'react';
import { useGetUpdatesQuery } from '../services/api';

const useCheckForAppUpdate = () => {
  const handle = useLoading();
  const { data, isLoading } = useGetUpdatesQuery('');
  const [update, setUpdate] = useState<any>(null);

  useEffect(() => {
    console.log(update);
    if (data) {
      setUpdate(data);
    }
  }, [data]);

  return {
    loading: isLoading,
    update,
  };
};

export default useCheckForAppUpdate;
