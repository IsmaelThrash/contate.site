import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { logger } from '@/lib/logger.js';

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

  // Fetch the public profile from the `usuarios` table using native fetch to bypass client lock
  const fetchProfile = async (userId, accessToken) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(`${supabaseUrl}/rest/v1/usuarios?id=eq.${userId}&select=*`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.pgrst.object+json' // maybeSingle behavior
        }
      });
      
      if (!response.ok) {
        if (response.status === 406) return null; // No rows found
        throw new Error(`Database error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err) {
      logger.error('Unexpected error fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    let initialLoadComplete = false;

    // Trava de segurança: se o Supabase não responder em 8s, redireciona para login
    // Evita renderizar rotas protegidas com currentUser = null em redes lentas
    const timeoutId = setTimeout(() => {
      if (mounted && !initialLoadComplete) {
        logger.warn('[Auth] Fallback timeout triggered: forcing logout state');
        setCurrentUser(null);
        setSession(null);
        setLoading(false);
        initialLoadComplete = true;
      }
    }, 8000);

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
        logger.error('[Auth] Code exchange error:', err);
      }

      // 2. Set up listener - this fires immediately with INITIAL_SESSION or current state
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        logger.log('[Auth] Event:', event);
        setSession(session);
        
        try {
          if (session?.user) {
            // Optimistic update: set the user immediately so the app doesn't crash if fetchProfile hangs
            if (mounted) setCurrentUser(session.user);
            
            // Then attempt to fetch the profile in the background
            fetchProfile(session.user.id, session.access_token).then(profile => {
              if (mounted && profile) {
                setCurrentUser(prev => ({ ...prev, ...profile }));
              }
            }).catch(err => {
              logger.error('[Auth] Background profile fetch failed:', err);
            });
          } else {
            if (mounted) setCurrentUser(null);
          }
        } catch (err) {
          logger.error('[Auth] Profile listener error:', err);
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
      logger.error('Magic link error:', error.message);
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
      logger.error('Google Auth error:', error.message);
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
      
      if (!payload.slug && currentUser.slug) {
        payload.slug = currentUser.slug;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // Usar o token da sessão gerenciada pelo Supabase — nunca ler localStorage diretamente
      const accessToken = session?.access_token || supabaseAnonKey;

      const response = await fetch(`${supabaseUrl}/rest/v1/usuarios`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify(payload)
      });
        
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Falha na atualização do banco');
      }
      
      const responseData = await response.json();
      const updated = Array.isArray(responseData) ? responseData[0] : responseData;
      
      setCurrentUser(prev => ({ ...prev, ...updated }));
      return { success: true };
    } catch (error) {
      logger.error('Update profile error:', error.message);
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
