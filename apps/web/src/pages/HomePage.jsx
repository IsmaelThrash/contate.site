import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, ChevronRight, LayoutTemplate, Link2, 
  MessageCircle, Smartphone, Zap, Palette, MapPin, 
  BarChart3, Globe, Shield, CreditCard, ShoppingBag,
  Menu, X, Sparkles, ArrowRight
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 bg-transparent z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Link2 className="text-white" size={24} />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">contate.site</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 font-bold text-slate-800 hover:text-purple-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Início
          </button>
          <button onClick={() => navigate('/login')} className="font-bold text-slate-800 hover:text-purple-600 transition-colors">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25">
            Cadastrar
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-white border-b border-slate-100 px-4 py-6 flex flex-col gap-4 shadow-xl">
          <button onClick={() => navigate('/login')} className="w-full text-center py-4 text-lg font-bold text-slate-800 bg-slate-50 rounded-xl">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="w-full text-center py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl shadow-md">
            Cadastrar
          </button>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8 overflow-hidden">
      {/* Background mesh gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-50 via-white to-cyan-50 opacity-80"></div>
      
      <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start w-full relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-100 text-purple-600 rounded-full px-5 py-2 text-sm font-bold tracking-wide shadow-sm mb-8"
        >
          <Sparkles size={16} />
          <span>A Nova Geração de Links na Bio</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 leading-[1.1] tracking-tight mb-6"
        >
          Sua Identidade Digital <br className="hidden md:block"/>
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-transparent bg-clip-text">em Um Só Lugar</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 font-medium mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
        >
          Centralize todos seus links, redes sociais e contatos com o <span className="font-bold text-slate-800">contate.site</span>. Crie uma página premium em segundos.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-xl mx-auto lg:mx-0 bg-slate-100/60 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-lg"
        >
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center mb-6">Garanta seu link exclusivo agora</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex items-center px-4 py-3 shadow-inner">
              <span className="text-slate-800 font-extrabold text-lg">contate.site/</span>
              <input 
                type="text" 
                placeholder="seu-nome" 
                className="bg-transparent border-none focus:outline-none w-full ml-1 text-slate-500 font-medium text-lg placeholder:text-slate-400" 
              />
            </div>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-400 to-cyan-400 text-white font-bold py-4 px-8 rounded-2xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Começar Agora <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Hero Visual - Phone Mockup */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="flex-1 w-full max-w-md relative mt-16 lg:mt-0 z-10"
      >
        <div className="w-full aspect-[1/2] max-h-[600px] bg-slate-900 rounded-[3rem] border-[10px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col mx-auto">
          {/* Mockup Header */}
          <div className="bg-slate-50 h-full w-full flex flex-col">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 w-full relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" className="w-full h-full rounded-full object-cover" alt="Avatar" />
              </div>
            </div>
            <div className="mt-14 px-6 flex flex-col gap-4">
              <div className="text-center">
                <h3 className="font-bold text-xl text-slate-900">João Silva</h3>
                <p className="text-sm text-slate-500">Design & Estratégia Digital</p>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between mt-4">
                <div className="flex items-center gap-3"><Globe size={18} className="text-blue-500"/> <span className="text-sm font-semibold">Meu Portfólio</span></div>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3"><ShoppingBag size={18} className="text-purple-500"/> <span className="text-sm font-semibold">Comprar Curso</span></div>
              </div>
              <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-md flex items-center justify-center mt-2">
                <span className="text-sm font-bold">Falar no WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const Capabilities = () => {
  return (
    <section id="como-funciona" className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">O que o contate.site permite</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Supere as limitações do "um único link" nas redes sociais. Agrupe tudo o que importa para o seu negócio em um só destino.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Atendimento a 1 clique</h3>
            <p className="text-slate-600 font-medium">Crie links inteligentes para WhatsApp, Telegram ou Messenger que abrem o app e iniciam a conversa imediatamente.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
              <ShoppingBag className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Venda mais rápido</h3>
            <p className="text-slate-600 font-medium">Exiba produtos, catálogos e links de checkout de forma clara. Reduza o caminho que o cliente faz para comprar de você.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 className="text-emerald-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Conheça sua audiência</h3>
            <p className="text-slate-600 font-medium">Estatísticas integradas para você saber de onde vêm seus cliques e quais links geram mais resultados e vendas.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesList = () => {
  const tools = [
    { icon: <LayoutTemplate />, title: 'Textos e FAQ', desc: 'Crie títulos atraentes e tire as dúvidas dos clientes na hora.' },
    { icon: <Link2 />, title: 'Múltiplos Links', desc: 'Adicione quantos botões e links quiser para suas páginas e redes.' },
    { icon: <Palette />, title: 'Design Personalizado', desc: 'Cores, fontes e estilos que combinam 100% com a sua marca.' },
    { icon: <Smartphone />, title: 'Mobile First', desc: 'Sua página vai carregar perfeitamente em qualquer dispositivo.' },
    { icon: <CreditCard />, title: 'Integração de Pagamento', desc: 'Receba através de métodos online de forma simplificada.' },
    { icon: <MapPin />, title: 'Mapas e Localização', desc: 'Mostre seu endereço físico direto no seu perfil digital.' }
  ];

  return (
    <section id="recursos" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            As ferramentas certas <br/><span className="text-blue-600">para o seu crescimento</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium mb-10 max-w-lg">
            Mais de 20 blocos dinâmicos para montar sua landing page. Sem precisar de designers ou programadores.
          </p>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {tools.map((tool, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1 text-slate-900">
                  {React.cloneElement(tool.icon, { size: 24 })}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1">{tool.title}</h4>
                  <p className="text-slate-600 text-sm font-medium">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 w-full lg:w-auto flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-blue-100 rounded-[3rem] rotate-6 scale-105 -z-10"></div>
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative">
               <h3 className="text-2xl font-bold mb-6">É mais fácil do que você pensa!</h3>
               <ul className="space-y-6">
                 <li className="flex items-center gap-4">
                   <CheckCircle2 className="text-green-400" size={28} />
                   <span className="font-semibold text-lg">Sem precisar de programadores</span>
                 </li>
                 <li className="flex items-center gap-4">
                   <CheckCircle2 className="text-green-400" size={28} />
                   <span className="font-semibold text-lg">Fácil de editar pelo próprio celular</span>
                 </li>
                 <li className="flex items-center gap-4">
                   <CheckCircle2 className="text-green-400" size={28} />
                   <span className="font-semibold text-lg">Pronto em 5 minutos</span>
                 </li>
               </ul>
               <button className="mt-10 w-full bg-white text-slate-900 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors">
                 Fazer minha página
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="planos" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Planos simples e justos</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Recursos principais liberados na versão grátis. Ferramentas premium de vendas e análise para quem quer ir mais longe.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic */}
          <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold mb-2">Básico</h3>
            <div className="text-4xl font-extrabold mb-2">R$ 0<span className="text-lg text-slate-400 font-medium">/mês</span></div>
            <p className="text-slate-400 font-medium mb-8">Permanentemente grátis</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3"><CheckCircle2 className="text-blue-500 shrink-0"/> <span>Links ilimitados</span></li>
              <li className="flex gap-3"><CheckCircle2 className="text-blue-500 shrink-0"/> <span>Temas padrão</span></li>
              <li className="flex gap-3"><CheckCircle2 className="text-blue-500 shrink-0"/> <span>Estatísticas básicas</span></li>
              <li className="flex gap-3"><CheckCircle2 className="text-blue-500 shrink-0"/> <span>QR Code para a página</span></li>
            </ul>
            <button className="w-full py-3 rounded-xl font-bold border-2 border-slate-600 hover:border-slate-500 transition-colors">Criar Grátis</button>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-3xl p-8 border border-blue-500 transform md:-translate-y-4 shadow-2xl">
            <div className="bg-blue-400 text-blue-950 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full inline-block mb-4">Recomendado</div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="text-4xl font-extrabold mb-2">R$ 15<span className="text-lg text-blue-200 font-medium">/mês</span></div>
            <p className="text-blue-200 font-medium mb-8">Apresentação profissional</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3"><CheckCircle2 className="text-white shrink-0"/> <span className="font-semibold">Tudo do grátis</span></li>
              <li className="flex gap-3"><CheckCircle2 className="text-white shrink-0"/> <span>Temas Premium e Personalização total</span></li>
              <li className="flex gap-3"><CheckCircle2 className="text-white shrink-0"/> <span>Mídia (Imagens, YouTube, Spotify)</span></li>
              <li className="flex gap-3"><CheckCircle2 className="text-white shrink-0"/> <span>Análise de Cliques Avançada</span></li>
            </ul>
            <button className="w-full py-3 rounded-xl font-bold bg-white text-blue-900 hover:bg-slate-100 transition-colors shadow-lg">Começar teste de 7 dias</button>
          </div>

          {/* Business */}
          <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold mb-2">Business</h3>
            <div className="text-4xl font-extrabold mb-2">R$ 35<span className="text-lg text-slate-400 font-medium">/mês</span></div>
            <p className="text-slate-400 font-medium mb-8">Para negócios e vendas</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3"><CheckCircle2 className="text-purple-400 shrink-0"/> <span>Tudo do plano Pro</span></li>
              <li className="flex gap-3"><CheckCircle2 className="text-purple-400 shrink-0"/> <span>Aceitar pagamentos online</span></li>
              <li className="flex gap-3"><CheckCircle2 className="text-purple-400 shrink-0"/> <span>Captura de Leads e Formulários</span></li>
              <li className="flex gap-3"><CheckCircle2 className="text-purple-400 shrink-0"/> <span>Integração com Pixel e Analytics</span></li>
            </ul>
            <button className="w-full py-3 rounded-xl font-bold border-2 border-slate-600 hover:border-slate-500 transition-colors">Assinar Business</button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-slate-100 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <Link2 className="text-blue-600" size={24} />
        <span className="font-extrabold text-xl text-slate-900">contate.site</span>
      </div>
      <div className="flex gap-6 text-slate-500 font-medium">
        <a href="#" className="hover:text-slate-900">Termos</a>
        <a href="#" className="hover:text-slate-900">Privacidade</a>
        <a href="#" className="hover:text-slate-900">Contato</a>
      </div>
      <div className="text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} contate.site. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <Helmet>
        <title>contate.site | Muito mais que um simples link na bio</title>
        <meta name="description" content="Crie uma landing page de alta conversão para o seu negócio no Instagram em poucos cliques. Agrupe todos os seus links e ferramentas em um só lugar." />
      </Helmet>
      
      <Navbar />
      
      <main>
        <Hero />
        <Capabilities />
        <FeaturesList />
        <Pricing />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
