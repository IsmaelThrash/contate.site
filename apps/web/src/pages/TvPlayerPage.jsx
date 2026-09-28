import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabaseClient.js';
import { logger } from '@/lib/logger.js';
import { 
  Tv, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Sparkles, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft,
  RotateCw
} from 'lucide-react';

const STORAGE_KEY = 'contate_tv_device';

export default function TvPlayerPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const directToken = searchParams.get('token');

  // Estados principais
  const [deviceToken, setDeviceToken] = useState(() => {
    return directToken || localStorage.getItem(STORAGE_KEY) || null;
  });
  const [pairingSession, setPairingSession] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [screenData, setScreenData] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedImages, setCachedImages] = useState(new Set());
  const [orientationOverride, setOrientationOverride] = useState(null); // 'horizontal' | 'vertical' | null
  const [showControls, setShowControls] = useState(false);

  const controlsTimeoutRef = useRef(null);
  const slideTimerRef = useRef(null);
  const blobUrlsRef = useRef([]);

  // Detecta status de conexão da TV
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Detecta mudanças de tela cheia
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      logger.error('Fullscreen toggle error:', err);
    }
  };

  // Gerenciador de controles temporários ao mover mouse/controle remoto
  const handleUserActivity = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [handleUserActivity]);

  // Limpeza de Blob URLs para evitar memory leaks em Smart TVs
  const cleanupBlobs = useCallback(() => {
    if (blobUrlsRef.current.length > 0) {
      blobUrlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // ignore
        }
      });
      blobUrlsRef.current = [];
    }
  }, []);

  useEffect(() => {
    return () => cleanupBlobs();
  }, [cleanupBlobs]);

  // Preloading e Caching Total de Imagens (Zero downloads por loop)
  const preloadAllSlideImages = useCallback(async (slidesList) => {
    if (!slidesList || slidesList.length === 0) return;

    const urls = slidesList
      .map(s => s.imagem_url)
      .filter(url => url && typeof url === 'string');

    const newCached = new Set();

    await Promise.all(
      urls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            newCached.add(url);
            resolve(url);
          };
          img.onerror = () => {
            resolve(null);
          };
        });
      })
    );

    setCachedImages(newCached);
  }, []);

  // Busca de conteúdo da tela ativa
  const fetchScreenContent = useCallback(async (token) => {
    if (!token) return;
    try {
      setLoading(true);

      // Tenta via RPC dedicada
      const { data, error } = await supabase.rpc('tv_obter_slides_tela', {
        p_device_token: token
      });

      if (error) {
        logger.error('Erro ao buscar dados da TV:', error);
        // Fallback: se RPC falhar, tenta ler cache local persistente
        const cachedLocal = localStorage.getItem(`tv_cached_data_${token}`);
        if (cachedLocal) {
          const parsed = JSON.parse(cachedLocal);
          setScreenData(parsed);
          setSlides(parsed.slides || []);
        }
        return;
      }

      if (data && data.valido) {
        setScreenData(data);
        const list = data.slides || [];
        setSlides(list);

        // Salva cache offline local
        localStorage.setItem(`tv_cached_data_${token}`, JSON.stringify(data));

        // Pré-carrega todas as imagens de uma vez para zero consumo de rede
        preloadAllSlideImages(list);
      } else {
        // Token inválido ou revogado pelo dono
        localStorage.removeItem(STORAGE_KEY);
        setDeviceToken(null);
        setScreenData(null);
      }
    } catch (err) {
      logger.error('Erro na requisição da TV:', err);
    } finally {
      setLoading(false);
    }
  }, [preloadAllSlideImages]);

  // Inicialização de Pareamento caso a TV não tenha token registrado
  const startPairingFlow = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('tv_gerar_sessao_pareamento');

      let sessionData = data;

      // Fallback de segurança se RPC ainda não estiver instalada
      if (error || !sessionData) {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let mockPin = '';
        for (let i = 0; i < 6; i++) {
          mockPin += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const mockToken = 'dev_' + Math.random().toString(36).substring(2, 15);
        sessionData = {
          codigo_pin: mockPin,
          device_token: mockToken,
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        };
      }

      setPairingSession(sessionData);

      // Gera o link de vinculação para o celular do lojista
      const origin = window.location.origin;
      const pairingUrl = `${origin}/dashboard/tv/vincular?pin=${sessionData.codigo_pin}`;

      // Renderiza QR Code em alta definição com quiet zone de 4 módulos
      const qrDataUrl = await QRCode.toDataURL(pairingUrl, {
        width: 380,
        margin: 2,
        color: {
          dark: '#080A0F',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });

      setQrCodeDataUrl(qrDataUrl);
    } catch (err) {
      logger.error('Erro no fluxo de pareamento:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Monitora pareamento em tempo real (Supabase Realtime + Polling suave)
  useEffect(() => {
    if (deviceToken || !pairingSession?.codigo_pin) return;

    let pollingInterval = null;

    // 1. Canal Realtime Supabase
    const channel = supabase
      .channel(`tv_pareamento_${pairingSession.codigo_pin}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tv_sessoes_pareamento',
          filter: `codigo_pin=eq.${pairingSession.codigo_pin}`
        },
        (payload) => {
          if (payload.new && payload.new.status === 'conectado') {
            const token = pairingSession.device_token;
            localStorage.setItem(STORAGE_KEY, token);
            setDeviceToken(token);
          }
        }
      )
      .subscribe();

    // 2. Polling de redundância para Smart TVs com WebSocket instável (a cada 4s)
    pollingInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('tv_sessoes_pareamento')
          .select('status, tela_id')
          .eq('codigo_pin', pairingSession.codigo_pin)
          .maybeSingle();

        if (!error && data && data.status === 'conectado') {
          const token = pairingSession.device_token;
          localStorage.setItem(STORAGE_KEY, token);
          setDeviceToken(token);
          if (pollingInterval) clearInterval(pollingInterval);
        }
      } catch (e) {
        // silent fallback
      }
    }, 4000);

    return () => {
      supabase.removeChannel(channel);
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [deviceToken, pairingSession]);

  // Inicialização no Mount
  useEffect(() => {
    if (deviceToken) {
      fetchScreenContent(deviceToken);
    } else {
      startPairingFlow();
    }
  }, [deviceToken, fetchScreenContent, startPairingFlow]);

  // Escuta canal Realtime para atualizações remotas de conteúdo da tela pareada
  useEffect(() => {
    if (!deviceToken || !screenData?.tela_id) return;

    const channel = supabase
      .channel(`tela_tv_${screenData.tela_id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'telas_tv',
          filter: `id=eq.${screenData.tela_id}`
        },
        () => {
          fetchScreenContent(deviceToken);
        }
      )
      .subscribe();

    // Heartbeat suave a cada 60s
    const heartbeat = setInterval(() => {
      fetchScreenContent(deviceToken);
    }, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(heartbeat);
    };
  }, [deviceToken, screenData?.tela_id, fetchScreenContent]);

  // Timer de Rotação do Carrossel (Looping Contínuo)
  useEffect(() => {
    if (!slides || slides.length <= 1 || isPaused) return;

    const currentSlide = slides[currentSlideIndex];
    const duration = (currentSlide?.duracao_segundos || 8) * 1000;

    slideTimerRef.current = setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, [slides, currentSlideIndex, isPaused]);

  // Atalhos de Teclado e Controle Remoto
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        setIsPaused(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        if (slides.length > 0) {
          setCurrentSlideIndex(prev => (prev + 1) % slides.length);
        }
      } else if (e.key === 'ArrowLeft') {
        if (slides.length > 0) {
          setCurrentSlideIndex(prev => (prev - 1 + slides.length) % slides.length);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  // Desvincular tela (reset para re-pareamento)
  const handleUnpair = () => {
    if (window.confirm('Deseja desconectar esta TV? Ela voltará para a tela de pareamento.')) {
      localStorage.removeItem(STORAGE_KEY);
      setDeviceToken(null);
      setScreenData(null);
      setSlides([]);
      startPairingFlow();
    }
  };

  const activeOrientation = orientationOverride || screenData?.orientacao || 'horizontal';
  const currentSlide = slides[currentSlideIndex] || null;

  // -------------------------------------------------------------
  // RENDER: TELA DE PAREAMENTO (QUANDO NÃO ESTÁ CONECTADA)
  // -------------------------------------------------------------
  if (!deviceToken || !screenData) {
    return (
      <div className="relative min-h-screen w-full bg-[#080A0F] text-white flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden font-sans">
        {/* Glow de fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Header da TV */}
        <header className="relative z-10 w-full max-w-5xl flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4F46E5] via-[#2563EB] to-[#38BDF8] p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-[#080A0F] rounded-[14px] flex items-center justify-center p-2">
                <img src="/favicon.svg" alt="contate.site" className="w-full h-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sora font-extrabold text-2xl tracking-tight text-white">
                  contate<span className="bg-gradient-to-r from-[#6366F1] via-[#3B82F6] to-[#38BDF8] bg-clip-text text-transparent">.site</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                  TV Signage
                </span>
              </div>
              <p className="text-sm text-slate-400">Vitrine Digital & Gestão Centralizada de Painéis</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold transition-all cursor-pointer"
              title="Alternar Tela Cheia (F11)"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span className="hidden sm:inline">{isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}</span>
            </button>
          </div>
        </header>

        {/* Bloco Central de Pareamento (10-Foot UI) */}
        <main className="relative z-10 my-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 max-w-5xl w-full py-8">
          {/* Card do QR Code em Alto Contraste */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur-xl group-hover:opacity-50 transition duration-700 pointer-events-none" />
            <div className="relative p-6 sm:p-8 rounded-[2rem] bg-white text-slate-900 shadow-2xl flex flex-col items-center">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code de Pareamento da TV" 
                  className="w-64 h-64 sm:w-72 sm:h-72 object-contain rounded-xl"
                />
              ) : (
                <div className="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center bg-slate-100 rounded-xl">
                  <RefreshCw className="animate-spin text-blue-600" size={36} />
                </div>
              )}
              <div className="mt-4 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Sparkles size={13} className="text-blue-600" />
                <span>Escaneie com a câmera do celular</span>
              </div>
            </div>
          </div>

          {/* Instruções e Código PIN */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Aguardando Conexão</span>
            </div>

            <h1 className="font-sora font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-3">
              Conecte esta TV ao seu painel
            </h1>

            <p className="text-slate-300 text-base leading-relaxed mb-6">
              Aponte a câmera do seu smartphone logado no <strong className="text-white">contate.site</strong> para configurar as promoções, lojas e playlists desta tela.
            </p>

            {/* Código PIN Curto em Destaque */}
            <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                Ou digite este código no seu painel:
              </span>
              <div className="font-mono font-extrabold text-3xl sm:text-4xl text-blue-400 tracking-widest">
                {pairingSession?.codigo_pin || '--- ---'}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Wifi size={14} className="text-emerald-400 shrink-0" />
              <span>Conexão ativa em tempo real • Expira em 15 minutos</span>
            </div>
          </div>
        </main>

        {/* Rodapé da TV */}
        <footer className="relative z-10 w-full max-w-5xl flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500">
          <span>contate.site TV • Versão v2.1</span>
          <div className="flex items-center gap-4">
            <button 
              onClick={startPairingFlow} 
              className="hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              <span>Novo Código</span>
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MODO LOOPING CONTÍNUO (REPRODUÇÃO NA TV)
  // -------------------------------------------------------------
  return (
    <div 
      className={`relative w-screen h-screen bg-black text-white overflow-hidden select-none font-sans ${
        activeOrientation === 'vertical' ? 'flex flex-col items-center justify-center' : ''
      }`}
    >
      {/* Controles Flutuantes com Auto-Hide (Mouse / Remoto) */}
      <div 
        className={`fixed top-4 right-4 z-50 flex items-center gap-2 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center p-1.5 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl">
          <button
            onClick={() => setIsPaused(prev => !prev)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title={isPaused ? "Retomar Carrossel (Espaço)" : "Pausar Carrossel (Espaço)"}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>

          <button
            onClick={() => setCurrentSlideIndex(prev => (prev - 1 + slides.length) % slides.length)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Slide Anterior"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setCurrentSlideIndex(prev => (prev + 1) % slides.length)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Próximo Slide"
          >
            <ChevronRight size={16} />
          </button>

          <div className="w-px h-4 bg-white/20 mx-1" />

          <button
            onClick={() => setOrientationOverride(prev => prev === 'vertical' ? 'horizontal' : 'vertical')}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Alternar Orientação (Horizontal / Vertical)"
          >
            <RotateCw size={16} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Alternar Tela Cheia (F11)"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            onClick={handleUnpair}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
            title="Desconectar esta tela"
          >
            Desconectar
          </button>
        </div>
      </div>

      {/* Indicador Silencioso de Rede no Canto Superior Esquerdo (Apenas se offline) */}
      {!isOnline && (
        <div className="fixed top-4 left-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
          <WifiOff size={13} />
          <span>Modo Offline (Cache Ativo)</span>
        </div>
      )}

      {/* ÁREA PRINCIPAL DOS SLIDES */}
      {slides.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#080A0F]">
          <Tv size={64} className="text-slate-600 mb-4" />
          <h2 className="font-sora font-bold text-2xl text-white mb-2">
            Nenhum slide cadastrado nesta playlist
          </h2>
          <p className="text-slate-400 max-w-md text-sm">
            Acesse seu painel no celular e adicione fotos ou cartazes de oferta na playlist associada a esta TV ({screenData.nome}).
          </p>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {slides.map((slide, index) => {
            const isActive = index === currentSlideIndex;
            return (
              <div
                key={slide.id || index}
                className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
                style={{ transform: 'translateZ(0)' }} // Hardware acceleration anti-lag
              >
                {slide.tipo === 'banner' ? (
                  // MODO BANNER FULLSCREEN (Artes do Canva / Designer)
                  <img
                    src={slide.imagem_url}
                    alt={slide.titulo || "Banner"}
                    className="w-full h-full object-contain bg-black"
                    loading="eager"
                  />
                ) : (
                  // MODO CARTAZ DE PRODUTO / OFERTA (Split Screen Tech Dark)
                  <div className="w-full h-full bg-[#080A0F] grid grid-cols-1 lg:grid-cols-12 items-center p-8 lg:p-16 gap-8 lg:gap-12">
                    {/* Coluna Esquerda: Imagem com Moldura e Glow */}
                    <div className="lg:col-span-6 flex items-center justify-center h-full max-h-[85vh]">
                      <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center bg-black/40">
                        <img
                          src={slide.imagem_url}
                          alt={slide.titulo}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                      </div>
                    </div>

                    {/* Coluna Direita: Informações e Preço (10-Foot UI) */}
                    <div className="lg:col-span-6 flex flex-col justify-center text-left">
                      {slide.badge_promocional && (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white font-sora font-extrabold text-sm uppercase tracking-wider mb-4 w-fit shadow-lg shadow-blue-500/30">
                          <Sparkles size={16} />
                          <span>{slide.badge_promocional}</span>
                        </div>
                      )}

                      <h2 className="font-sora font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight mb-4">
                        {slide.titulo}
                      </h2>

                      {slide.descricao && (
                        <p className="text-slate-300 text-lg sm:text-xl lg:text-2xl leading-relaxed mb-6 font-normal">
                          {slide.descricao}
                        </p>
                      )}

                      {slide.preco && (
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl w-fit">
                          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                            Preço Especial
                          </span>
                          <span className="font-sora font-extrabold text-4xl sm:text-5xl lg:text-6xl text-emerald-400 tracking-tight">
                            {slide.preco}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* LETREIRO TICKER DE RODAPÉ (SE ATIVO) */}
      {screenData.ticker_texto && (
        <div className="fixed bottom-0 left-0 right-0 z-40 h-14 sm:h-16 bg-[#080A0F]/95 backdrop-blur-xl border-t border-white/15 flex items-center overflow-hidden">
          <div className="px-4 py-1 bg-blue-600 text-white font-sora font-extrabold text-xs uppercase tracking-wider shrink-0 z-10 flex items-center gap-1.5 shadow-md">
            <Tv size={14} />
            <span>Avisos</span>
          </div>

          <div className="marquee-wrapper flex-1 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee inline-block font-sans text-base sm:text-xl font-medium text-slate-200 tracking-wide pl-4">
              {screenData.ticker_texto}
            </div>
          </div>
        </div>
      )}

      {/* Indicador de progresso de slides (discreto na borda superior) */}
      {slides.length > 1 && (
        <div className="fixed top-0 left-0 right-0 z-30 h-1 bg-white/10 flex">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-all duration-300 ${
                i === currentSlideIndex ? 'bg-blue-500' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
