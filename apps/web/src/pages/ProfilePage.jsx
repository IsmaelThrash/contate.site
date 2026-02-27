
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient.js';

const ProfilePage = () => {
  const { slug } = useParams();
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [slug]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const userRecord = await pb.collection('usuarios').getFirstListItem(
        `slug="${slug}"`,
        { $autoCancel: false }
      );
      setUser(userRecord);

      if (userRecord.status === 1) {
        const linksRecords = await pb.collection('links').getList(1, 100, {
          filter: `usuario_id="${userRecord.id}"`,
          sort: 'ordem',
          $autoCancel: false
        });
        setLinks(linksRecords.items);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Perfil não encontrado');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md mx-auto glass-card p-10 rounded-3xl">
          <div className="bg-destructive/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <ExternalLink className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-4">Perfil não encontrado</h1>
          <p className="text-muted-foreground mb-8">
            O perfil que você está procurando não existe ou foi removido.
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Voltar para o início
          </Button>
        </div>
      </div>
    );
  }

  // User is awaiting activation
  if (user.status === 0) {
    return (
      <>
        <Helmet>
          <title>{`@${user.slug} - contate.site`}</title>
          <meta name="description" content={`Perfil de ${user.slug} no contate.site`} />
        </Helmet>

        <div
          className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
          style={{ backgroundColor: user.cor_fundo || '#ffffff' }}
        >
          {/* Subtle overlay to ensure contrast */}
          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 backdrop-blur-[2px]"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md mx-auto relative z-10"
          >
            <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12">
              <div className="bg-accent/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Clock className="h-10 w-10 text-accent" />
              </div>
              <h1 className="text-3xl font-heading font-bold mb-4 text-foreground">Aguardando Ativação</h1>
              <p className="text-muted-foreground text-lg">
                Este perfil está em processo de ativação e estará disponível em breve.
              </p>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // User is active - show profile with links
  return (
    <>
      <Helmet>
        <title>{`@${user.slug} - contate.site`}</title>
        <meta name="description" content={`Confira todos os links de ${user.slug} em um só lugar`} />
      </Helmet>

      <div
        className="min-h-screen py-20 px-4 relative overflow-hidden mesh-bg"
      >

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 relative"
          >
            {/* Glossy Avatar Container */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
              <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl p-3 rounded-full w-36 h-36 mx-auto mb-8 shadow-2xl border border-white/20 relative z-10">
                <div className="bg-gradient-to-br from-primary via-accent to-secondary w-full h-full rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-5xl font-heading font-black text-white drop-shadow-md">
                    {user.slug.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-heading font-black mb-4 text-foreground tracking-tight">
              @{user.slug}
            </h1>
            <p className="text-foreground/70 text-xl font-medium max-w-lg mx-auto leading-relaxed">
              Explore meu ecossistema de links e redes sociais.
            </p>
          </motion.div>

          {links.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center py-16"
            >
              <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/10 p-12">
                <p className="text-foreground/50 text-xl font-semibold">
                  Nenhum link disponível no momento
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className={`block group ${index % 3 === 0 ? 'md:col-span-2' : ''}`}
                >
                  <div className="h-full flex items-center justify-between py-8 px-10 bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/20 dark:border-white/5 text-foreground rounded-[1.5rem] shadow-xl hover:shadow-primary/20 hover:scale-[1.02] hover:bg-white/20 dark:hover:bg-white/5 transition-all duration-300 relative overflow-hidden">
                    {/* Subtle hover splash */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                    <div className="flex flex-col relative z-10">
                      <span className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{link.titulo}</span>
                      <span className="text-sm opacity-50 font-medium truncate max-w-[200px] mt-1">{link.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                    </div>

                    <div className="bg-white/10 p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300 relative z-10 shadow-lg">
                      <ExternalLink className="h-6 w-6" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-16"
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full transition-colors"
            >
              Powered by <span className="font-bold">contate.site</span>
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
