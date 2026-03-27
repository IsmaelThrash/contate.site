
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast';
import { Link2, Mail, Lock, AtSign, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { isReservedSlug } from '@/lib/constants.js';

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [slug, setSlug] = useState(searchParams.get('slug') || '');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic Validations
    if (!validateEmail(email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, insira um endereço de email válido.',
        variant: 'destructive'
      });
      return;
    }

    if (isReservedSlug(slug)) {
      toast({
        title: 'Link reservado',
        description: 'Este link não pode ser utilizado por motivos de segurança do sistema.',
        variant: 'destructive'
      });
      return;
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      toast({
        title: 'Slug inválido',
        description: 'O link deve conter apenas letras minúsculas, números e hífens.',
        variant: 'destructive'
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Senha muito curta',
        description: 'A senha deve ter pelo menos 8 caracteres.',
        variant: 'destructive'
      });
      return;
    }

    if (password !== passwordConfirm) {
      toast({
        title: 'Senhas não coincidem',
        description: 'A senha e a confirmação de senha devem ser iguais.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // 2. Check if slug already exists
      const existingSlug = await pb.collection('usuarios').getList(1, 1, {
        filter: `slug="${slug}"`,
        $autoCancel: false
      });

      if (existingSlug.items.length > 0) {
        toast({
          title: 'Link indisponível',
          description: 'Este link já está em uso. Por favor, escolha outro.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // 3. Proceed with signup
      const result = await signup(email, password, passwordConfirm, slug);

      if (result.success) {
        toast({
          title: 'Cadastro realizado com sucesso!',
          description: 'Sua conta foi criada. Faça login para continuar.'
        });
        navigate('/login');
      } else {
        toast({
          title: 'Erro no cadastro',
          description: result.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error("Signup process error:", error);
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao processar seu cadastro. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);

    if (result.success) {
      if (result.isNew) {
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Bem-vindo ao contate.site. Vamos configurar o seu link exclusivo!'
        });
        navigate('/onboarding');
      } else {
        toast({
          title: 'Login realizado!',
          description: 'Bem-vindo de volta ao contate.site.'
        });
        navigate('/dashboard');
      }
    } else {
      toast({
        title: 'Erro no cadastro',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Cadastrar - contate.site</title>
        <meta name="description" content="Crie sua conta no contate.site e comece a centralizar seus links em uma página personalizada." />
      </Helmet>

      <div className="min-h-screen mesh-bg flex flex-col">
        <Header />

        <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
              {/* Decorative gradient blob */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-secondary/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/30 rounded-full blur-3xl"></div>

              <div className="text-center mb-10 relative z-10">
                <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Link2 className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">Criar Conta</h1>
                <p className="text-muted-foreground text-lg">Comece a usar o contate.site gratuitamente</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="space-y-3">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
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

                <div className="space-y-3">
                  <Label htmlFor="slug" className="flex items-center gap-2">
                    <AtSign className="h-4 w-4 text-primary" />
                    Link Personalizado
                  </Label>
                  <div className="flex items-center bg-background/50 border border-input/50 rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 transition-all overflow-hidden">
                    <span className="pl-4 pr-1 text-muted-foreground font-medium">contate.site/</span>
                    <input
                      id="slug"
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="seu-nome"
                      required
                      className="flex-1 bg-transparent border-none focus:outline-none text-foreground h-12 px-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground ml-1">
                    Apenas letras minúsculas, números e hífens
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="passwordConfirm" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Confirmar Senha
                  </Label>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Digite a senha novamente"
                    required
                    minLength={8}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg mt-6 shadow-primary/25"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Criando conta...</>
                  ) : (
                    'Criar Minha Conta'
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background/80 backdrop-blur px-2 text-muted-foreground">
                      Ou crie usando
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignup}
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
              </form>

              <div className="mt-8 text-center relative z-10">
                <p className="text-muted-foreground">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-primary hover:text-primary/80 font-bold hover:underline transition-all">
                    Fazer login
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

export default SignupPage;
