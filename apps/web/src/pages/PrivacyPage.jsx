import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { Footer } from '@/components/home/Footer.jsx';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      <Helmet>
        <title>Política de Privacidade — contate.site</title>
        <meta name="description" content="Política de privacidade e proteção de dados do contate.site (em conformidade com a LGPD)." />
      </Helmet>

      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Voltar para o início</span>
          </button>
          <span className="font-extrabold text-lg">
            contate<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">.site</span>
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 mb-4">
            <Lock size={14} />
            <span>Privacidade & LGPD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Política de Privacidade</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Informações que Coletamos</h2>
            <p>
              Para fornecer o serviço, o <strong>contate.site</strong> coleta exclusivamente as informações necessárias para a criação da sua conta e exibição da sua página pública:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Dados de Conta:</strong> Endereço de e-mail e identificadores de autenticação segura (via Supabase Auth).</li>
              <li><strong>Dados do Perfil:</strong> Nome de exibição, foto/avatar, bio e endereço personalizado (slug).</li>
              <li><strong>Conteúdo dos Links:</strong> Títulos, URLs de destino e tipo de bloco configurados voluntariamente por você.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Como Usamos seus Dados</h2>
            <p>
              Seus dados são utilizados estritamente para:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Permitir o acesso ao painel de gerenciamento dos seus links.</li>
              <li>Renderizar sua página pública para os visitantes que acessarem seu link personalizado.</li>
              <li>Garantir a segurança, autenticidade e prevenção a abusos na plataforma.</li>
            </ul>
            <p>
              <strong>Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins de marketing ou publicidade.</strong>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Seus Direitos (LGPD)</h2>
            <p>
              De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de acessar, corrigir, atualizar ou solicitar a exclusão definitiva da sua conta e de todos os seus dados a qualquer momento diretamente pelo painel ou entrando em contato com nossa equipe.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Segurança</h2>
            <p>
              Empregamos protocolos de criptografia em trânsito (HTTPS/SSL) e políticas rígidas de segurança em nível de banco de dados (Row Level Security) para proteger suas informações contra acessos não autorizados.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
