import { useState, useCallback } from 'react';
import type { UserSchema } from '../api/types';
import { login } from '../api/authApi';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UserSchema | null>(null);

  const loginUser = useCallback(async (user: UserSchema) => {
    setLoading(true);
    setError(null);

    try {
      const result = await login(user);
      setData(result);
      return result;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed');
      return err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loginUser, loading, error, data };
};
