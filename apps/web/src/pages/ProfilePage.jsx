
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, Loader2, Instagram, Youtube, Twitter, Linkedin, Facebook, Github, MessageCircle, Music, Twitch } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient.js';
import VideoEmbed from '@/components/VideoEmbed.jsx';
import DOMPurify from 'dompurify';
import { logger } from '@/lib/logger.js';
import { isVip, renderVip } from '@/vips/registry.jsx';
import { sanitizeColor, getSafeUrl, getAvatarUrl } from '@/lib/utils.js';
import { getThemePreset } from '@/lib/themePresets.js';
import { GoogleAdSlot } from '@/components/common/GoogleAdSlot.jsx';

// Sanitiza para texto puro — sem HTML, sem XSS
const safe = (str) => DOMPurify.sanitize(str || '', { ALLOWED_TAGS: [] });

const ProfilePage = () => {
  const { slug } = useParams();
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isVip(slug)) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [slug]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: userRecord, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('slug', slug)
        .single();

      if (userError) throw userError;
      setUser(userRecord);

      if (userRecord.status === 1) {
        const { data: linksRecords, error: linksError } = await supabase
          .from('blocos_links')
          .select('*')
          .eq('usuario_id', userRecord.id)
          .eq('ativo', true)
          .order('ordem', { ascending: true });
          
        if (linksError) throw linksError;
        setLinks(linksRecords || []);
      }
    } catch (err) {
      logger.error('Error fetching profile:', err);
      setError('Perfil não encontrado');
    } finally {
      setLoading(false);
    }
  };

  if (isVip(slug)) {
    return renderVip(slug);
  }

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
          className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500"
          style={{ 
            backgroundColor: sanitizeColor(user.cor_fundo, '#0B0D13'),
            backgroundImage: `radial-gradient(at 10% 10%, ${getThemePreset(user.cor_fundo).glowColor} 0px, transparent 55%), radial-gradient(at 90% 90%, ${getThemePreset(user.cor_fundo).secondaryGlow} 0px, transparent 55%)`
          }}
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

  // Helper for Social Icons
  const getSocialIcon = (url) => {
    if (!url) return <ExternalLink className="h-6 w-6" />;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('instagram.com')) return <Instagram className="h-6 w-6" />;
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return <Youtube className="h-6 w-6" />;
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return <Twitter className="h-6 w-6" />;
    if (lowerUrl.includes('linkedin.com')) return <Linkedin className="h-6 w-6" />;
    if (lowerUrl.includes('facebook.com')) return <Facebook className="h-6 w-6" />;
    if (lowerUrl.includes('github.com')) return <Github className="h-6 w-6" />;
    if (lowerUrl.includes('whatsapp.com') || lowerUrl.includes('wa.me')) return <MessageCircle className="h-6 w-6" />;
    if (lowerUrl.includes('tiktok.com')) return <Music className="h-6 w-6" />;
    if (lowerUrl.includes('twitch.tv')) return <Twitch className="h-6 w-6" />;
    return <ExternalLink className="h-6 w-6" />;
  };

  // User is active - show profile with links
  
  // JSON-LD Generation
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": user.nome_exibicao || user.slug,
      "description": user.bio || `Perfil de ${user.slug} no contate.site`,
      "url": `${window.location.origin}/${user.slug}`,
      "image": getAvatarUrl(user) || undefined,
      "sameAs": links.map(l => l.url)
    }
  };
  const activeTheme = getThemePreset(user.cor_fundo);
  const avatarUrl = getAvatarUrl(user);

  return (
    <>
      <Helmet>
        <title>{safe(user.meta_titulo) || `@${safe(user.slug)} - contate.site`}</title>
        <meta name="description" content={safe(user.meta_descricao) || `Confira todos os links de ${safe(user.slug)} em um só lugar`} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')}
        </script>
      </Helmet>

      <div
        className={`min-h-screen py-20 px-4 relative overflow-hidden transition-colors duration-500 ${activeTheme.isLight ? 'light text-slate-900' : 'dark text-white'}`}
        style={{ 
          backgroundColor: sanitizeColor(user.cor_fundo, activeTheme.value),
          backgroundImage: `radial-gradient(at 15% 15%, ${activeTheme.glowColor} 0px, transparent 55%), radial-gradient(at 85% 85%, ${activeTheme.secondaryGlow} 0px, transparent 55%)`
        }}
      >

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 relative"
          >
            {/* Glossy Avatar Container com Glow Temático */}
            <div className="relative inline-block">
              <div 
                className="absolute inset-0 blur-3xl rounded-full transition-all duration-500"
                style={{ backgroundColor: activeTheme.glowColor }}
              />
              <div className="bg-white/10 dark:bg-black/30 backdrop-blur-xl p-3 rounded-full w-36 h-36 mx-auto mb-8 shadow-2xl border border-white/20 relative z-10">
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center shadow-inner overflow-hidden border border-white/15"
                  style={{
                    background: `linear-gradient(135deg, ${activeTheme.border} 0%, #0F172A 100%)`
                  }}
                >
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={user.nome_exibicao || user.slug} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-heading font-black text-white drop-shadow-md">
                      {(user.nome_exibicao || user.slug).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <h1 
              className="text-5xl md:text-6xl font-heading font-black mb-4 tracking-tight drop-shadow-sm"
              style={{ color: activeTheme.textColor || (activeTheme.isLight ? '#0F172A' : '#FFFFFF') }}
            >
              {safe(user.nome_exibicao) || `@${safe(user.slug)}`}
            </h1>
            <p 
              className="text-xl font-medium max-w-lg mx-auto leading-relaxed"
              style={{ color: activeTheme.bioColor || (activeTheme.isLight ? '#475569' : 'rgba(255, 255, 255, 0.80)') }}
            >
              {safe(user.bio) || "Explore meu ecossistema de links e redes sociais."}
            </p>
          </motion.div>

          {links.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center py-16"
            >
              <div className={`backdrop-blur-2xl rounded-[2rem] shadow-2xl border p-12 ${activeTheme.isLight ? 'bg-white/80 border-slate-200 text-slate-700' : 'bg-white/10 dark:bg-black/20 border-white/10 text-white/70'}`}>
                <p className="text-xl font-semibold">
                  Nenhum link disponível no momento
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map((link, index) => {
                const isVideo = link.tipo === 'video' || link.tipo === 'video_compacto';
                
                // Formato e largura do card:
                // - Destaque ou Vídeo padrão: SEMPRE largura total (2 colunas)
                // - Compacto ou Vídeo compacto: Meia coluna (1 coluna)
                // - Padrão / Auto: Segue a dinâmica inteligente do Bento Grid (índice 0 de cada trio é expandido)
                let isWide = false;
                if (link.tipo === 'destaque' || link.tipo === 'link_destaque' || link.tipo === 'video') {
                  isWide = true;
                } else if (link.tipo === 'compacto' || link.tipo === 'link_compacto' || link.tipo === 'video_compacto') {
                  isWide = false;
                } else {
                  isWide = index % 3 === 0;
                }
                
                if (isVideo) {
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
                      className={`block w-full ${isWide ? 'md:col-span-2' : ''}`}
                    >
                      <VideoEmbed url={link.url} title={link.titulo} />
                    </motion.div>
                  );
                }

                return (
                  <motion.a
                    key={link.id}
                    href={getSafeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                    className={`block group ${isWide ? 'md:col-span-2' : ''}`}
                  >
                    <div 
                      className={`h-full flex items-center justify-between py-8 px-10 backdrop-blur-xl rounded-[1.5rem] shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group ${
                        activeTheme.isLight 
                          ? 'bg-white/80 border border-slate-200/80 hover:bg-white hover:shadow-2xl hover:border-blue-400/50' 
                          : 'bg-white/10 dark:bg-black/35 border border-white/15 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/15'
                      }`}
                      style={{
                        borderColor: activeTheme.isLight ? undefined : `${activeTheme.border}30`
                      }}
                    >
                      {/* Ambient Hover Splash com o tom do tema */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at center, ${activeTheme.glowColor} 0%, transparent 70%)`
                        }}
                      />

                      <div className="flex flex-col relative z-10">
                        <span 
                          className="text-2xl font-bold tracking-tight transition-colors drop-shadow-sm"
                          style={{ color: activeTheme.textColor || (activeTheme.isLight ? '#0F172A' : '#FFFFFF') }}
                        >
                          {link.titulo}
                        </span>
                        <span 
                          className="text-sm font-medium truncate max-w-[200px] mt-1"
                          style={{ color: activeTheme.bioColor || (activeTheme.isLight ? '#64748B' : 'rgba(255, 255, 255, 0.65)') }}
                        >
                          {link.url ? link.url.replace(/^https?:\/\/(www\.)?/, '') : ''}
                        </span>
                      </div>

                      <div 
                        className={`p-3 rounded-xl transition-all duration-300 relative z-10 shadow-lg ${activeTheme.isLight ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : ''}`}
                        style={activeTheme.isLight ? undefined : {
                          backgroundColor: `${activeTheme.border}25`,
                          color: activeTheme.accent
                        }}
                      >
                        {getSocialIcon(link.url)}
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}

          {/* Espaço Google Ads (Exibido para contas gratuitas - Monetização Freemium) */}
          {user.plano !== 'pro' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GoogleAdSlot variant="profile" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-12"
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
