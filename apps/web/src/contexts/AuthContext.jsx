import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return safe defaults to prevent crashes during HMR or when outside AuthProvider
    return {
      currentUser: null,
      session: null,
      isAuthenticated: false,
      loginWithMagicLink: async () => ({ success: false, error: 'Auth not ready' }),
      loginWithGoogle: async () => ({ success: false, error: 'Auth not ready' }),
      logout: async () => {},
      updateUserColor: async () => ({ success: false }),
      updateProfile: async () => ({ success: false }),
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the public profile from the `usuarios` table
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error);
      }
      return data;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    let initialLoadComplete = false;

    // Trava de segurança: se o Supabase não responder em 3s, força a abertura do site
    const timeoutId = setTimeout(() => {
      if (mounted && !initialLoadComplete) {
        console.warn('[Auth] Fallback timeout triggered: forcing loading to false');
        setLoading(false);
        initialLoadComplete = true;
      }
    }, 3000);

    const initializeAuth = async () => {
      try {
        // 1. Process PKCE code if present (from magic link)
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
          window.history.replaceState({}, '', window.location.pathname);
        }
      } catch (err) {
        console.error('[Auth] Code exchange error:', err);
      }

      // 2. Set up listener - this fires immediately with INITIAL_SESSION or current state
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        console.log('[Auth] Event:', event);
        setSession(session);
        
        try {
          if (session?.user) {
            const profile = await fetchProfile(session.user.id);
            if (mounted) setCurrentUser({ ...session.user, ...profile });
          } else {
            if (mounted) setCurrentUser(null);
          }
        } catch (err) {
          console.error('[Auth] Profile fetch error in listener:', err);
        } finally {
          if (mounted && !initialLoadComplete) {
            setLoading(false);
            initialLoadComplete = true;
            clearTimeout(timeoutId);
          }
        }
      });

      return subscription;
    };

    let subscription;
    initializeAuth().then(sub => { subscription = sub; });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, []);

  // Magic Link Login
  const loginWithMagicLink = async (email) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/login',
        },
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Magic link error:', error.message);
      return { success: false, error: 'Erro ao enviar o link de acesso. Verifique seu e-mail.' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/login',
        }
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Google Auth error:', error.message);
      return { success: false, error: 'Falha ao autenticar com o Google.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setSession(null);
  };

  const updateProfile = async (data) => {
    if (!currentUser?.id) return { success: false };
    try {
      const payload = {
        id: currentUser.id,
        ...data
      };
      
      // If we are updating something else (e.g. cor_fundo) and slug is missing,
      // we must provide the existing slug to satisfy the NOT NULL constraint in upsert.
      if (!payload.slug && currentUser.slug) {
        payload.slug = currentUser.slug;
      }

      const { data: updated, error } = await supabase
        .from('usuarios')
        .upsert(payload)
        .select()
        .maybeSingle();
        
      if (error) throw error;
      
      setCurrentUser(prev => ({ ...prev, ...updated }));
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error.message);
      return { success: false, error: 'Falha ao atualizar perfil.' };
    }
  };

  const updateUserColor = async (color) => {
    return updateProfile({ cor_fundo: color });
  };

  const value = {
    currentUser,
    session,
    isAuthenticated: !!session,
    loginWithMagicLink,
    loginWithGoogle,
    logout,
    updateUserColor,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
