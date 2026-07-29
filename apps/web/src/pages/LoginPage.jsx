import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast';
import { Link2, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { loginWithMagicLink, loginWithGoogle, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Detect OAuth errors returned via URL params (silent failures from Supabase)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get('error');
    const errorDescription = params.get('error_description');

    if (errorCode || errorDescription) {
      // Map known Supabase error codes to user-friendly messages
      let friendlyMessage = errorDescription || 'Ocorreu um erro na autenticação.';

      if (errorDescription?.includes('identity already linked') ||
          errorDescription?.includes('user_already_exists') ||
          errorCode === 'user_already_exists') {
        friendlyMessage = 'Detectamos que este e-mail já possui uma conta. Suas contas foram vinculadas automaticamente. Tente fazer login novamente.';
      } else if (errorDescription?.includes('access_denied') ||
                 errorCode === 'access_denied') {
        friendlyMessage = 'Acesso negado pelo provedor de autenticação. Tente novamente.';
      }

      toast({
        title: '⚠️ Problema no login',
        description: friendlyMessage,
        variant: 'destructive',
        duration: 8000,
      });

      // Clean up the URL to remove error params
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginWithMagicLink(email);
    
    setLoading(false);

    if (result.success) {
      setMagicLinkSent(true);
      toast({
        title: 'Link enviado!',
        description: 'Verifique sua caixa de entrada para fazer login.'
      });
    } else {
      toast({
        title: 'Erro',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    toast({
      title: '🔗 Conectando com Google',
      description: 'Se você já usa Link Mágico com este e-mail, suas contas serão unificadas automaticamente.',
      duration: 5000,
    });

    const result = await loginWithGoogle();
    setLoading(false);

    if (!result.success) {
      toast({
        title: 'Erro no login',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - contate.site</title>
        <meta name="description" content="Faça login na sua conta do contate.site com Magic Link." />
      </Helmet>

      <div className="min-h-screen mesh-bg flex flex-col">
        <Header />
        
        <div className="flex-1 flex items-center justify-center p-4 pt-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/30 rounded-full blur-3xl"></div>

              <div className="text-center mb-10 relative z-10">
                <div className="bg-zinc-100 dark:bg-white p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Link2 className="h-10 w-10 text-zinc-950" />
                </div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">Bem-vindo de volta</h1>
                <p className="text-muted-foreground text-lg">Acesse sua conta para gerenciar seus links</p>
              </div>

              {magicLinkSent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 relative z-10 py-4"
                >
                  <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Quase lá!</h3>
                    <p className="text-muted-foreground">
                      Enviamos um link mágico para <strong>{email}</strong>. 
                      Clique no link para acessar sua conta.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setMagicLinkSent(false)}
                    className="w-full"
                  >
                    Tentar outro e-mail
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Seu E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 text-lg mt-4 shadow-primary/25"
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando Link Mágico...</>
                    ) : (
                      'Entrar com Link Mágico'
                    )}
                  </Button>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background/80 backdrop-blur px-2 text-muted-foreground">
                        Ou continue com
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-14 text-lg bg-background/50 hover:bg-background/80"
                  >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Google
                  </Button>

                  <p className="text-xs text-center text-muted-foreground/70 mt-3 px-2">
                    💡 Se você já tem conta com Link Mágico e usar o mesmo e-mail no Google, suas contas serão unificadas automaticamente.
                  </p>
                </form>
              )}

              <div className="mt-8 text-center relative z-10">
                <p className="text-muted-foreground">
                  Não tem uma conta?{' '}
                  <Link to="/signup" className="text-primary hover:text-primary/80 font-bold hover:underline transition-all">
                    Cadastre-se grátis
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

