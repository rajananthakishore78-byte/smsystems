import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '../firebase.js';
import { adminLogin as apiAdminLogin } from '../api/client.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent admin session
    const savedToken = localStorage.getItem('cctv_admin_token');
    const savedUser = localStorage.getItem('cctv_admin_user');

    if (savedToken && savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser));
        setIsAdmin(true);
      } catch (e) {
        localStorage.removeItem('cctv_admin_token');
        localStorage.removeItem('cctv_admin_user');
      }
    }

    // Also listen to Firebase auth if available
    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdToken();
          localStorage.setItem('cctv_admin_token', token);
          const userData = { email: user.email, uid: user.uid, role: 'admin' };
          localStorage.setItem('cctv_admin_user', JSON.stringify(userData));
          setAdminUser(userData);
          setIsAdmin(true);
        }
      });
    }

    setLoading(false);
    return () => unsubscribe();
  }, []);

  const loginWithPasscode = async (passcode, email = 'admin@securevisioncctv.com') => {
    try {
      const res = await apiAdminLogin(passcode, email);
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('cctv_admin_token', token);
        localStorage.setItem('cctv_admin_key', token);
        localStorage.setItem('cctv_admin_user', JSON.stringify(user));
        setAdminUser(user);
        setIsAdmin(true);
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

  const loginWithFirebase = async (email, password) => {
    if (!auth) {
      return { success: false, message: 'Firebase Client is not configured. Use the Admin Passcode option.' };
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const user = {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        role: 'admin'
      };
      localStorage.setItem('cctv_admin_token', token);
      localStorage.setItem('cctv_admin_user', JSON.stringify(user));
      setAdminUser(user);
      setIsAdmin(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error(err);
      }
    }
    localStorage.removeItem('cctv_admin_token');
    localStorage.removeItem('cctv_admin_key');
    localStorage.removeItem('cctv_admin_user');
    setAdminUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAdmin,
        loading,
        loginWithPasscode,
        loginWithFirebase,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
