import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, Scale, DollarSign, HelpCircle } from 'lucide-react';
import { Footer } from '@/components/home/Footer.jsx';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      <Helmet>
        <title>Termos de Uso e Condições Gerais — contate.site</title>
        <meta 
          name="description" 
          content="Termos e condições gerais de uso da plataforma contate.site, em conformidade com o Marco Civil da Internet e a legislação brasileira." 
        />
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
            <span>Documento Legal Oficial</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Termos de Uso</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Última revisão e atualização: {new Date().toLocaleDateString('pt-BR')} • Versão 2.1
          </p>
        </div>

        <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {/* Seção 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-indigo-500" />
              1. Objeto e Aceitação dos Termos
            </h2>
            <p>
              O <strong>contate.site</strong> é uma plataforma SaaS (Software as a Service) que fornece ferramentas para criação, customização e publicação de páginas de links profissionais unificadas ("link na bio"), portfólios, catálogos e canais de contato na internet.
            </p>
            <p>
              Ao criar uma conta, reivindicar um endereço exclusivo (slug) ou navegar pela plataforma, você declara ter capacidade civil plena e anui integralmente às regras descritas nestes Termos de Uso e em nossa Política de Privacidade.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              2. Modelo de Serviço, Planos e Monetização (Google AdSense)
            </h2>
            <p>
              A plataforma adota o modelo <strong>Freemium</strong>:
            </p>
            <div className="space-y-3 pl-2">
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">A. Modalidade Gratuita (Free)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Permite o uso gratuito por tempo indeterminado de todas as funcionalidades essenciais. Para cobrir os custos de infraestrutura e hospedagem de alta velocidade, as páginas públicas no plano gratuito <strong>podem conter inserções publicitárias discretas veiculadas por parceiros como o Google AdSense</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">B. Modalidade Profissional (Pro / VIP)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Planos por assinatura garantem a remoção total de anúncios publicitários, selos de verificação VIP, temas exclusivos e suporte prioritário.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              3. Responsabilidade pelo Conteúdo e Uso Aceitável
            </h2>
            <p>
              Em harmonia com o <strong>Marco Civil da Internet (Lei Federal nº 12.965/2014)</strong>, o usuário é o único e exclusivo responsável cível e criminal por todas as informações, marcas, links externos, imagens e produtos inseridos em sua página pública.
            </p>
            <p>
              É terminantemente proibido utilizar o <strong>contate.site</strong> para:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Práticas de estelionato, phishing, esquemas piramidais, golpes ou venda de produtos ilícitos.</li>
              <li>Disseminação de código malicioso (malware, vírus, spyware ou redirecionamentos forçados).</li>
              <li>Violação de direitos autorais, patentes ou marcas registradas de terceiros (usurpação de nome comercial).</li>
              <li>Conteúdo que promova discriminação, ódio, violência ou exploração de qualquer natureza.</li>
            </ul>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              ✦ O descumprimento destas cláusulas autoriza o contate.site a suspender ou banir imediatamente o perfil infrator, sem prejuízo da cooperação com autoridades policiais e judiciais competentes.
            </p>
          </section>

          {/* Seção 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              4. Titularidade de Slugs e Propriedade Intelectual
            </h2>
            <p>
              O slug reivindicado (ex: <code>contate.site/seu-nome</code>) é concedido a título de licença de uso intransferível enquanto a conta estiver ativa. A plataforma se reserva o direito de intervir ou liberar slugs caso seja constatado o registro de marcas notórias por terceiros desautorizados (cybersquatting) ou contas abandonadas por longos períodos sem atividade.
            </p>
          </section>

          {/* Seção 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-purple-500" />
              5. Legislação Aplicável e Foro de Eleição
            </h2>
            <p>
              Estes Termos de Uso são regidos e interpretados exclusivamente de acordo com as <strong>Leis da República Federativa do Brasil</strong>. Fica eleito o Foro da Comarca de domicílio do usuário para dirimir quaisquer controvérsias decorrentes deste contrato, ressalvadas as disposições expressas do Código de Defesa do Consumidor.
            </p>
          </section>

          {/* Seção 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              6. Canal de Atendimento e Suporte
            </h2>
            <p>
              Para dúvidas legais, denúncias de abuso ou suporte técnico com a plataforma, nossa equipe está à disposição através do e-mail:
            </p>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200 font-medium">
              E-mail Oficial de Atendimento:{' '}
              <a href="mailto:suporte@contate.site" className="underline font-bold text-blue-500 hover:text-blue-400">
                suporte@contate.site
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;

