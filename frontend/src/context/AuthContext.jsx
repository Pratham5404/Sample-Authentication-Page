import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('deknek3d_token');
      const savedUser = localStorage.getItem('deknek3d_user');

      if (token && savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);

          // Verify token is still valid by refreshing
          const res = await authAPI.refresh();
          if (res.data.success) {
            localStorage.setItem('deknek3d_token', res.data.token);
            localStorage.setItem('deknek3d_user', JSON.stringify(res.data.user));
            setUser(res.data.user);
          }
        } catch {
          // Token invalid — clear session
          localStorage.removeItem('deknek3d_token');
          localStorage.removeItem('deknek3d_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = useCallback(async ({ fullName, email, password, confirmPassword }) => {
    setError(null);
    try {
      const res = await authAPI.register({ fullName, email, password, confirmPassword });
      const { token, user: userData } = res.data;
      localStorage.setItem('deknek3d_token', token);
      localStorage.setItem('deknek3d_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('deknek3d_token', token);
      localStorage.setItem('deknek3d_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore logout API errors
    } finally {
      localStorage.removeItem('deknek3d_token');
      localStorage.removeItem('deknek3d_user');
      setUser(null);
      setError(null);
    }
  }, []);

  const updateProfile = useCallback(async (data) => {
    setError(null);
    try {
      const res = await userAPI.updateProfile(data);
      const updatedUser = res.data.user;
      localStorage.setItem('deknek3d_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed.';
      setError(msg);
      return { success: false, message: msg };
    }
  }, []);

  const changePassword = useCallback(async (data) => {
    setError(null);
    try {
      const res = await userAPI.changePassword(data);
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Password change failed.';
      setError(msg);
      return { success: false, message: msg };
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
