import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ChevronRight, LayoutTemplate, Link2, 
  MessageCircle, Smartphone, Zap, Palette, MapPin, 
  BarChart3, Globe, Shield, CreditCard, ShoppingBag,
  Menu, X, Sparkles, ArrowRight, Star, QrCode, Play,
  TrendingUp, Users, Check, ChevronDown, HelpCircle,
  Copy, Layers, Share2, MousePointer, Lock, ZapOff
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <img src="/favicon.svg" alt="contate.site" className="w-6 h-6" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            contate<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">.site</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
          <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
          <a href="#planos" className="hover:text-white transition-colors">Planos</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')} 
            className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors"
          >
            Entrar
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-bold text-white rounded-full group bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-400 group-hover:from-violet-600 group-hover:to-cyan-400 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
          >
            <span className="relative px-6 py-2.5 transition-all ease-in duration-75 bg-slate-950 rounded-full group-hover:bg-opacity-0">
              Criar Minha Página Grátis
            </span>
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-6 flex flex-col gap-4 shadow-2xl"
        >
          <a 
            href="#como-funciona" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 font-medium py-2 border-b border-slate-800"
          >
            Como Funciona
          </a>
          <a 
            href="#recursos" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 font-medium py-2 border-b border-slate-800"
          >
            Recursos
          </a>
          <a 
            href="#planos" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 font-medium py-2 border-b border-slate-800"
          >
            Planos & Preços
          </a>
          <a 
            href="#faq" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 font-medium py-2 border-b border-slate-800"
          >
            Dúvidas Frequentes
          </a>
          <div className="pt-2 flex flex-col gap-3">
            <button 
              onClick={() => navigate('/login')} 
              className="w-full text-center py-3 text-sm font-semibold text-slate-200 bg-slate-800 rounded-xl"
            >
              Fazer Login
            </button>
            <button 
              onClick={() => navigate('/signup')} 
              className="w-full text-center py-3 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg"
            >
              Criar Minha Página Grátis
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [handle, setHandle] = useState('');
  const [activeTab, setActiveTab] = useState('creator');
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Rotação automática de abas do carrossel (demo interativa)
  React.useEffect(() => {
    if (!isAutoRotating) return;
    const tabs = ['creator', 'local', 'infoproduct', 'ecommerce'];
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const nextIndex = (tabs.indexOf(prev) + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoRotating]);

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setIsAutoRotating(false); // Pausa a rotação automática se o usuário clicar manualmente
  };

  // Interactive phone preview mockup states inspired by Biosites
  const profiles = {
    creator: {
      name: 'Rafaela Santos',
      role: 'Criadora de Conteúdo & Tech',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      banner: 'from-violet-600 to-indigo-800',
      links: [
        { label: '🔥 Meu Canal VIP no Telegram', type: 'primary', icon: <MessageCircle size={16} /> },
        { label: '📹 Vídeo Completo: Setup de Produtividade', type: 'video', icon: <Play size={16} /> },
        { label: '📘 Baixar E-book Grátis de Notion', type: 'secondary', icon: <Sparkles size={16} /> },
        { label: '💼 Meu Portfólio de Design', type: 'secondary', icon: <Globe size={16} /> },
      ],
      badge: '⚡ +1.840 cliques essa semana'
    },
    local: {
      name: 'Studio Beleza & Estilo',
      role: 'Salão de Beleza & Estética VIP',
      avatar: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=200&auto=format&fit=crop',
      banner: 'from-rose-500 to-purple-700',
      links: [
        { label: '💬 Agendar Horário no WhatsApp', type: 'whatsapp', icon: <MessageCircle size={16} /> },
        { label: '📍 Ver Localização no Google Maps', type: 'secondary', icon: <MapPin size={16} /> },
        { label: '✨ Tabela de Serviços e Preços', type: 'secondary', icon: <LayoutTemplate size={16} /> },
      ],
      badge: '📅 42 Agendamentos hoje'
    },
    infoproduct: {
      name: 'Lucas Almeida',
      role: 'Mentor de Tráfego & Vendas',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      banner: 'from-amber-500 to-indigo-900',
      links: [
        { label: '🚀 Mentoria Tráfego Pago (Chave Pix)', type: 'pix', icon: <QrCode size={16} /> },
        { label: '⭐ Depoimentos de Alunos (+500k)', type: 'secondary', icon: <Star size={16} /> },
        { label: '👥 Entrar na Lista de Espera', type: 'secondary', icon: <Users size={16} /> },
      ],
      badge: '💰 R$ 14.890 em vendas Pix'
    },
    ecommerce: {
      name: 'Urban Trend Store',
      role: 'Moda Streetwear & Acessórios',
      avatar: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=200&auto=format&fit=crop',
      banner: 'from-emerald-600 to-slate-900',
      links: [
        { label: '🛍️ Camiseta Oversized (R$ 89,90)', type: 'product', icon: <ShoppingBag size={16} /> },
        { label: '👟 Tênis Urban Edition (R$ 299,00)', type: 'product', icon: <ShoppingBag size={16} /> },
        { label: '🏷️ Ver Coleção de Inverno', type: 'secondary', icon: <Sparkles size={16} /> },
      ],
      badge: '📦 89 Pedidos enviados'
    }
  };

  const currentProfile = profiles[activeTab];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-12">
        {/* Left Column: Headline & Reservation Input */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start w-full z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 text-violet-400 rounded-full px-4 py-2 text-xs md:text-sm font-semibold tracking-wide shadow-sm mb-6"
          >
            <Sparkles size={16} className="text-cyan-400 animate-pulse" />
            <span>O link na bio que se transforma em um site completo</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.12] tracking-tight mb-6"
          >
            Tudo o que você cria, vende & compartilha — <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
              em um único link.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-slate-300 font-normal mb-8 max-w-2xl leading-relaxed"
          >
            Substitua a limitação das redes sociais por uma página profissional de alta conversão. Venda produtos, receba via Pix, agende clientes e capture leads sem programar.
          </motion.p>

          {/* Interactive Link Reservation Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-xl bg-slate-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-2xl shadow-violet-950/30"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl flex items-center px-4 py-3.5 focus-within:border-violet-500 transition-colors">
                <span className="text-slate-400 font-bold text-base sm:text-lg select-none">contate.site/</span>
                <input 
                  type="text" 
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="seu-nome" 
                  className="bg-transparent border-none focus:outline-none w-full ml-0.5 text-white font-semibold text-base sm:text-lg placeholder:text-slate-600" 
                />
              </div>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-7 rounded-2xl transition-all shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 flex items-center justify-center gap-2 whitespace-nowrap text-base"
              >
                Garantir Meu Link <ArrowRight size={18} />
              </button>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 size={14} /> {handle ? `contate.site/${handle} está disponível!` : '100% Grátis · Domínio Próprio · Sem Cartão'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive Phone Mockup & Vertical Switcher */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 w-full max-w-md relative z-10"
        >
          {/* Profile Switcher Tabs with Auto-Rotation */}
          <div className="flex justify-center gap-2 mb-4 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80">
            <button 
              onClick={() => handleTabClick('creator')} 
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${activeTab === 'creator' ? 'bg-[#a78bfa] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Criador
            </button>
            <button 
              onClick={() => handleTabClick('local')} 
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${activeTab === 'local' ? 'bg-[#a78bfa] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Serviços
            </button>
            <button 
              onClick={() => handleTabClick('infoproduct')} 
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${activeTab === 'infoproduct' ? 'bg-[#a78bfa] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Mentor
            </button>
            <button 
              onClick={() => handleTabClick('ecommerce')} 
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${activeTab === 'ecommerce' ? 'bg-[#a78bfa] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Loja
            </button>
          </div>

          {/* Phone Shell */}
          <div className="w-full aspect-[9/18] max-h-[580px] bg-slate-950 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl shadow-violet-950/50 relative overflow-hidden flex flex-col mx-auto">
            
            {/* Phone Screen Header */}
            <div className={`h-40 bg-gradient-to-br ${currentProfile.banner} w-full relative p-4 flex flex-col justify-end transition-colors duration-500`}>
              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 w-20 h-20 bg-slate-950 rounded-full p-1 shadow-lg">
                <img 
                  src={currentProfile.avatar} 
                  className="w-full h-full rounded-full object-cover" 
                  alt={currentProfile.name} 
                />
              </div>
            </div>

            {/* Phone Content */}
            <div className="pt-11 px-5 pb-6 flex-1 bg-slate-950 flex flex-col gap-3 text-center overflow-y-auto">
              <h3 className="font-extrabold text-base text-white">{currentProfile.name}</h3>
              <p className="text-xs text-slate-400 -mt-2">{currentProfile.role}</p>

              {/* Dynamic Links */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-2.5 mt-2"
                >
                  {currentProfile.links.map((link, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm border transition-all cursor-pointer ${
                        link.type === 'primary' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-500/50 hover:opacity-95' :
                        link.type === 'whatsapp' ? 'bg-emerald-600 text-white border-emerald-500/50' :
                        link.type === 'pix' ? 'bg-cyan-600 text-white border-cyan-500/50' :
                        link.type === 'product' ? 'bg-slate-900 text-slate-100 border-slate-800 hover:border-violet-500' :
                        'bg-slate-900 text-slate-200 border-slate-800/80 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {link.icon}
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight size={14} className="opacity-60" />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Footer inside mockup */}
              <div className="mt-auto pt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                <span>contate.site/</span>
                <span className="font-bold text-slate-400">{activeTab}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SocialChannels = () => {
  const channels = [
    { name: 'Instagram', color: 'hover:text-pink-400' },
    { name: 'WhatsApp', color: 'hover:text-emerald-400' },
    { name: 'TikTok', color: 'hover:text-cyan-400' },
    { name: 'YouTube', color: 'hover:text-red-400' },
    { name: 'Spotify', color: 'hover:text-green-400' },
    { name: 'Threads', color: 'hover:text-slate-200' },
    { name: 'LinkedIn', color: 'hover:text-blue-400' },
    { name: 'Pinterest', color: 'hover:text-red-500' },
  ];

  return (
    <section className="py-10 border-y border-slate-800/80 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6">
          Conectado com todas as suas redes e canais de venda
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-400 text-sm font-semibold">
          {channels.map((item, idx) => (
            <div key={idx} className={`flex items-center gap-2 transition-colors cursor-default ${item.color}`}>
              <Share2 size={16} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pillars = () => {
  const pillars = [
    {
      icon: <Share2 className="text-violet-400" size={26} />,
      title: 'Compartilhe',
      desc: 'Um único link inteligente na bio do Instagram, TikTok e redes para guiar todo o seu público.'
    },
    {
      icon: <ShoppingBag className="text-cyan-400" size={26} />,
      title: 'Venda',
      desc: 'Exiba produtos digitais, serviços, catálogos e receba pagamentos via Pix ou WhatsApp sem intermediários.'
    },
    {
      icon: <Users className="text-indigo-400" size={26} />,
      title: 'Capture',
      desc: 'Formulários diretos de captação de leads e contatos com aviso instantâneo no seu WhatsApp.'
    },
    {
      icon: <BarChart3 className="text-emerald-400" size={26} />,
      title: 'Analise',
      desc: 'Acompanhe visitantes em tempo real, origem dos acessos (UTM), taxa de cliques e conversões.'
    }
  ];

  return (
    <section id="como-funciona" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Tudo o que seu negócio precisa para crescer
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Esqueça páginas genéricas de links sem personalidade. O contate.site foi construído para converter visitantes em clientes.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => (
          <div 
            key={idx} 
            className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl hover:border-violet-500/50 hover:bg-slate-900 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              {pillar.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{pillar.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{pillar.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const DeepDives = () => {
  return (
    <section id="recursos" className="py-20 space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Showcase 1: Multi-pages & Drag & Drop */}
      <div className="grid lg:grid-cols-2 items-center gap-12 bg-slate-900/40 p-8 sm:p-12 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Páginas & Blocos Flexíveis</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            Seu mundo inteiro atrás de um único link
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-6">
            Não fique preso a uma lista estática de botões. Monte uma página completa com abas, galeria de mídia, FAQ, botão de Pix e catálogos interativos.
          </p>
          <ul className="space-y-3 text-sm text-slate-300 mb-8">
            <li className="flex items-center gap-2.5"><CheckCircle2 size={18} className="text-violet-400" /> Mais de 27 blocos prontos para adicionar com 1 clique</li>
            <li className="flex items-center gap-2.5"><CheckCircle2 size={18} className="text-violet-400" /> Edição simples direto do próprio celular</li>
            <li className="flex items-center gap-2.5"><CheckCircle2 size={18} className="text-violet-400" /> Suporte a domínio personalizado (seunome.com.br)</li>
          </ul>
        </div>

        {/* Visual Mockup */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
            <span className="font-semibold text-white">Construtor de Blocos</span>
            <span className="text-emerald-400 font-mono">Status: Publicado</span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutTemplate size={18} className="text-violet-400"/>
              <span className="text-sm font-semibold text-white">Bloco Hero (Perfil & Bio)</span>
            </div>
            <span className="text-xs text-slate-500">Arrastar</span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} className="text-cyan-400"/>
              <span className="text-sm font-semibold text-white">Vitrine de Produtos Pix</span>
            </div>
            <span className="text-xs text-slate-500">Arrastar</span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle size={18} className="text-emerald-400"/>
              <span className="text-sm font-semibold text-white">Botão WhatsApp Direto</span>
            </div>
            <span className="text-xs text-slate-500">Arrastar</span>
          </div>
        </div>
      </div>

      {/* Showcase 2: Conversion & Pix */}
      <div className="grid lg:grid-cols-2 items-center gap-12 bg-slate-900/40 p-8 sm:p-12 rounded-3xl border border-slate-800">
        <div className="lg:order-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Monetização Nativa</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            Transforme seguidores em faturamento real
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-6">
            Sem redirecionamentos confusos. Exiba seus produtos e serviços com foto, preço e botão de checkout direto para Pix ou WhatsApp.
          </p>
          <ul className="space-y-3 text-sm text-slate-300 mb-8">
            <li className="flex items-center gap-2.5"><CheckCircle2 size={18} className="text-cyan-400" /> Vitrine de produtos com status de estoque</li>
            <li className="flex items-center gap-2.5"><CheckCircle2 size={18} className="text-cyan-400" /> Pagamento Pix copia-e-cola imediato</li>
            <li className="flex items-center gap-2.5"><CheckCircle2 size={18} className="text-cyan-400" /> Formulário de captura de leads direto no painel</li>
          </ul>
        </div>

        {/* Visual Product Grid */}
        <div className="grid grid-cols-2 gap-4 lg:order-1">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="aspect-video bg-gradient-to-br from-violet-600/30 to-indigo-600/30 rounded-xl mb-3 flex items-center justify-center">
              <Sparkles className="text-violet-400" size={24} />
            </div>
            <h4 className="font-bold text-sm text-white">E-book Presets 2026</h4>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs font-bold text-cyan-400">R$ 47,00</span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded-md">Em estoque</span>
            </div>
            <button className="w-full mt-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-2 rounded-lg transition-colors">
              Comprar no Pix
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="aspect-video bg-gradient-to-br from-cyan-600/30 to-indigo-600/30 rounded-xl mb-3 flex items-center justify-center">
              <Users className="text-cyan-400" size={24} />
            </div>
            <h4 className="font-bold text-sm text-white">Mentoria 1:1 (1 hora)</h4>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs font-bold text-cyan-400">R$ 197,00</span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded-md">3 Vagas</span>
            </div>
            <button className="w-full mt-3 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2 rounded-lg transition-colors">
              Agendar Horário
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};

const BlocksGrid = () => {
  const blocks = [
    { title: 'Perfil & Bio', icon: <Users size={18} /> },
    { title: 'Links Personalizados', icon: <Link2 size={18} /> },
    { title: 'Vitrine de Produtos', icon: <ShoppingBag size={18} /> },
    { title: 'Chave Pix Copia e Cola', icon: <QrCode size={18} /> },
    { title: 'Vídeo YouTube / Reels', icon: <Play size={18} /> },
    { title: 'Músicas / Spotify Player', icon: <Sparkles size={18} /> },
    { title: 'Captura de Leads', icon: <MessageCircle size={18} /> },
    { title: 'FAQ Sanfonado', icon: <HelpCircle size={18} /> },
    { title: 'Depoimentos (Avaliação)', icon: <Star size={18} /> },
    { title: 'Google Maps Local', icon: <MapPin size={18} /> },
    { title: 'Redes Sociais Ícones', icon: <Globe size={18} /> },
    { title: 'Carrossel de Imagens', icon: <Palette size={18} /> },
  ];

  return (
    <section className="py-20 bg-slate-900/30 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          27+ Blocos para Personalizar Sua Página
        </h2>
        <p className="text-slate-400 text-base max-w-xl mx-auto mb-12">
          Misture e combine qualquer tipo de conteúdo. Monte a landing page perfeita para seu negócio sem precisar de código.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {blocks.map((block, idx) => (
            <div 
              key={idx} 
              className="bg-slate-950/80 border border-slate-800 hover:border-violet-500/50 p-4 rounded-2xl flex items-center gap-3 text-slate-300 hover:text-white transition-all cursor-default"
            >
              <div className="w-8 h-8 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center shrink-0">
                {block.icon}
              </div>
              <span className="text-xs sm:text-sm font-semibold truncate text-left">{block.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
          Planos Simples e Transparentes
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Comece 100% grátis e evolua seu negócio à medida que suas vendas crescem.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        
        {/* Basic Plan */}
        <div className="bg-slate-900/80 rounded-3xl p-8 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Grátis</h3>
            <div className="text-4xl font-extrabold text-white mb-2">R$ 0<span className="text-sm text-slate-400 font-normal"> /mês</span></div>
            <p className="text-slate-400 text-xs mb-6">Para quem está começando agora nas redes.</p>
            
            <ul className="space-y-3.5 text-sm text-slate-300 mb-8">
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-violet-400" /> <span>Links ilimitados</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-violet-400" /> <span>Temas padrão</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-violet-400" /> <span>QR Code para a bio</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-violet-400" /> <span>Estatísticas básicas</span></li>
            </ul>
          </div>
          <button 
            onClick={() => navigate('/signup')} 
            className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
          >
            Criar Grátis
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-b from-violet-950 via-slate-900 to-slate-950 rounded-3xl p-8 border-2 border-violet-500 relative flex flex-col justify-between shadow-2xl shadow-violet-950/60 transform md:-translate-y-3">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
            Mais Popular
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <div className="text-4xl font-extrabold text-white mb-2">R$ 19<span className="text-sm text-violet-300 font-normal"> /mês</span></div>
            <p className="text-violet-200 text-xs mb-6">Ideal para criadores, infoprodutores e serviços.</p>
            
            <ul className="space-y-3.5 text-sm text-slate-200 mb-8">
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-cyan-400" /> <span className="font-semibold">Tudo do plano Grátis</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-cyan-400" /> <span>Suporte a Domínio Próprio (`seunome.com.br`)</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-cyan-400" /> <span>Mídia (YouTube, Spotify, TikTok)</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-cyan-400" /> <span>Analytics Completo com Origem de Tráfego</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-cyan-400" /> <span>Remoção da marca d'água</span></li>
            </ul>
          </div>
          <button 
            onClick={() => navigate('/signup')} 
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-violet-600/30"
          >
            Começar Teste Grátis de 7 Dias
          </button>
        </div>

        {/* Business Plan */}
        <div className="bg-slate-900/80 rounded-3xl p-8 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Business</h3>
            <div className="text-4xl font-extrabold text-white mb-2">R$ 49<span className="text-sm text-slate-400 font-normal"> /mês</span></div>
            <p className="text-slate-400 text-xs mb-6">Para marcas, e-commerce e vendas aceleradas.</p>
            
            <ul className="space-y-3.5 text-sm text-slate-300 mb-8">
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-indigo-400" /> <span>Tudo do plano Pro</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-indigo-400" /> <span>Vitrine E-commerce & Checkout Pix</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-indigo-400" /> <span>Captura Ilimitada de Leads</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-indigo-400" /> <span>Pixel Meta/Google para tráfego pago</span></li>
            </ul>
          </div>
          <button 
            onClick={() => navigate('/signup')} 
            className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
          >
            Assinar Business
          </button>
        </div>

      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'O que é o contate.site e por que preciso dele?',
      a: 'O contate.site permite agrupar todos os seus links, conteúdos, produtos e contatos de redes sociais (como Instagram, TikTok e WhatsApp) em uma única landing page profissional e de alta conversão.'
    },
    {
      q: 'Preciso saber programar para criar minha página?',
      a: 'Não! O contate.site foi feito para que qualquer pessoa consiga montar e personalizar sua página em menos de 5 minutos, direto pelo celular ou computador.'
    },
    {
      q: 'Posso usar meu próprio domínio (ex: www.meunome.com.br)?',
      a: 'Sim! Nos planos Pro e Business você pode conectar seu próprio domínio com certificado SSL gratuito ativado automaticamente.'
    },
    {
      q: 'Como funciona o recebimento via Pix e WhatsApp?',
      a: 'Você pode adicionar chaves Pix copia e cola e botões diretos de pedido no WhatsApp para vender produtos digitais, serviços e consultorias sem pagar comissões abusivas.'
    },
    {
      q: 'O plano grátis é realmente grátis para sempre?',
      a: 'Sim, o plano grátis não expira e não exige cartão de crédito. Você pode usar os recursos essenciais por tempo ilimitado.'
    }
  ];

  return (
    <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-white mb-4">Dúvidas Frequentes</h2>
        <p className="text-slate-400 text-base">Tudo o que você precisa saber antes de criar seu perfil.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
          >
            <button 
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between text-white font-semibold text-sm sm:text-base focus:outline-none"
            >
              <span>{faq.q}</span>
              <ChevronDown 
                size={20} 
                className={`text-slate-400 transition-transform duration-200 ${openIdx === idx ? 'rotate-180 text-violet-400' : ''}`} 
              />
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-5 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-14 border border-violet-500/30 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 relative z-10">
          Pronto para elevar seu link na bio?
        </h2>
        <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8 relative z-10">
          Crie sua página profissional agora mesmo em menos de 2 minutos. Sem cartão de crédito.
        </p>

        <button 
          onClick={() => navigate('/signup')}
          className="bg-white text-slate-950 hover:bg-slate-100 font-extrabold py-4 px-10 rounded-2xl shadow-xl transition-all hover:scale-105 relative z-10 text-base"
        >
          Criar Minha Página Agora
        </button>
      </div>
    </section>
  );
};

const Footer = () => {
  const commitHash = typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'latest';

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="contate.site" className="w-6 h-6" />
          <span className="font-extrabold text-xl text-white">contate.site</span>
        </div>

        <div className="flex gap-6 font-medium text-xs sm:text-sm">
          <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Suporte</a>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-500 text-center md:text-right">
          <span>&copy; {new Date().getFullYear()} contate.site — Todos os direitos reservados.</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 shadow-sm" title="Versão atual em produção">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            v2.0 ({commitHash})
          </span>
        </div>
      </div>
    </footer>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-500/30 overflow-x-hidden">
      <Helmet>
        <title>contate.site | Muito mais que um simples link na bio</title>
        <meta 
          name="description" 
          content="Transforme seu perfil nas redes sociais com o contate.site. Centralize links, venda produtos, receba via Pix e agende clientes em minutos." 
        />
      </Helmet>
      
      <Navbar />
      
      <main>
        <Hero />
        <SocialChannels />
        <Pillars />
        <DeepDives />
        <BlocksGrid />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
