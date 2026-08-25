/* global __COMMIT_HASH__ */
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const commitHash = typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'latest';

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 text-slate-500 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 shadow-sm">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[6px] flex items-center justify-center">
              <img src="/favicon.svg" alt="contate.site" className="w-5 h-5" />
            </div>
          </div>
          <span className="font-extrabold text-xl text-slate-900 dark:text-white">
            contate<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">.site</span>
          </span>
        </div>

        {/* Links Legais e Institucionais Reais */}
        <div className="flex gap-6 font-semibold text-xs sm:text-sm">
          <Link to="/termos" className="hover:text-violet-600 dark:hover:text-white transition-colors">
            Termos de Uso
          </Link>
          <Link to="/privacidade" className="hover:text-violet-600 dark:hover:text-white transition-colors">
            Política de Privacidade
          </Link>
          <Link to="/login" className="hover:text-violet-600 dark:hover:text-white transition-colors">
            Acessar Painel
          </Link>
        </div>

        {/* Copyright e Badge de Versão Obrigatório (Regra AGENTS.md) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-500 dark:text-slate-400 text-center md:text-right">
          <span>&copy; {new Date().getFullYear()} contate.site — Todos os direitos reservados.</span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 shadow-sm"
            title="Versão atual em produção"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            v2.1 ({commitHash})
          </span>
        </div>

      </div>
    </footer>
  );
};
