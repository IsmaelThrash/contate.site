import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { logger } from '@/lib/logger.js';
import { useToast } from '@/hooks/use-toast';
import { 
  Tv, 
  Store, 
  Layers, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Wifi, 
  WifiOff, 
  Sparkles, 
  Upload, 
  Check, 
  Clock, 
  Monitor, 
  Smartphone,
  Eye,
  Sliders,
  DollarSign,
  Tag,
  Loader2,
  X
} from 'lucide-react';

export default function TvManagerSection({ currentUser }) {
  const { toast } = useToast();

  const [telas, setTelas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [slides, setSlides] = useState({}); // { [playlistId]: Slide[] }
  const [loading, setLoading] = useState(true);
  const [refreshingAll, setRefreshingAll] = useState(false);

  // Sub-aba ativa dentro da seção TV
  const [activeSubTab, setActiveSubTab] = useState('telas'); // 'telas' | 'playlists' | 'unidades'

  // Modais e formulários
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [slideType, setSlideType] = useState('banner'); // 'banner' | 'produto'
  const [slideForm, setSlideForm] = useState({
    imagem_url: '',
    titulo: '',
    descricao: '',
    preco: '',
    badge_promocional: '',
    duracao_segundos: 8
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modal para criar/editar Playlist
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [playlistForm, setPlaylistForm] = useState({
    id: null,
    nome: '',
    descricao: '',
    duracao_padrao_segundos: 8
  });

  // Modal para criar/editar Unidade
  const [isUnidadeModalOpen, setIsUnidadeModalOpen] = useState(false);
  const [unidadeForm, setUnidadeForm] = useState({
    id: null,
    nome: '',
    endereco: ''
  });

  // Modal de Conexão / Pareamento de Nova TV (Inline no Dashboard)
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [pairingPin, setPairingPin] = useState('');
  const [pairingNome, setPairingNome] = useState('TV Balcão');
  const [pairingSetor, setPairingSetor] = useState('Geral');
  const [pairingOrientacao, setPairingOrientacao] = useState('horizontal');
  const [pairingTicker, setPairingTicker] = useState('');
  const [pairingUnidadeId, setPairingUnidadeId] = useState('');
  const [pairingPlaylistIds, setPairingPlaylistIds] = useState([]);
  const [pairingSubmitting, setPairingSubmitting] = useState(false);
  const [isAddingUnidadeInline, setIsAddingUnidadeInline] = useState(false);
  const [newUnidadeInlineNome, setNewUnidadeInlineNome] = useState('');

  const handleOpenPairingModal = () => {
    setPairingPin('');
    setPairingNome(`TV ${telas.length > 0 ? `0${telas.length + 1}` : 'Balcão'}`);
    setPairingSetor('Geral');
    setPairingOrientacao('horizontal');
    setPairingTicker('');
    setPairingUnidadeId(unidades.length > 0 ? unidades[0].id : '');
    setPairingPlaylistIds(playlists.length > 0 ? [playlists[0].id] : []);
    setIsAddingUnidadeInline(false);
    setNewUnidadeInlineNome('');
    setIsPairingModalOpen(true);
  };

  const handleConfirmPairing = async (e) => {
    e.preventDefault();
    const cleanPin = pairingPin.trim().toUpperCase();

    if (!cleanPin || cleanPin.length < 4) {
      toast({
        title: 'Código Inválido',
        description: 'Digite o código PIN exibido na tela da sua Smart TV.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setPairingSubmitting(true);
      const { data, error } = await supabase.rpc('tv_confirmar_pareamento', {
        p_pin: cleanPin,
        p_nome: pairingNome.trim() || 'TV',
        p_unidade_id: pairingUnidadeId || null,
        p_setor: pairingSetor.trim() || 'Geral',
        p_orientacao: pairingOrientacao,
        p_ticker: pairingTicker.trim() || null,
        p_playlist_ids: pairingPlaylistIds
      });

      if (error) throw error;

      toast({
        title: '🎉 TV Conectada com Sucesso!',
        description: 'A tela da sua Smart TV já iniciou a transmissão em tempo real.'
      });

      setIsPairingModalOpen(false);
      await loadAllTvData();
      setActiveSubTab('telas');
    } catch (err) {
      logger.error('Erro ao conectar TV via modal:', err);
      toast({
        title: 'Erro ao conectar TV',
        description: err.message || 'Verifique se o código PIN está correto e ainda não expirou.',
        variant: 'destructive'
      });
    } finally {
      setPairingSubmitting(false);
    }
  };

  const handleCreateUnidadeInline = async () => {
    if (!newUnidadeInlineNome.trim() || !currentUser?.id) return;
    try {
      const { data, error } = await supabase
        .from('tv_unidades')
        .insert({
          usuario_id: currentUser.id,
          nome: newUnidadeInlineNome.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setUnidades(prev => [...prev, data]);
      setPairingUnidadeId(data.id);
      setNewUnidadeInlineNome('');
      setIsAddingUnidadeInline(false);
      toast({ title: 'Loja cadastrada com sucesso!' });
    } catch (err) {
      logger.error('Erro ao criar unidade inline:', err);
      toast({ title: 'Erro', description: 'Não foi possível cadastrar a loja.', variant: 'destructive' });
    }
  };

  const togglePairingPlaylist = (id) => {
    setPairingPlaylistIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Carrega todos os dados de TV do usuário
  const loadAllTvData = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);

      const [telasRes, unidadesRes, playlistsRes, juncaoRes] = await Promise.all([
        supabase
          .from('telas_tv')
          .select('*, tv_unidades(nome)')
          .eq('usuario_id', currentUser.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('tv_unidades')
          .select('*')
          .eq('usuario_id', currentUser.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('tv_playlists')
          .select('*')
          .eq('usuario_id', currentUser.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('tela_tv_playlists')
          .select('tela_id, playlist_id, tv_playlists(nome)')
      ]);

      const loadedPlaylists = playlistsRes.data || [];
      setPlaylists(loadedPlaylists);
      setUnidades(unidadesRes.data || []);

      // Monta as playlists vinculadas a cada tela
      const juncoes = juncaoRes.data || [];
      const telasComPlaylists = (telasRes.data || []).map(tela => {
        const associadas = juncoes
          .filter(j => j.tela_id === tela.id)
          .map(j => ({ id: j.playlist_id, nome: j.tv_playlists?.nome }));
        return { ...tela, playlists: associadas };
      });
      setTelas(telasComPlaylists);

      // Carrega os slides de cada playlist
      if (loadedPlaylists.length > 0) {
        const { data: slidesData } = await supabase
          .from('tv_slides')
          .select('*')
          .in('playlist_id', loadedPlaylists.map(p => p.id))
          .order('ordem', { ascending: true });

        const agrupados = {};
        (slidesData || []).forEach(s => {
          if (!agrupados[s.playlist_id]) agrupados[s.playlist_id] = [];
          agrupados[s.playlist_id].push(s);
        });
        setSlides(agrupados);

        if (!selectedPlaylist && loadedPlaylists.length > 0) {
          setSelectedPlaylist(loadedPlaylists[0]);
        }
      }
    } catch (err) {
      logger.error('Erro ao carregar dados do Contate TV:', err);
      toast({
        title: 'Erro ao carregar painéis de TV',
        description: 'Tente recarregar a página.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, selectedPlaylist, toast]);

  useEffect(() => {
    loadAllTvData();
  }, [loadAllTvData]);

  // Disparar atualização em massa para todas as TVs
  const handleRefreshAllTelas = async () => {
    try {
      setRefreshingAll(true);
      const { data, error } = await supabase.rpc('tv_disparar_atualizacao');
      if (error) throw error;

      toast({
        title: '⚡ Sinal Enviado!',
        description: `${data?.telas_atualizadas || telas.length} TVs receberam o comando de sincronização imediata.`
      });
      loadAllTvData();
    } catch (err) {
      logger.error('Erro ao atualizar telas em massa:', err);
      toast({
        title: 'Erro ao atualizar telas',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setRefreshingAll(false);
    }
  };

  // Disparar atualização para uma tela específica
  const handleRefreshSingleTela = async (telaId) => {
    try {
      const { error } = await supabase.rpc('tv_disparar_atualizacao', { p_tela_id: telaId });
      if (error) throw error;
      toast({
        title: 'Tela Atualizada',
        description: 'O sinal foi enviado para o dispositivo.'
      });
    } catch (err) {
      logger.error('Erro ao atualizar tela:', err);
    }
  };

  // Desconectar / Deletar Tela
  const handleDeleteTela = async (telaId) => {
    if (!window.confirm('Tem certeza que deseja remover esta tela? Ela será desconectada imediatamente.')) return;
    try {
      const { error } = await supabase
        .from('telas_tv')
        .delete()
        .eq('id', telaId);

      if (error) throw error;
      toast({ title: 'Tela removida com sucesso.' });
      loadAllTvData();
    } catch (err) {
      logger.error('Erro ao remover tela:', err);
      toast({ title: 'Erro ao remover tela', variant: 'destructive' });
    }
  };

  // Salvar Unidade / Loja
  const handleSaveUnidade = async (e) => {
    e.preventDefault();
    if (!unidadeForm.nome.trim()) return;
    try {
      if (unidadeForm.id) {
        const { error } = await supabase
          .from('tv_unidades')
          .update({ nome: unidadeForm.nome.trim(), endereco: unidadeForm.endereco.trim() })
          .eq('id', unidadeForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tv_unidades')
          .insert({
            usuario_id: currentUser.id,
            nome: unidadeForm.nome.trim(),
            endereco: unidadeForm.endereco.trim()
          });
        if (error) throw error;
      }
      toast({ title: 'Loja salva com sucesso!' });
      setIsUnidadeModalOpen(false);
      setUnidadeForm({ id: null, nome: '', endereco: '' });
      loadAllTvData();
    } catch (err) {
      logger.error('Erro ao salvar unidade:', err);
      toast({ title: 'Erro ao salvar loja', variant: 'destructive' });
    }
  };

  // Salvar Playlist
  const handleSavePlaylist = async (e) => {
    e.preventDefault();
    if (!playlistForm.nome.trim()) return;
    try {
      if (playlistForm.id) {
        const { error } = await supabase
          .from('tv_playlists')
          .update({
            nome: playlistForm.nome.trim(),
            descricao: playlistForm.descricao.trim(),
            duracao_padrao_segundos: Number(playlistForm.duracao_padrao_segundos) || 8
          })
          .eq('id', playlistForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tv_playlists')
          .insert({
            usuario_id: currentUser.id,
            nome: playlistForm.nome.trim(),
            descricao: playlistForm.descricao.trim(),
            duracao_padrao_segundos: Number(playlistForm.duracao_padrao_segundos) || 8
          });
        if (error) throw error;
      }
      toast({ title: 'Playlist salva com sucesso!' });
      setIsPlaylistModalOpen(false);
      setPlaylistForm({ id: null, nome: '', descricao: '', duracao_padrao_segundos: 8 });
      loadAllTvData();
    } catch (err) {
      logger.error('Erro ao salvar playlist:', err);
      toast({ title: 'Erro ao salvar playlist', variant: 'destructive' });
    }
  };

  // Upload de Imagem para Storage `tv-media`
  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Formato inválido',
        description: 'Envie uma imagem PNG, JPG ou WebP.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('tv-media')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('tv-media')
        .getPublicUrl(fileName);

      setSlideForm(prev => ({ ...prev, imagem_url: publicUrlData.publicUrl }));
      toast({ title: 'Imagem enviada com sucesso!' });
    } catch (err) {
      logger.error('Erro no upload de imagem:', err);
      // Fallback para URL pública direta se o bucket não permitir upload direto
      toast({
        title: 'Upload falhou',
        description: 'Você também pode colar um link direto de imagem.',
        variant: 'destructive'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Salvar Slide na Playlist
  const handleSaveSlide = async (e) => {
    e.preventDefault();
    if (!selectedPlaylist?.id) return;
    if (!slideForm.imagem_url.trim()) {
      toast({
        title: 'Imagem obrigatória',
        description: 'Faça upload de uma arte ou insira a URL da foto.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const currentList = slides[selectedPlaylist.id] || [];
      const { error } = await supabase
        .from('tv_slides')
        .insert({
          playlist_id: selectedPlaylist.id,
          tipo: slideType,
          imagem_url: slideForm.imagem_url.trim(),
          titulo: slideType === 'produto' ? slideForm.titulo.trim() : null,
          descricao: slideType === 'produto' ? slideForm.descricao.trim() : null,
          preco: slideType === 'produto' ? slideForm.preco.trim() : null,
          badge_promocional: slideType === 'produto' ? slideForm.badge_promocional.trim() : null,
          duracao_segundos: Number(slideForm.duracao_segundos) || selectedPlaylist.duracao_padrao_segundos || 8,
          ordem: currentList.length
        });

      if (error) throw error;

      toast({ title: 'Slide adicionado à playlist!' });
      setIsSlideModalOpen(false);
      setSlideForm({
        imagem_url: '',
        titulo: '',
        descricao: '',
        preco: '',
        badge_promocional: '',
        duracao_segundos: 8
      });
      loadAllTvData();
    } catch (err) {
      logger.error('Erro ao salvar slide:', err);
      toast({ title: 'Erro ao salvar slide', variant: 'destructive' });
    }
  };

  // Remover Slide
  const handleDeleteSlide = async (slideId) => {
    if (!window.confirm('Deseja remover este slide da playlist?')) return;
    try {
      const { error } = await supabase
        .from('tv_slides')
        .delete()
        .eq('id', slideId);

      if (error) throw error;
      toast({ title: 'Slide removido.' });
      loadAllTvData();
    } catch (err) {
      logger.error('Erro ao deletar slide:', err);
    }
  };

  // Verifica se a tela está online (heartbeat nos últimos 3 minutos)
  const isTelaOnline = (ultimaAtividade) => {
    if (!ultimaAtividade) return false;
    const diffMs = Date.now() - new Date(ultimaAtividade).getTime();
    return diffMs < 3 * 60 * 1000;
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-hidden">
      {/* HEADER DA SEÇÃO DE TVS (Mobile Friendly) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-[#0E121A] border border-white/10 shadow-xl max-w-full overflow-hidden">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Tv size={24} className="sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-sora font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                Contate TV
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Beta Aberta • Grátis
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
              Controle vitrines digitais, menu boards e promoções em Smart TVs de todas as suas lojas.
            </p>
          </div>
        </div>

        {/* Ações Globais */}
        <div className="grid grid-cols-1 sm:flex sm:items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleRefreshAllTelas}
            disabled={refreshingAll || telas.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all cursor-pointer disabled:opacity-40 w-full sm:w-auto"
            title="Atualizar todas as TVs conectadas simultaneamente"
          >
            <RefreshCw size={14} className={refreshingAll ? 'animate-spin text-blue-400' : ''} />
            <span>Atualizar Todas as TVs ⚡</span>
          </button>

          <button
            type="button"
            onClick={handleOpenPairingModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-sora font-extrabold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] shadow-blue-500/30 transition-all cursor-pointer w-full sm:w-auto"
          >
            <Plus size={16} />
            <span>Conectar Nova TV</span>
          </button>
        </div>
      </div>

      {/* TABS INTERNAS (Telas Conectadas | Playlists & Slides | Lojas & Unidades) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 sm:pb-4 overflow-x-auto max-w-full no-scrollbar">
        <button
          onClick={() => setActiveSubTab('telas')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'telas'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Tv size={15} />
          <span>Telas Conectadas ({telas.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('playlists')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'playlists'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers size={15} />
          <span>Playlists & Slides ({playlists.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('unidades')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'unidades'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Store size={15} />
          <span>Lojas & Unidades ({unidades.length})</span>
        </button>
      </div>

      {/* -------------------------------------------------------- */}
      {/* ABA 1: TELAS CONECTADAS */}
      {/* -------------------------------------------------------- */}
      {activeSubTab === 'telas' && (
        <div className="space-y-6">
          {telas.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#0E121A] border border-white/10">
              <Tv size={44} className="text-slate-600 mx-auto mb-4" />
              <h3 className="font-sora font-bold text-base sm:text-lg text-white mb-1">
                Nenhuma Smart TV conectada ainda
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
                Abra <strong className="text-white">contate.site/tv</strong> no navegador de qualquer Smart TV ou monitor e digite o PIN aqui.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenPairingModal}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Conectar TV com Código PIN
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {telas.map(tela => {
                const online = isTelaOnline(tela.ultima_atividade);
                return (
                  <div
                    key={tela.id}
                    className="p-6 rounded-3xl bg-[#0E121A] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Status e Indicador */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                          <span className={`text-xs font-bold uppercase tracking-wider ${online ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {online ? 'Online' : 'Offline'}
                          </span>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white/5 text-slate-300 border border-white/10">
                          {tela.orientacao === 'vertical' ? 'Vertical 9:16' : 'Horizontal 16:9'}
                        </span>
                      </div>

                      <h4 className="font-sora font-extrabold text-lg text-white mb-1">
                        {tela.nome}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Store size={12} className="text-blue-400" />
                          <span>{tela.tv_unidades?.nome || 'Unidade Geral'}</span>
                        </span>
                        <span>•</span>
                        <span className="text-slate-300 font-medium">Setor: {tela.setor}</span>
                      </div>

                      {/* Playlists vinculadas */}
                      <div className="mb-4">
                        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1.5">
                          Playlists Ativas:
                        </span>
                        {tela.playlists?.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {tela.playlists.map(p => (
                              <span
                                key={p.id}
                                className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium"
                              >
                                {p.nome}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Nenhuma playlist selecionada</span>
                        )}
                      </div>

                      {tela.ticker_texto && (
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 mb-4 truncate" title={tela.ticker_texto}>
                          <strong>Avisos:</strong> {tela.ticker_texto}
                        </div>
                      )}
                    </div>

                    {/* Ações da Tela */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRefreshSingleTela(tela.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Sincronizar Tela"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <a
                          href={`/tv?token=${tela.device_token}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Abrir Player Web"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>

                      <button
                        onClick={() => handleDeleteTela(tela.id)}
                        className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Desconectar Tela"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* ABA 2: PLAYLISTS & SLIDES */}
      {/* -------------------------------------------------------- */}
      {activeSubTab === 'playlists' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna Esquerda: Lista de Playlists */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sora font-bold text-base text-white">
                Minhas Playlists
              </h3>
              <button
                onClick={() => {
                  setPlaylistForm({ id: null, nome: '', descricao: '', duracao_padrao_segundos: 8 });
                  setIsPlaylistModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                <Plus size={14} />
                <span>Nova</span>
              </button>
            </div>

            {playlists.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-[#0E121A] border border-white/10 text-xs text-slate-400">
                Nenhuma playlist criada. Crie uma para começar a adicionar slides.
              </div>
            ) : (
              <div className="space-y-2">
                {playlists.map(p => {
                  const isSelected = selectedPlaylist?.id === p.id;
                  const slideCount = (slides[p.id] || []).length;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlaylist(p)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg'
                          : 'bg-[#0E121A] border-white/10 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <h4 className="font-semibold text-sm">{p.nome}</h4>
                        <span className="text-xs text-slate-400">
                          {slideCount} slides • {p.duracao_padrao_segundos || 8}s por slide
                        </span>
                      </div>
                      <ChevronRightIcon isSelected={isSelected} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Coluna Direita: Slides da Playlist Selecionada */}
          <div className="lg:col-span-8 space-y-6">
            {selectedPlaylist ? (
              <div className="p-6 rounded-3xl bg-[#0E121A] border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-sora font-extrabold text-xl text-white">
                      {selectedPlaylist.nome}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tempo padrão: {selectedPlaylist.duracao_padrao_segundos || 8} segundos por slide
                    </p>
                  </div>

                  <button
                    onClick={() => setIsSlideModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer w-fit"
                  >
                    <Plus size={16} />
                    <span>Adicionar Slide / Oferta</span>
                  </button>
                </div>

                {/* Grid de Slides */}
                {(!slides[selectedPlaylist.id] || slides[selectedPlaylist.id].length === 0) ? (
                  <div className="p-10 text-center rounded-2xl bg-black/30 border border-dashed border-white/10">
                    <Layers size={36} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 mb-4">
                      Esta playlist ainda não tem slides.
                    </p>
                    <button
                      onClick={() => setIsSlideModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Criar Primeiro Slide
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {slides[selectedPlaylist.id].map(slide => (
                      <div
                        key={slide.id}
                        className="group relative rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex flex-col justify-between"
                      >
                        {/* Imagem do Slide */}
                        <div className="relative aspect-video w-full bg-black/60 overflow-hidden">
                          <img
                            src={slide.imagem_url}
                            alt={slide.titulo || "Slide"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-md">
                              {slide.tipo === 'produto' ? 'Cartaz Oferta' : 'Banner Canva'}
                            </span>
                            {slide.preco && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                                {slide.preco}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Detalhes e Ações */}
                        <div className="p-3.5 flex items-center justify-between">
                          <div className="truncate pr-2">
                            <h5 className="font-semibold text-xs text-white truncate">
                              {slide.titulo || "Banner"}
                            </h5>
                            <span className="text-[11px] text-slate-400">
                              {slide.duracao_segundos || 8}s de exibição
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remover slide"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-[#0E121A] border border-white/10 text-slate-400">
                Selecione uma playlist ao lado para ver e gerenciar os slides.
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* ABA 3: LOJAS & UNIDADES */}
      {/* -------------------------------------------------------- */}
      {activeSubTab === 'unidades' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-sora font-bold text-lg text-white">
              Lojas e Unidades Físicas
            </h3>
            <button
              onClick={() => {
                setUnidadeForm({ id: null, nome: '', endereco: '' });
                setIsUnidadeModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
            >
              <Plus size={14} />
              <span>Nova Loja</span>
            </button>
          </div>

          {unidades.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-[#0E121A] border border-white/10 text-slate-400 text-sm">
              Nenhuma loja cadastrada. Cadastre suas filiais ou matriz para organizar suas TVs.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {unidades.map(u => {
                const countTelas = telas.filter(t => t.unidade_id === u.id).length;
                return (
                  <div
                    key={u.id}
                    className="p-5 rounded-2xl bg-[#0E121A] border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Store size={16} className="text-blue-400" />
                        <h4 className="font-semibold text-white text-sm">{u.nome}</h4>
                      </div>
                      {u.endereco && (
                        <p className="text-xs text-slate-400 truncate mb-1">{u.endereco}</p>
                      )}
                      <span className="text-xs text-blue-400 font-medium">
                        {countTelas} {countTelas === 1 ? 'tela vinculada' : 'telas vinculadas'}
                      </span>
                    </div>

                    <button
                      onClick={async () => {
                        if (window.confirm(`Deseja remover a loja "${u.nome}"?`)) {
                          await supabase.from('tv_unidades').delete().eq('id', u.id);
                          loadAllTvData();
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-400 cursor-pointer"
                      title="Excluir Loja"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* MODAL: ADICIONAR SLIDE (MODO HÍBRIDO) */}
      {/* -------------------------------------------------------- */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E121A] border border-white/15 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h4 className="font-sora font-extrabold text-lg text-white">
                Adicionar Slide na Playlist
              </h4>
              <button
                onClick={() => setIsSlideModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Alternador de Tipo de Slide (Banner vs Cartaz Produto) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSlideType('banner')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  slideType === 'banner'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-black/30 border-white/10 text-slate-400'
                }`}
              >
                Arte Pronta (Canva/16:9)
              </button>

              <button
                type="button"
                onClick={() => setSlideType('produto')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  slideType === 'produto'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-black/30 border-white/10 text-slate-400'
                }`}
              >
                Cartaz de Oferta / Prato
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              {/* Upload de Imagem */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                  Foto ou Arte do Slide
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={slideForm.imagem_url}
                    onChange={(e) => setSlideForm(prev => ({ ...prev, imagem_url: e.target.value }))}
                    placeholder="URL direta ou envie arquivo ao lado"
                    className="flex-1 h-11 px-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                  />
                  <label className="px-3.5 h-11 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer">
                    <Upload size={14} />
                    <span>{uploadingImage ? 'Enviando...' : 'Arquivo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Campos específicos do Cartaz de Oferta */}
              {slideType === 'produto' && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                      Nome do Prato / Produto
                    </label>
                    <input
                      type="text"
                      value={slideForm.titulo}
                      onChange={(e) => setSlideForm(prev => ({ ...prev, titulo: e.target.value }))}
                      placeholder="Ex: Combo Sushi Salmão Especial"
                      required
                      className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                        Preço Promocional
                      </label>
                      <input
                        type="text"
                        value={slideForm.preco}
                        onChange={(e) => setSlideForm(prev => ({ ...prev, preco: e.target.value }))}
                        placeholder="Ex: R$ 49,90"
                        className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                        Badge / Destaque
                      </label>
                      <input
                        type="text"
                        value={slideForm.badge_promocional}
                        onChange={(e) => setSlideForm(prev => ({ ...prev, badge_promocional: e.target.value }))}
                        placeholder="Ex: Oferta da Semana"
                        className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                      Descrição Curta
                    </label>
                    <input
                      type="text"
                      value={slideForm.descricao}
                      onChange={(e) => setSlideForm(prev => ({ ...prev, descricao: e.target.value }))}
                      placeholder="Ex: 20 peças de salmão fresco maçaricado"
                      className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                    />
                  </div>
                </>
              )}

              {/* Tempo do slide */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                  Tempo na Tela (Segundos)
                </label>
                <input
                  type="number"
                  min="3"
                  max="120"
                  value={slideForm.duracao_segundos}
                  onChange={(e) => setSlideForm(prev => ({ ...prev, duracao_segundos: e.target.value }))}
                  className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                />
              </div>

              {/* Botões do modal */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Salvar Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* MODAL: CRIAR PLAYLIST */}
      {/* -------------------------------------------------------- */}
      {isPlaylistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0E121A] border border-white/15 p-6 shadow-2xl space-y-4">
            <h4 className="font-sora font-extrabold text-lg text-white">
              Nova Playlist
            </h4>

            <form onSubmit={handleSavePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                  Nome da Playlist
                </label>
                <input
                  type="text"
                  value={playlistForm.nome}
                  onChange={(e) => setPlaylistForm(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Sobremesas da Semana"
                  required
                  className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                  Tempo Padrão por Slide (Segundos)
                </label>
                <input
                  type="number"
                  min="3"
                  max="120"
                  value={playlistForm.duracao_padrao_segundos}
                  onChange={(e) => setPlaylistForm(prev => ({ ...prev, duracao_padrao_segundos: e.target.value }))}
                  className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaylistModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                >
                  Salvar Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* MODAL: CRIAR UNIDADE / LOJA */}
      {/* -------------------------------------------------------- */}
      {isUnidadeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0E121A] border border-white/15 p-6 shadow-2xl space-y-4">
            <h4 className="font-sora font-extrabold text-lg text-white">
              Nova Loja / Unidade Física
            </h4>

            <form onSubmit={handleSaveUnidade} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                  Nome da Loja
                </label>
                <input
                  type="text"
                  value={unidadeForm.nome}
                  onChange={(e) => setUnidadeForm(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Filial Shopping, Matriz Centro"
                  required
                  className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                  Endereço ou Bairro (Opcional)
                </label>
                <input
                  type="text"
                  value={unidadeForm.endereco}
                  onChange={(e) => setUnidadeForm(prev => ({ ...prev, endereco: e.target.value }))}
                  placeholder="Ex: Av. Paulista, 1000 - Bela Vista"
                  className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUnidadeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                >
                  Salvar Loja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* MODAL: CONECTAR NOVA SMART TV (INLINE NO DASHBOARD) */}
      {/* -------------------------------------------------------- */}
      {isPairingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E121A] border border-white/15 p-5 sm:p-6 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Tv size={18} />
                </div>
                <div>
                  <h4 className="font-sora font-extrabold text-base sm:text-lg text-white">
                    Conectar Smart TV
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Digite o PIN de 6 dígitos exibido na sua TV
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPairingModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmPairing} className="space-y-4 text-left">
              {/* Campo 1: PIN da TV */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                  Código PIN da TV
                </label>
                <input
                  type="text"
                  value={pairingPin}
                  onChange={(e) => setPairingPin(e.target.value.toUpperCase())}
                  placeholder="Ex: 8F3K9M"
                  maxLength={8}
                  required
                  autoFocus
                  className="w-full h-12 px-3 rounded-xl bg-black/60 border border-white/20 text-center font-mono font-extrabold text-2xl text-blue-400 tracking-widest focus:outline-none focus:border-blue-500 uppercase"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                  Abra <strong className="text-white">contate.site/tv</strong> na sua TV para ver o PIN
                </p>
              </div>

              {/* Campo 2: Identificação da TV */}
              <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                    Nome da Tela
                  </label>
                  <input
                    type="text"
                    value={pairingNome}
                    onChange={(e) => setPairingNome(e.target.value)}
                    placeholder="Ex: TV Balcão, TV Entrada"
                    required
                    className="w-full h-11 px-3 rounded-xl bg-black/50 border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                    Setor / Função
                  </label>
                  <input
                    type="text"
                    value={pairingSetor}
                    onChange={(e) => setPairingSetor(e.target.value)}
                    placeholder="Ex: Balcão, Salão, Drinks"
                    required
                    className="w-full h-11 px-3 rounded-xl bg-black/50 border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Geral', 'Balcão', 'Sobremesas', 'Drinks', 'Salão', 'Vitrine'].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPairingSetor(s)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                          pairingSetor === s
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orientação */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                    Orientação
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPairingOrientacao('horizontal')}
                      className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        pairingOrientacao === 'horizontal'
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                          : 'bg-black/30 border-white/10 text-slate-400'
                      }`}
                    >
                      <Monitor size={15} />
                      <span>Horizontal (16:9)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPairingOrientacao('vertical')}
                      className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        pairingOrientacao === 'vertical'
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                          : 'bg-black/30 border-white/10 text-slate-400'
                      }`}
                    >
                      <Smartphone size={15} />
                      <span>Vertical / Totem</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Campo 3: Loja / Unidade */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1">
                    <Store size={13} className="text-blue-400" />
                    <span>Loja / Unidade</span>
                  </label>
                  {!isAddingUnidadeInline && (
                    <button
                      type="button"
                      onClick={() => setIsAddingUnidadeInline(true)}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Nova Loja</span>
                    </button>
                  )}
                </div>

                {isAddingUnidadeInline ? (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newUnidadeInlineNome}
                      onChange={(e) => setNewUnidadeInlineNome(e.target.value)}
                      placeholder="Nome da filial/loja"
                      className="flex-1 h-10 px-2.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleCreateUnidadeInline}
                      className="px-3 h-10 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingUnidadeInline(false)}
                      className="px-2.5 h-10 rounded-xl bg-white/5 text-slate-400 text-xs hover:bg-white/10 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <select
                    value={pairingUnidadeId}
                    onChange={(e) => setPairingUnidadeId(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-black/50 border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Nenhuma unidade específica (Geral)</option>
                    {unidades.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Campo 4: Playlists */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                  Playlists para Rodar na TV
                </label>
                {playlists.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    Nenhuma playlist criada. Crie uma na aba "Playlists & Slides".
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {playlists.map(p => {
                      const isChecked = pairingPlaylistIds.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => togglePairingPlaylist(p.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-blue-600/20 border-blue-500 text-white'
                              : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isChecked ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600'
                            }`}>
                              {isChecked && <Check size={11} />}
                            </div>
                            <span className="font-semibold">{p.nome}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {p.duracao_padrao_segundos || 8}s/slide
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Campo 5: Letreiro de Avisos no Rodapé */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1">
                  Letreiro Ticker de Rodapé (Opcional)
                </label>
                <input
                  type="text"
                  value={pairingTicker}
                  onChange={(e) => setPairingTicker(e.target.value)}
                  placeholder="Ex: Peça pelo WhatsApp • Wi-Fi da loja: SushiGuest"
                  className="w-full h-11 px-3 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Botões de Ação */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="submit"
                  disabled={pairingSubmitting}
                  className="w-full h-12 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-sora font-extrabold text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {pairingSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Conectando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Conectar e Transmitir 🚀</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPairingModalOpen(false)}
                  className="w-full sm:w-auto px-4 h-12 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 cursor-pointer text-center"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronRightIcon({ isSelected }) {
  return (
    <svg 
      className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-400 translate-x-1' : 'text-slate-500'}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
