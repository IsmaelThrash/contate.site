
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast';
import { AtSign, Loader2, Link2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient.js';
import { isReservedSlug } from '@/lib/constants.js';

const OnboardingPage = () => {
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slug) {
      toast({
        title: 'Link obrigatório',
        description: 'Por favor, escolha um link profissional.',
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

    setLoading(true);

    try {
      // Check if slug already exists and belongs to someone else
      const existingSlug = await pb.collection('usuarios').getList(1, 1, {
        filter: `slug="${slug}" && id!="${currentUser.id}"`,
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

      const result = await updateProfile({ slug });

      if (result.success) {
        toast({
          title: 'Link garantido!',
          description: 'Bem-vindo ao contate.site. Seu link está pronto.'
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Erro ao salvar',
          description: result.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao definir o seu link. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Bem-vindo - contate.site</title>
      </Helmet>

      <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-full max-w-lg"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden text-center shadow-2xl">
            {/* Decorative gradient blob */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 mb-8">
              <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Link2 className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 tracking-tight">Crie sua Identidade</h1>
              <p className="text-muted-foreground text-lg">
                Sua conta foi criada com sucesso pelo Google! 🎉 <br/> 
                Agora, escolha qual será o link profissional da sua página:
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-4 text-left">
                <Label htmlFor="slug" className="flex items-center gap-2 text-base ml-1">
                  <AtSign className="h-4 w-4 text-primary" />
                  Seu Link Exclusivo
                </Label>
                
                <div className="flex items-center bg-background/60 backdrop-blur-sm border-2 border-primary/20 rounded-xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all overflow-hidden p-1">
                  <span className="pl-4 pr-1 text-muted-foreground font-medium select-none flex-shrink-0">contate.site/</span>
                  <input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="seu-nome"
                    required
                    autoFocus
                    className="flex-1 bg-transparent border-none focus:outline-none text-foreground font-medium h-14 px-1 min-w-0"
                  />
                </div>
                <p className="text-sm text-primary/80 ml-1 font-medium">
                  Seja criativo! Este será o endereço que você compartilhará com o mundo.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !slug}
                className="w-full h-14 text-lg mt-8 shadow-primary/25 rounded-xl group"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Salvando...</>
                ) : (
                  <>Reivindicar meu link <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default OnboardingPage;
