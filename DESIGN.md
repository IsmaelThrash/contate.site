# 🎨 Design System & Identidade Visual — contate.site

Documento oficial de especificações visuais, paleta cromática, tipografia e diretrizes de marca do **contate.site**.

---

## 💎 1. Logotipo Oficial e Favicon (Versão 1A)

O símbolo oficial da marca é a **Versão 1A: O Elo Duplo a +45°**, composto por dois elos tubulares em cápsula paralelos conectados por uma barra horizontal central.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <linearGradient id="contateIndigoCobalt" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
      <stop offset="0%" stop-color="#6366F1"/>
      <stop offset="50%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
  </defs>
  <!-- Elo Esquerdo -->
  <rect x="23" y="14" width="24" height="56" rx="12" transform="rotate(45 35 42)" stroke="url(#contateIndigoCobalt)" stroke-width="7"/>
  <!-- Barra Central Horizontal -->
  <line x1="30" y1="50" x2="70" y2="50" stroke="url(#contateIndigoCobalt)" stroke-width="7"/>
  <!-- Elo Direito -->
  <rect x="53" y="30" width="24" height="56" rx="12" transform="rotate(45 65 58)" stroke="url(#contateIndigoCobalt)" stroke-width="7"/>
</svg>
```

---

## 🎨 2. Paleta Oficial: Índigo & Cobalto Tech

Inspirada no padrão visual dos maiores SaaS globais (Stripe, Linear, Supabase), combinando sofisticação tecnológica com alta energia de conversão.

### 🌟 Gradientes de Marca (Brand Gradients)
- **Primary Brand Gradient**: `linear-gradient(135deg, #6366F1 0%, #3B82F6 50%, #38BDF8 100%)`
  - Utilizado em: Ícone do logotipo, badges especiais, botões CTA de destaque, realce `.site`.
- **Subtle Surface Glow**: `radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 70%)`

### 🔵 Cores Primárias e Ação (Primary & Actions)
| Token | Hex | Tailwind | Aplicação |
| :--- | :--- | :--- | :--- |
| `primary-electric` | `#6366F1` | `indigo-500` | Início do gradiente, foco em inputs, bordas ativas |
| `primary-cobalt` | `#3B82F6` | `blue-500` | Botões primários, links em hover, elementos tech |
| `primary-sky` | `#38BDF8` | `sky-400` | Fim do gradiente, pontos de brilho, badges de sucesso |
| `primary-hover` | `#4F46E5` | `indigo-600` | Estado hover de botões primários |
| `primary-active` | `#4338CA` | `indigo-700` | Estado pressionado/ativo |

### 🌌 Neutros Escuros (Tema Tech Dark Nativo)
| Token | Hex | Tailwind | Aplicação |
| :--- | :--- | :--- | :--- |
| `bg-canvas` | `#080A0F` | — | Fundo principal da aplicação (Deep Black/Navy) |
| `bg-surface` | `#0E121A` | — | Cards, containers, modais, painéis secundários |
| `bg-surface-hover` | `#151B26` | — | Hover em linhas de tabela, cards interativos |
| `border-subtle` | `#1E2638` | `slate-800/80` | Divisores, bordas de cards e inputs inativos |
| `border-highlight` | `#2D3A54` | `slate-700` | Bordas com destaque leve |

### ☀️ Neutros Claros (Light Mode)
| Token | Hex | Tailwind | Aplicação |
| :--- | :--- | :--- | :--- |
| `light-canvas` | `#F8FAFC` | `slate-50` | Fundo no modo claro |
| `light-surface` | `#FFFFFF` | `white` | Cards e containers brancos |
| `light-border` | `#E2E8F0` | `slate-200` | Bordas e divisores |
| `light-text` | `#0F172A` | `slate-900` | Texto principal com contraste alto |

### 🚥 Cores Semânticas e Feedback
| Estado | Hex | Token | Aplicação |
| :--- | :--- | :--- | :--- |
| **Sucesso / WhatsApp** | `#10B981` | `emerald-500` | Status online, confirmação de agendamento, ícone WhatsApp |
| **Atenção / Pendente** | `#F59E0B` | `amber-500` | Alertas, notificações de limite de plano |
| **Erro / Perigo** | `#EF4444` | `rose-500` | Erros de validação, botão de exclusão, badge admin |

---

## 🔤 3. Tipografia Oficial

- **Fonte Oficial de Marca & Display (`contate.site`)**: **`Sora`** (Google Fonts).
  - *Pesos Principais*: `800` (ExtraBold para o wordmark do logo), `700` (Bold para títulos principais e CTAs), `600` (SemiBold para subtítulos).
  - *Características*: Tipografia desenhada com precisão geométrica para telas digitais, com curvas perfeitas que harmonizam diretamente com os elos tubulares da marca.
- **Fonte Primária de Corpo de Texto (UI & Body)**: `Inter` (Google Fonts, pesos `400` Regular, `500` Medium, `600` SemiBold).
- **Monospace/Código**: `JetBrains Mono` / `ui-monospace` (Hashes de versão, badges técnicos).
