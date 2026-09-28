import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { supabase } from '@/lib/supabaseClient.js';
import { logger } from '@/lib/logger.js';
import { useToast } from '@/hooks/use-toast';
import { 
  Tv, 
  Store, 
  Layers, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Loader2, 
  Plus, 
  Smartphone, 
  Monitor,
  Sliders
} from 'lucide-react';

export default function TvPairingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const initialPin = searchParams.get('pin') || '';

  const [pin, setPin] = useState(initialPin);
  const [nome, setNome] = useState('TV Balcão');
  const [setor, setSetor] = useState('Geral');
  const [orientacao, setOrientacao] = useState('horizontal');
  const [ticker, setTicker] = useState('');
  
  // Unidades e Playlists
  const [unidades, setUnidades] = useState([]);
  const [selectedUnidadeId, setSelectedUnidadeId] = useState('');
  const [newUnidadeNome, setNewUnidadeNome] = useState('');
  const [isAddingUnidade, setIsAddingUnidade] = useState(false);

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState([]);
  const [newPlaylistNome, setNewPlaylistNome] = useState('');
  const [isAddingPlaylist, setIsAddingPlaylist] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Carrega unidades e playlists existentes do usuário
  const loadData = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);

      const [unidadesRes, playlistsRes] = await Promise.all([
        supabase
          .from('tv_unidades')
          .select('*')
          .eq('usuario_id', currentUser.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('tv_playlists')
          .select('*')
          .eq('usuario_id', currentUser.id)
          .order('created_at', { ascending: true })
      ]);

      if (unidadesRes.data && unidadesRes.data.length > 0) {
        setUnidades(unidadesRes.data);
        setSelectedUnidadeId(unidadesRes.data[0].id);
      }

      if (playlistsRes.data && playlistsRes.data.length > 0) {
        setPlaylists(playlistsRes.data);
        // Seleciona a primeira por padrão
        setSelectedPlaylistIds([playlistsRes.data[0].id]);
      }
    } catch (err) {
      logger.error('Erro ao carregar dados de TV:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Criar nova Unidade / Loja inline
  const handleCreateUnidade = async () => {
    if (!newUnidadeNome.trim()) return;
    try {
      const { data, error } = await supabase
        .from('tv_unidades')
        .insert({
          usuario_id: currentUser.id,
          nome: newUnidadeNome.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setUnidades(prev => [...prev, data]);
      setSelectedUnidadeId(data.id);
      setNewUnidadeNome('');
      setIsAddingUnidade(false);
      toast({ title: 'Loja cadastrada com sucesso!' });
    } catch (err) {
      logger.error('Erro ao criar unidade:', err);
      toast({ title: 'Erro', description: 'Não foi possível criar a unidade.', variant: 'destructive' });
    }
  };

  // Criar nova Playlist inline
  const handleCreatePlaylist = async () => {
    if (!newPlaylistNome.trim()) return;
    try {
      const { data, error } = await supabase
        .from('tv_playlists')
        .insert({
          usuario_id: currentUser.id,
          nome: newPlaylistNome.trim(),
          duracao_padrao_segundos: 8
        })
        .select()
        .single();

      if (error) throw error;

      setPlaylists(prev => [...prev, data]);
      setSelectedPlaylistIds(prev => [...prev, data.id]);
      setNewPlaylistNome('');
      setIsAddingPlaylist(false);
      toast({ title: 'Playlist criada com sucesso!' });
    } catch (err) {
      logger.error('Erro ao criar playlist:', err);
      toast({ title: 'Erro', description: 'Não foi possível criar a playlist.', variant: 'destructive' });
    }
  };

  // Alterna seleção de playlists
  const togglePlaylist = (id) => {
    setSelectedPlaylistIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Submissão do pareamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanPin = pin.trim().toUpperCase();

    if (!cleanPin || cleanPin.length < 4) {
      toast({
        title: 'Código Inválido',
        description: 'Digite o código PIN exibido na tela da sua Smart TV.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);

      // Chama RPC tv_confirmar_pareamento
      const { data, error } = await supabase.rpc('tv_confirmar_pareamento', {
        p_pin: cleanPin,
        p_nome: nome.trim(),
        p_unidade_id: selectedUnidadeId || null,
        p_setor: setor.trim(),
        p_orientacao: orientacao,
        p_ticker: ticker.trim() || null,
        p_playlist_ids: selectedPlaylistIds
      });

      if (error) {
        throw error;
      }

      toast({
        title: '🎉 TV Conectada com Sucesso!',
        description: 'A tela da sua Smart TV já iniciou a transmissão em tempo real.'
      });

      // Redireciona para o dashboard com foco na aba de TVs
      navigate('/dashboard?tab=tv');
    } catch (err) {
      logger.error('Erro ao confirmar pareamento:', err);
      toast({
        title: 'Erro ao conectar TV',
        description: err.message || 'Verifique se o código PIN está correto e ainda não expirou.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const sugestoesSetores = ['Geral', 'Balcão', 'Sobremesas', 'Bar / Drinks', 'Vitrine', 'Salão'];

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 font-sans pb-24">
      {/* Glow de fundo */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Mobile com Touch Target Generoso */}
      <header className="sticky top-0 z-30 bg-[#080A0F]/90 backdrop-blur-xl border-b border-white/10 px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-semibold">Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Contate TV
            </span>
          </div>
        </div>
      </header>

      {/* Formulário Principal de Pareamento */}
      <main className="max-w-xl mx-auto px-4 py-6 relative z-10">
        <div className="mb-6 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 mx-auto sm:mx-0">
            <Tv size={24} />
          </div>
          <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Vincular Nova Smart TV
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure o setor, a loja e quais playlists devem rodar nesta tela.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo 1: Código PIN da TV */}
          <div className="p-5 rounded-2xl bg-[#0E121A] border border-white/10 shadow-lg">
            <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-2">
              Código PIN da TV
            </label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value.toUpperCase())}
              placeholder="Ex: 8F3K9M"
              maxLength={8}
              required
              className="w-full h-14 px-4 rounded-xl bg-black/50 border border-white/15 text-center font-mono font-extrabold text-2xl sm:text-3xl text-blue-400 tracking-widest focus:outline-none focus:border-blue-500 transition-colors uppercase"
            />
            <p className="text-xs text-slate-400 mt-2">
              Código de 6 letras/números exibido na tela da sua Smart TV.
            </p>
          </div>

          {/* Campo 2: Identificação da Tela & Setor */}
          <div className="p-5 rounded-2xl bg-[#0E121A] border border-white/10 shadow-lg space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                Nome da Tela
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: TV Balcão Entrada"
                required
                className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                Setor / Função
              </label>
              <input
                type="text"
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                placeholder="Ex: Sobremesas, Drinks, Balcão"
                required
                className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-medium"
              />
              {/* Sugestões Rápidas em Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {sugestoesSetores.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSetor(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      setor === s 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientação da TV */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-2">
                Orientação da Tela
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrientacao('horizontal')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    orientacao === 'horizontal'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor size={18} />
                  <span>Horizontal (16:9)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrientacao('vertical')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    orientacao === 'vertical'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone size={18} />
                  <span>Vertical / Totem</span>
                </button>
              </div>
            </div>
          </div>

          {/* Campo 3: Unidade / Loja Física */}
          <div className="p-5 rounded-2xl bg-[#0E121A] border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
                <Store size={14} className="text-blue-400" />
                <span>Loja / Unidade Física</span>
              </label>
              {!isAddingUnidade && (
                <button
                  type="button"
                  onClick={() => setIsAddingUnidade(true)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Nova Loja</span>
                </button>
              )}
            </div>

            {isAddingUnidade ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUnidadeNome}
                  onChange={(e) => setNewUnidadeNome(e.target.value)}
                  placeholder="Nome da Loja (ex: Matriz Centro)"
                  className="flex-1 h-11 px-3 rounded-xl bg-black/50 border border-white/20 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCreateUnidade}
                  className="px-4 h-11 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingUnidade(false)}
                  className="px-3 h-11 rounded-xl bg-white/5 text-slate-400 text-xs font-semibold hover:bg-white/10 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <select
                value={selectedUnidadeId}
                onChange={(e) => setSelectedUnidadeId(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-blue-500 text-sm font-medium"
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

          {/* Campo 4: Seleção Múltipla de Playlists */}
          <div className="p-5 rounded-2xl bg-[#0E121A] border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
                <Layers size={14} className="text-blue-400" />
                <span>Playlists para Reproduzir</span>
              </label>
              {!isAddingPlaylist && (
                <button
                  type="button"
                  onClick={() => setIsAddingPlaylist(true)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Nova Playlist</span>
                </button>
              )}
            </div>

            {isAddingPlaylist && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newPlaylistNome}
                  onChange={(e) => setNewPlaylistNome(e.target.value)}
                  placeholder="Nome (ex: Sobremesas da Semana)"
                  className="flex-1 h-11 px-3 rounded-xl bg-black/50 border border-white/20 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCreatePlaylist}
                  className="px-4 h-11 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Criar
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingPlaylist(false)}
                  className="px-3 h-11 rounded-xl bg-white/5 text-slate-400 text-xs font-semibold hover:bg-white/10 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}

            {playlists.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                Nenhuma playlist cadastrada. Crie uma acima para adicionar slides.
              </p>
            ) : (
              <div className="space-y-2">
                {playlists.map(p => {
                  const isChecked = selectedPlaylistIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => togglePlaylist(p.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-blue-600/15 border-blue-500 text-white' 
                          : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600'
                        }`}>
                          {isChecked && <Check size={14} />}
                        </div>
                        <span className="font-semibold text-sm">{p.nome}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {p.duracao_padrao_segundos || 8}s por slide
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Campo 5: Letreiro Ticker de Rodapé */}
          <div className="p-5 rounded-2xl bg-[#0E121A] border border-white/10 shadow-lg">
            <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1.5">
              Letreiro de Avisos no Rodapé (Opcional)
            </label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Ex: Peça pelo WhatsApp • Wi-Fi da loja: SushiGuest (Senha: salmao123)"
              className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-medium"
            />
            <p className="text-xs text-slate-400 mt-2">
              Texto corrido contínuo exibido na base da TV durante a transmissão.
            </p>
          </div>

          {/* Botão Fixo de Ação Primária (Cobalto Tech Sólido / Mobile Thumb Zone) */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-sora font-extrabold text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Transmitindo para a TV...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Conectar e Transmitir Agora 🚀</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
