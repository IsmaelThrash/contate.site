
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (pb.authStore.isValid) {
        try {
          // Refresh token to ensure it's still valid
          const authData = await pb.collection('usuarios').authRefresh({ $autoCancel: false });
          setCurrentUser(authData.record);
        } catch (error) {
          console.error('Auth refresh failed:', error);
          pb.authStore.clear();
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for auth store changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('usuarios').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Email ou senha incorretos.' };
    }
  };

  const signup = async (email, password, passwordConfirm, slug) => {
    try {
      const data = {
        email,
        password,
        passwordConfirm,
        slug,
        cor_fundo: '#000000',
        status: 1
      };
      
      await pb.collection('usuarios').create(data, { $autoCancel: false });
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Falha ao criar conta. Tente novamente.';
      
      // Handle specific PocketBase validation errors
      if (error.response?.data) {
        const errData = error.response.data;
        if (errData.email) {
          errorMessage = `Email: ${errData.email.message}`;
        } else if (errData.slug) {
          errorMessage = `Slug: ${errData.slug.message}`;
        } else if (errData.password) {
          errorMessage = `Senha: ${errData.password.message}`;
        } else if (errData.passwordConfirm) {
          errorMessage = `Confirmação de senha: ${errData.passwordConfirm.message}`;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const updateUserColor = async (color) => {
    if (!currentUser) return { success: false };
    try {
      const updated = await pb.collection('usuarios').update(
        currentUser.id, 
        { cor_fundo: color }, 
        { $autoCancel: false }
      );
      setCurrentUser(updated);
      return { success: true };
    } catch (error) {
      console.error('Update color error:', error);
      return { success: false, error: 'Falha ao atualizar cor.' };
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    signup,
    logout,
    updateUserColor
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
