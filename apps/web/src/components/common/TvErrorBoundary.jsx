import React from 'react';
import { RefreshCw, AlertTriangle, Tv } from 'lucide-react';
import { detectTvPlatform } from '@/lib/tvDeviceDetector.js';

export class TvErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      deviceInfo: detectTvPlatform()
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    try {
      console.error('[TvErrorBoundary] Erro capturado na TV:', error, errorInfo);
    } catch (e) {}
  }

  handleReload = () => {
    try {
      window.location.reload();
    } catch (e) {
      window.location.href = window.location.href;
    }
  };

  render() {
    if (this.state.hasError) {
      const { deviceInfo, error } = this.state;

      return (
        <div className="min-h-screen w-screen bg-[#080A0F] text-white flex flex-col items-center justify-center p-8 select-none font-sans">
          <div className="max-w-2xl w-full p-8 rounded-3xl bg-[#0E121A] border border-rose-500/30 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 mb-4">
              <Tv size={14} className="text-blue-400" />
              <span>{deviceInfo.fullLabel}</span>
            </div>

            <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-white mb-3">
              Não foi possível carregar a TV
            </h1>

            <p className="text-slate-400 text-sm mb-6 max-w-lg">
              Ocorreu um erro inesperado ao inicializar a tela. O sistema capturou o diagnóstico abaixo para auditoria.
            </p>

            <div className="w-full p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-left text-xs text-rose-300 overflow-x-auto max-h-48 mb-6 whitespace-pre-wrap break-words">
              {error?.toString() || 'Erro desconhecido de execução'}
            </div>

            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sora font-bold text-sm transition-all cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <RefreshCw size={16} />
              <span>Tentar Novamente (Recarregar)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
