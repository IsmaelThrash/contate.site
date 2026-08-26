import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Footer } from '@/components/home/Footer.jsx';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      <Helmet>
        <title>Termos de Uso — contate.site</title>
        <meta name="description" content="Termos e condições gerais de uso da plataforma contate.site." />
      </Helmet>

      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#080A0F]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Voltar para o início</span>
          </button>
          <span className="font-sora font-extrabold text-lg">
            contate<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#38BDF8]">.site</span>
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-4">
            <ShieldCheck size={14} />
            <span>Documento Oficial</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Termos de Uso</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Visão Geral do Serviço</h2>
            <p>
              O <strong>contate.site</strong> é uma plataforma online que permite a profissionais autônomos, empresas e criadores centralizarem seus links de contato, redes sociais, vídeos e serviços em uma página pública acessível via internet.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Cadastro e Responsabilidade pelo Conteúdo</h2>
            <p>
              Ao se cadastrar na plataforma, você garante que as informações fornecidas são verídicas e que você é o legítimo titular ou detentor de autorização para divulgar os links, imagens, marcas e serviços inseridos na sua página.
            </p>
            <p>
              É expressamente proibido utilizar o contate.site para:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Divulgar conteúdo ilegal, fraudulento, difamatório ou enganoso (phishing, golpes financeiros).</li>
              <li>Propagar malware, vírus ou links para páginas com código malicioso.</li>
              <li>Violar direitos autorais ou marcas registradas de terceiros.</li>
              <li>Comercializar substâncias ou serviços proibidos pela legislação brasileira.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Disponibilidade e Modificações</h2>
            <p>
              O contate.site envida os melhores esforços para garantir alta disponibilidade e velocidade de carregamento dos links. Reservamo-nos o direito de aprimorar, adicionar ou modificar recursos da plataforma com o objetivo de melhorar a experiência dos usuários.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Contato e Suporte</h2>
            <p>
              Para dúvidas sobre estes Termos de Uso ou suporte relacionado à sua conta, entre em contato através dos nossos canais oficiais disponibilizados na plataforma.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
