import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  adminLogin as apiAdminLogin,
  adminLoginWithPasscode as apiAdminLoginWithPasscode,
  refreshAdminSession,
  getAuthStatus,
  clearAdminSession,
  ADMIN_TOKEN_KEY,
  ADMIN_REFRESH_KEY,
  ADMIN_KEY_KEY,
  ADMIN_USER_KEY
} from '../api/client.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore the saved session on load. A refresh token also proves the account
  // is still allowed in, so a revoked admin is signed out immediately.
  useEffect(() => {
    const bootstrap = async () => {
      const savedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
      const savedUser = localStorage.getItem(ADMIN_USER_KEY);
      const savedRefresh = localStorage.getItem(ADMIN_REFRESH_KEY);

      // The auth mode tells us whether a refresh token is expected at all.
      const statusRes = await getAuthStatus().catch(() => null);
      const mode = statusRes?.data?.auth?.mode;
      let restored = false;

      if (savedRefresh) {
        try {
          const { data } = await refreshAdminSession(savedRefresh);
          if (data?.token) {
            localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
            if (data.refreshToken) localStorage.setItem(ADMIN_REFRESH_KEY, data.refreshToken);
            localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
            setAdminUser(data.user);
            setIsAdmin(true);
            restored = true;
          }
        } catch {
          clearAdminSession();
        }
      } else if (mode === 'passcode' && savedToken && savedUser) {
        try {
          setAdminUser(JSON.parse(savedUser));
          setIsAdmin(true);
          restored = true;
        } catch {
          clearAdminSession();
        }
      } else if (savedToken && mode && mode !== 'passcode') {
        // Leftover session from the old passcode scheme with nothing to refresh.
        clearAdminSession();
      }

      if (!restored) {
        setAdminUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    bootstrap();
  }, []);

  const startSession = ({ token, refreshToken, user }) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    if (refreshToken) localStorage.setItem(ADMIN_REFRESH_KEY, refreshToken);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    setAdminUser(user);
    setIsAdmin(true);
  };

  // Supabase Auth sign-in (email + password)
  const loginWithEmail = async (email, password) => {
    try {
      const res = await apiAdminLogin(email, password);
      if (res.data.success) {
        startSession(res.data);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Sign in failed. Please check your email and password.'
      };
    }
  };

  // Fallback for servers running without Supabase Auth configured.
  const loginWithPasscode = async (passcode, email = 'admin@smsystems.in') => {
    try {
      const res = await apiAdminLoginWithPasscode(passcode, email);
      if (res.data.success) {
        startSession(res.data);
        localStorage.setItem(ADMIN_KEY_KEY, res.data.token);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your passcode.'
      };
    }
  };

  const logout = () => {
    clearAdminSession();
    setAdminUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAdmin,
        loading,
        loginWithEmail,
        loginWithPasscode,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
