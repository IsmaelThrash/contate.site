
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
  const { signup } = useAuth();
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
