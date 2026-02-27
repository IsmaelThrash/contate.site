
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast';
import { Link2, Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta.'
      });
      navigate('/dashboard');
    } else {
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
        <meta name="description" content="Faça login na sua conta do contate.site e gerencie seus links." />
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
              {/* Decorative gradient blob */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/30 rounded-full blur-3xl"></div>

              <div className="text-center mb-10 relative z-10">
                <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Link2 className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">Bem-vindo de volta</h1>
                <p className="text-muted-foreground text-lg">Acesse sua conta para gerenciar seus links</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
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
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg mt-4 shadow-primary/25"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Entrando...</>
                  ) : (
                    'Entrar na Conta'
                  )}
                </Button>
              </form>

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
