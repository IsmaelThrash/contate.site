
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link2, Sparkles, Zap, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import pb from '@/lib/pocketbaseClient.js';

const HomePage = () => {
  const navigate = useNavigate();
  const [slugCheck, setSlugCheck] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    if (!slugCheck) {
      setIsAvailable(null);
      return;
    }

    const checkSlug = async () => {
      setIsChecking(true);
      try {
        const result = await pb.collection('usuarios').getList(1, 1, {
          filter: `slug="${slugCheck}"`,
          $autoCancel: false
        });
        setIsAvailable(result.items.length === 0);
      } catch (error) {
        console.error('Error checking slug:', error);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkSlug, 500);
    return () => clearTimeout(timeoutId);
  }, [slugCheck]);

  return (
    <>
      <Helmet>
        <title>contate.site - Sua Página de Links Profissional</title>
        <meta name="description" content="Centralize todos seus links em um único lugar com o contate.site. Crie sua página personalizada e compartilhe facilmente." />
      </Helmet>

      <div className="min-h-screen mesh-bg">
        <Header />
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
          {/* Parallax Background */}
          <div 
            className="absolute inset-0 z-0 opacity-40 dark:opacity-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1689028294160-e78a88abcb19)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/30"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-10"
              >
                <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-8 animate-slide-up">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    A Nova Geração de Links na Bio
                  </span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-heading font-bold mb-8 text-foreground leading-[1.1] tracking-tight">
                  Sua Identidade Digital em <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Um Só Lugar</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                  Centralize todos seus links, redes sociais e contatos com o <span className="font-bold text-foreground">contate.site</span>. Crie uma página premium em segundos.
                </p>
              </motion.div>

              {/* Slug Checker Section - Glassmorphism */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-3xl mx-auto glass-card p-8 md:p-10 rounded-3xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-8 text-foreground relative z-10">
                  Garanta seu link exclusivo agora
                </h3>
                
                <div className="flex flex-col md:flex-row gap-4 relative z-10">
                  <div className="relative flex-1">
                    <div className="flex items-center bg-background/80 backdrop-blur-md border-2 border-white/20 dark:border-white/10 rounded-2xl h-16 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all overflow-hidden shadow-inner">
                      <span className="pl-6 pr-2 text-muted-foreground font-semibold text-lg whitespace-nowrap">contate.site/</span>
                      <input
                        type="text"
                        placeholder="seu-nome"
                        value={slugCheck}
                        onChange={(e) => setSlugCheck(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="flex-1 bg-transparent border-none focus:outline-none text-foreground font-bold text-lg min-w-0 px-1 h-full"
                      />
                      <div className="pr-6 flex items-center justify-center w-14">
                        {isChecking && <Loader2 className="h-6 w-6 text-primary animate-spin" />}
                        {!isChecking && isAvailable === true && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                        {!isChecking && isAvailable === false && <XCircle className="h-6 w-6 text-destructive" />}
                      </div>
                    </div>
                  </div>
                  <Button
                    disabled={!slugCheck || isChecking || isAvailable === false}
                    onClick={() => navigate(`/signup?slug=${slugCheck}`)}
                    className="h-16 px-8 text-lg rounded-2xl shadow-primary/25 group/btn"
                  >
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
                
                <div className="mt-6 text-sm md:text-base font-medium h-6 flex items-center justify-center md:justify-start relative z-10">
                  {isChecking && <span className="text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Verificando disponibilidade...</span>}
                  {!isChecking && isAvailable === true && <span className="text-green-500 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Perfeito! Este link está disponível.</span>}
                  {!isChecking && isAvailable === false && <span className="text-destructive flex items-center gap-2"><XCircle className="h-5 w-5"/> Ops! Este link já está em uso.</span>}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Tudo que você precisa</h2>
              <p className="text-xl text-muted-foreground">Simples, rápido e com design premium.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="bg-gradient-to-br from-primary to-secondary p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Link2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-3">Links Ilimitados</h3>
                <p className="text-muted-foreground text-lg">Adicione quantos links quiser sem restrições ou custos ocultos.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="bg-gradient-to-br from-secondary to-accent p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-3">Design Premium</h3>
                <p className="text-muted-foreground text-lg">Personalize as cores e tenha uma página com visual profissional.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="bg-gradient-to-br from-accent to-primary p-5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-3">Rápido e Fácil</h3>
                <p className="text-muted-foreground text-lg">Configure sua página em menos de 2 minutos e comece a compartilhar.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
