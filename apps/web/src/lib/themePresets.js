// Coleção de Temas e Paletas Oficiais do contate.site
// Desenvolvido para máxima percepção de cor, conforto visual e contraste perfeito

export const THEME_PRESETS = [
  {
    id: 'tech-dark',
    value: '#0B0D13',
    legacyValues: ['#080A0F'],
    label: 'Tech Dark',
    subLabel: 'Letras Brancas',
    isLight: false,
    textColor: '#FFFFFF',
    bioColor: 'rgba(255, 255, 255, 0.75)',
    accent: '#3B82F6',
    border: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.22)',
    secondaryGlow: 'rgba(56, 189, 248, 0.15)',
    description: 'Estética clássica dark com iluminação Cobalto Tech'
  },
  {
    id: 'emerald',
    value: '#05241B',
    legacyValues: ['#062016'],
    label: 'Esmeralda Bio',
    subLabel: 'Letras Brancas',
    isLight: false,
    textColor: '#FFFFFF',
    bioColor: 'rgba(255, 255, 255, 0.80)',
    accent: '#34D399',
    border: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.28)',
    secondaryGlow: 'rgba(52, 211, 153, 0.20)',
    description: 'Verde esmeralda sofisticado com letras brancas puras de alto contraste'
  },
  {
    id: 'emerald-gold',
    value: '#04281E',
    legacyValues: [],
    label: 'Esmeralda & Ouro',
    subLabel: 'Letras Douradas',
    isLight: false,
    textColor: '#FEF08A',
    bioColor: 'rgba(254, 240, 138, 0.82)',
    accent: '#FACC15',
    border: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.28)',
    secondaryGlow: 'rgba(250, 204, 21, 0.22)',
    description: 'Verde esmeralda nobre com tipografia em ouro reluzente'
  },
  {
    id: 'cobalt',
    value: '#0A1633',
    legacyValues: ['#0B132B'],
    label: 'Cobalto Royal',
    subLabel: 'Letras Brancas',
    isLight: false,
    textColor: '#FFFFFF',
    bioColor: 'rgba(255, 255, 255, 0.80)',
    accent: '#38BDF8',
    border: '#3B82F6',
    glowColor: 'rgba(37, 99, 235, 0.28)',
    secondaryGlow: 'rgba(56, 189, 248, 0.20)',
    description: 'Azul ultramarino nobre de alta tecnologia'
  },
  {
    id: 'crimson',
    value: '#260B18',
    legacyValues: ['#1C0B14'],
    label: 'Vinho & Carmim',
    subLabel: 'Letras Brancas',
    isLight: false,
    textColor: '#FFFFFF',
    bioColor: 'rgba(255, 255, 255, 0.80)',
    accent: '#FB7185',
    border: '#F43F5E',
    glowColor: 'rgba(225, 29, 72, 0.26)',
    secondaryGlow: 'rgba(244, 63, 94, 0.18)',
    description: 'Vinho aveludado e luxuoso com brilho rubi'
  },
  {
    id: 'crimson-gold',
    value: '#290C1A',
    legacyValues: [],
    label: 'Vinho & Ouro',
    subLabel: 'Letras Douradas',
    isLight: false,
    textColor: '#FEF08A',
    bioColor: 'rgba(254, 240, 138, 0.82)',
    accent: '#FACC15',
    border: '#F43F5E',
    glowColor: 'rgba(225, 29, 72, 0.26)',
    secondaryGlow: 'rgba(250, 204, 21, 0.20)',
    description: 'Vinho nobre com tipografia dourada premium'
  },
  {
    id: 'amber',
    value: '#241806',
    legacyValues: [],
    label: 'Âmbar Solar',
    subLabel: 'Letras Brancas',
    isLight: false,
    textColor: '#FFFFFF',
    bioColor: 'rgba(255, 255, 255, 0.80)',
    accent: '#FBBF24',
    border: '#F59E0B',
    glowColor: 'rgba(217, 119, 6, 0.26)',
    secondaryGlow: 'rgba(245, 158, 11, 0.18)',
    description: 'Dourado caloroso e acolhedor para negócios e gastronomia'
  },
  {
    id: 'cyan',
    value: '#06212D',
    legacyValues: [],
    label: 'Ciano Ocean',
    subLabel: 'Letras Brancas',
    isLight: false,
    textColor: '#FFFFFF',
    bioColor: 'rgba(255, 255, 255, 0.80)',
    accent: '#22D3EE',
    border: '#06B6D4',
    glowColor: 'rgba(8, 145, 178, 0.28)',
    secondaryGlow: 'rgba(34, 211, 238, 0.20)',
    description: 'Ciano oceânico vibrante para criadores e tech'
  },
  {
    id: 'slate',
    value: '#131826',
    legacyValues: ['#0F172A'],
    label: 'Slate Obsidian',
    subLabel: 'Letras Brancas',
    isLight: false,
    textColor: '#FFFFFF',
    bioColor: 'rgba(255, 255, 255, 0.75)',
    accent: '#94A3B8',
    border: '#64748B',
    glowColor: 'rgba(100, 116, 139, 0.24)',
    secondaryGlow: 'rgba(148, 163, 184, 0.16)',
    description: 'Monocromático titânio puro de alto contraste'
  },
  {
    id: 'purple',
    value: '#1B0F2E',
    legacyValues: ['#140B24'],
    label: 'Ametista Real',
    subLabel: 'Letras Brancas',
    isLight: false,
    textColor: '#FFFFFF',
    bioColor: 'rgba(255, 255, 255, 0.75)',
    accent: '#C084FC',
    border: '#A855F7',
    glowColor: 'rgba(147, 51, 234, 0.26)',
    secondaryGlow: 'rgba(168, 85, 247, 0.18)',
    description: 'Roxo profundo elegante e místico'
  },
  {
    id: 'clean-light',
    value: '#F8FAFC',
    legacyValues: ['#FFFFFF', '#F1F5F9', '#FAFAFA'],
    label: 'Claro Minimal',
    subLabel: 'Letras Escuras',
    isLight: true,
    textColor: '#0F172A',
    bioColor: '#475569',
    accent: '#2563EB',
    border: '#CBD5E1',
    glowColor: 'rgba(37, 99, 235, 0.12)',
    secondaryGlow: 'rgba(148, 163, 184, 0.25)',
    description: 'Fundo claro premium com tipografia escura nítida e alto contraste'
  }
];

export function getThemePreset(colorValue) {
  if (!colorValue) return THEME_PRESETS[0];
  const normalized = colorValue.trim().toLowerCase();
  
  // Encontrar por valor exato ou por legado
  const found = THEME_PRESETS.find(
    p => p.value.toLowerCase() === normalized || 
         (p.legacyValues && p.legacyValues.some(lv => lv.toLowerCase() === normalized))
  );

  if (found) return found;

  // Checar se a cor é clara via heurística rápida de luminância
  const isLight = isColorBright(colorValue);

  return {
    id: 'custom',
    value: colorValue,
    label: 'Personalizado',
    subLabel: isLight ? 'Letras Escuras' : 'Letras Brancas',
    isLight,
    textColor: isLight ? '#0F172A' : '#FFFFFF',
    bioColor: isLight ? '#475569' : 'rgba(255, 255, 255, 0.80)',
    accent: isLight ? '#2563EB' : '#3B82F6',
    border: isLight ? '#CBD5E1' : '#3B82F6',
    glowColor: isLight ? 'rgba(37, 99, 235, 0.12)' : 'rgba(59, 130, 246, 0.22)',
    secondaryGlow: isLight ? 'rgba(148, 163, 184, 0.25)' : 'rgba(56, 189, 248, 0.15)'
  };
}

function isColorBright(hex) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return false;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // Fórmula de luminância relativa W3C
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 180;
}
