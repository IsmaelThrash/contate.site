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

    const setupAuth = async () => {
      // 1. Set up the auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        console.log('[Auth] Event:', event, session ? `user=${session.user.email}` : 'no session');

        setSession(session);

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (mounted) {
            setCurrentUser({ ...session.user, ...profile });
          }
        } else {
          if (mounted) setCurrentUser(null);
        }

        if (mounted) setLoading(false);
      });

      // 2. Check for PKCE code in URL and exchange it explicitly
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        console.log('[Auth] Detected PKCE code in URL, exchanging...');
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('[Auth] Code exchange error:', error.message);
          } else {
            console.log('[Auth] Code exchange success:', data.user?.email);
          }
        } catch (err) {
          console.error('[Auth] Code exchange exception:', err);
        }
        // Clean the URL after processing
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        // 3. No code in URL — just check existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          console.log('[Auth] Existing session:', session ? `user=${session.user.email}` : 'none');
          setSession(session);
          if (session?.user) {
            const profile = await fetchProfile(session.user.id);
            if (mounted) {
              setCurrentUser({ ...session.user, ...profile });
            }
          }
          setLoading(false);
        }
      }

      return subscription;
    };

    let subscription;
    setupAuth().then(sub => { subscription = sub; });
    
    // Fallback: force loading to false after 3 seconds if Supabase hangs
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('[Auth] Forcing loading to false due to timeout!');
        setLoading(false);
      }
    }, 3000);

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
