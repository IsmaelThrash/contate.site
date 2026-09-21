import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, Cookie, UserCheck, Server, Mail } from 'lucide-react';
import { Footer } from '@/components/home/Footer.jsx';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      <Helmet>
        <title>Política de Privacidade e Cookies — contate.site</title>
        <meta 
          name="description" 
          content="Política de privacidade, proteção de dados e cookies do contate.site em rigorosa conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)." 
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 mb-4">
            <Lock size={14} />
            <span>Privacidade & LGPD (Lei nº 13.709/2018)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Política de Privacidade e Cookies</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Última revisão e atualização: {new Date().toLocaleDateString('pt-BR')} • Versão 2.1
          </p>
        </div>

        <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {/* Seção 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              1. Identificação do Controlador e Compromisso
            </h2>
            <p>
              O <strong>contate.site</strong> ("nós", "plataforma") é operado com o compromisso inegociável de proteger a privacidade, a autodeterminação informativa e a segurança dos dados pessoais de seus usuários e dos visitantes de suas páginas públicas, em estrita conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD — Lei Federal nº 13.709/2018)</strong> e o <strong>Marco Civil da Internet (Lei Federal nº 12.965/2014)</strong>.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-500" />
              2. Dados Pessoais Coletados e Finalidade
            </h2>
            <p>
              Em obediência ao <strong>Princípio da Minimização da Coleta</strong> (Art. 6º, III da LGPD), coletamos estritamente os dados essenciais para o funcionamento do ecossistema:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong>Dados de Cadastro e Acesso:</strong> Endereço de e-mail e identificadores de sessão gerenciados via Supabase Auth com autenticação criptografada (PKCE / Magic Link / OAuth Google). Não armazenamos senhas em texto puro.
              </li>
              <li>
                <strong>Dados do Perfil Público:</strong> Nome de exibição, foto/avatar, biografia e endereço personalizado (slug exclusivo). Essas informações são voluntariamente inseridas pelo usuário com a finalidade expressa de serem exibidas publicamente na internet.
              </li>
              <li>
                <strong>Conteúdo dos Blocos e Links:</strong> Títulos, URLs de destino (redes sociais, WhatsApp, lojas virtuais), vídeos incorporados e formato visual escolhidos pelo usuário.
              </li>
              <li>
                <strong>Registros de Conexão (Logs de Acesso):</strong> Em conformidade obrigatória com o Art. 15 do Marco Civil da Internet, mantemos sob sigilo registros de data, hora e endereço IP das conexões de autenticação por um período mínimo de 6 meses.
              </li>
            </ul>
          </section>

          {/* Seção 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-indigo-500" />
              3. Bases Legais para o Tratamento de Dados (Art. 7º da LGPD)
            </h2>
            <p>
              Todo o tratamento de dados pessoais no <strong>contate.site</strong> está fundamentado nas seguintes bases legais expressas na LGPD:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong>Execução de Contrato (Art. 7º, V):</strong> Necessário para fornecer as funcionalidades de criação, hospedagem e entrega de links solicitadas pelo titular.
              </li>
              <li>
                <strong>Cumprimento de Obrigação Legal ou Regulatória (Art. 7º, II):</strong> Retenção dos registros de acesso a aplicações de internet em consonância com o Marco Civil da Internet.
              </li>
              <li>
                <strong>Legítimo Interesse (Art. 7º, IX):</strong> Prevenção contra ataques cibernéticos, monitoramento de abusos, fraudes, phishing e melhoria contínua da performance dos serviços.
              </li>
              <li>
                <strong>Consentimento (Art. 7º, I):</strong> Aplicado à aceitação de cookies não essenciais de publicidade e medição.
              </li>
            </ul>
          </section>

          {/* Seção 4 - Cookies e AdSense */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cookie className="h-5 w-5 text-amber-500" />
              4. Política de Cookies e Publicidade de Terceiros (Google AdSense)
            </h2>
            <p>
              Cookies são pequenos arquivos de texto armazenados no navegador para recordar preferências, manter sessões ativas e aprimorar a navegação:
            </p>
            <div className="space-y-3 pl-2">
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">A. Cookies Estritamente Necessários</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Fundamentais para que a plataforma funcione. Permitem manter seu login seguro, registrar suas preferências de tema visual (Modo Claro/Escuro) e garantir a navegação. Não podem ser desativados sem comprometer o funcionamento da conta.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">B. Cookies de Publicidade e Parceiros Terceirizados (Google AdSense)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Para viabilizar a oferta de páginas gratuitas a profissionais e criadores, o <strong>contate.site</strong> pode exibir anúncios veiculados por fornecedores terceirizados, incluindo o <strong>Google AdSense</strong>. 
                  O Google utiliza cookies (como o cookie de publicidade do Google/DoubleClick) para exibir anúncios relevantes baseados nas visitas anteriores do usuário a este e a outros sites na internet. 
                  Você pode personalizar ou desativar a publicidade personalizada a qualquer momento visitando as{' '}
                  <a 
                    href="https://adssettings.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline font-semibold"
                  >
                    Configurações de Anúncios do Google
                  </a>{' '}
                  ou através das opções do nosso banner de consentimento de cookies.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 5 - Direitos dos Titulares */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-500" />
              5. Seus Direitos como Titular de Dados (Art. 18 da LGPD)
            </h2>
            <p>
              Você possui controle total sobre suas informações. A qualquer momento, mediante solicitação ou diretamente pelo seu painel de controle, você pode exercer os seguintes direitos:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Confirmação e Acesso:</strong> Confirmar se realizamos tratamento de dados sobre você e acessar esses dados.</li>
              <li><strong>Correção:</strong> Solicitar a retificação imediata de dados incompletos, inexatos ou desatualizados.</li>
              <li><strong>Portabilidade:</strong> Solicitar a exportação dos seus dados cadastrados.</li>
              <li>
                <strong>Eliminação Permanente dos Dados:</strong> No painel do usuário, oferecemos o recurso de <strong>"Excluir Conta Permanentemente"</strong>, que apaga imediatamente todos os seus links, fotos, biografia e histórico do nosso banco de dados.
              </li>
              <li><strong>Revogação do Consentimento:</strong> Revogar sua anuência para cookies e comunicações não essenciais.</li>
            </ul>
          </section>

          {/* Seção 6 - Segurança */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-500" />
              6. Medidas Técnicas de Segurança da Informação
            </h2>
            <p>
              Adotamos práticas alinhadas às diretrizes internacionais da OWASP e ISO/IEC 27001 para resguardar a integridade das suas informações:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Criptografia de ponta a ponta em trânsito com protocolo HTTPS/TLS de alta autoridade.</li>
              <li>Isolamento de privilégios e políticas de Row Level Security (RLS) nativas no PostgreSQL, impedindo que qualquer usuário visualize ou modifique dados de terceiros.</li>
              <li>Sanitização ativa contra injeções de script (Anti-XSS via DOMPurify) e validações estritas de protocolos de URL (apenas HTTPS/HTTP permitidos).</li>
            </ul>
          </section>

          {/* Seção 7 - Contato / DPO */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              7. Canal de Contato com o Encarregado de Dados (DPO)
            </h2>
            <p>
              Para dúvidas sobre esta Política, solicitações relativas aos seus dados ou exercer qualquer direito previsto na LGPD, entre em contato diretamente com o nosso Encarregado de Proteção de Dados através do e-mail:
            </p>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
              E-mail de Privacidade & LGPD:{' '}
              <a href="mailto:privacidade@contate.site" className="underline font-bold text-white hover:text-blue-200">
                privacidade@contate.site
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;

