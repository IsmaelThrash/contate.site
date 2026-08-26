/**
 * Centralized content and copy data for contate.site homepage
 * Focused on Brazilian self-employed professionals and local businesses
 */

export const homeContent = {
  seo: {
    title: 'contate.site — Seu negócio em um único link na bio',
    description: 'Crie gratuitamente uma página profissional para seus clientes agendarem pelo WhatsApp, verem seus serviços e entrarem em contato. Feito para autônomos brasileiros.'
  },

  nav: {
    links: [
      { label: 'Como Funciona', href: '#como-funciona' },
      { label: 'Exemplos', href: '#exemplos' },
      { label: 'Recursos', href: '#recursos' },
      { label: 'Comparativo', href: '#comparativo' },
      { label: 'Planos', href: '#planos' },
      { label: 'FAQ', href: '#faq' },
    ],
    loginText: 'Entrar',
    ctaText: 'Criar página grátis'
  },

  hero: {
    badge: '✦ Feito para quem vive do próprio trabalho',
    titleLine1: 'Seus clientes encontram tudo em',
    titleHighlight: 'um único link.',
    subtitle: 'Centralize seus serviços, preços e contato numa página profissional — criada em 2 minutos, direto do celular. Quem chega pelo Instagram agenda pelo WhatsApp.',
    reservationPrefix: 'contate.site/',
    reservationPlaceholder: 'seu-nome',
    ctaButton: 'Garantir meu link grátis',
    guarantees: [
      '100% grátis',
      'Sem cartão de crédito',
      'Pronta em 2 minutos'
    ]
  },

  profiles: {
    beleza: {
      id: 'beleza',
      tabLabel: 'Beleza',
      name: 'Studio Bella Hair',
      role: 'Salão & Estética VIP',
      initials: 'SB',
      avatarGradient: 'from-rose-500 to-pink-600',
      bannerGradient: 'from-rose-500/90 via-pink-600/80 to-rose-700',
      socialProof: '📅 Hoje: 8 horários marcados',
      benefitHeadline: 'Agendamentos sem perder mensagens no direct',
      benefitText: 'Clientes tocam no link, escolhem o serviço e já caem no seu WhatsApp com a mensagem pronta para agendar.',
      links: [
        { label: '💬 Agendar pelo WhatsApp', type: 'whatsapp', primary: true },
        { label: '✂️ Tabela de Preços & Procedimentos', type: 'link' },
        { label: '📍 Como Chegar no Espaço', type: 'link' },
        { label: '📹 Vídeo: Tendências de Cortes 2026', type: 'video' }
      ]
    },
    pet: {
      id: 'pet',
      tabLabel: 'Pet',
      name: 'Dra. Ana Costa',
      role: 'Veterinária & Cirurgiã',
      initials: 'AC',
      avatarGradient: 'from-emerald-500 to-teal-600',
      bannerGradient: 'from-emerald-600/90 via-teal-600/80 to-emerald-800',
      socialProof: '⭐ 4,9 no Google (+120 avaliações)',
      benefitHeadline: 'Atendimento rápido e triagem de emergência',
      benefitText: 'Tutores encontram orientações rápidas, botão de emergência 24h e agendamento de consultas e vacinas no primeiro toque.',
      links: [
        { label: '💬 Agendar Consulta ou Vacina', type: 'whatsapp', primary: true },
        { label: '🚨 Plantão de Emergência 24h', type: 'emergency' },
        { label: '🐾 Dicas de Saúde no Instagram', type: 'link' },
        { label: '📹 Vídeo: Cuidados Essenciais com Filhotes', type: 'video' }
      ]
    },
    saude: {
      id: 'saude',
      tabLabel: 'Saúde',
      name: 'Dr. Carlos Lima',
      role: 'Odontologia & Implantes',
      initials: 'CL',
      avatarGradient: 'from-cyan-600 to-blue-700',
      bannerGradient: 'from-cyan-600/90 via-blue-600/80 to-indigo-800',
      socialProof: '👥 +500 pacientes atendidos',
      benefitHeadline: 'Credibilidade e profissionalismo imediato',
      benefitText: 'Apresente seus tratamentos, localização da clínica e canal direto de avaliação para transmitir total confiança.',
      links: [
        { label: '🦷 Agendar Avaliação Inicial', type: 'whatsapp', primary: true },
        { label: '😁 Galeria: Antes e Depois', type: 'link' },
        { label: '📍 Nossa Clínica & Estacionamento', type: 'link' },
        { label: '📹 Vídeo: Conheça nossa estrutura', type: 'video' }
      ]
    },
    criador: {
      id: 'criador',
      tabLabel: 'Criador',
      name: 'Rafa Santos',
      role: 'Conteúdo & Tecnologia',
      initials: 'RS',
      avatarGradient: 'from-indigo-600 to-blue-700',
      bannerGradient: 'from-indigo-600/90 via-blue-600/80 to-slate-900',
      socialProof: '🔥 Novo vídeo toda sexta-feira',
      benefitHeadline: 'Toda a sua audiência em um só lugar',
      benefitText: 'Divulgue seus vídeos mais recentes, podcasts, canais comunitários e facilite o contato para parcerias e patrocínios.',
      links: [
        { label: '▶ Último Vídeo no YouTube', type: 'video', primary: true },
        { label: '🎧 Meu Podcast no Spotify', type: 'link' },
        { label: '💼 Mídia Kit & Parcerias Comerciais', type: 'link' },
        { label: '💬 Canal VIP no Telegram', type: 'link' }
      ]
    }
  },

  segments: {
    label: 'Perfeito para:',
    items: [
      { name: 'Criadores de Conteúdo', icon: 'Video' },
      { name: 'Dentistas e Clínicas', icon: 'Stethoscope' },
      { name: 'Veterinários e Pet Shops', icon: 'HeartPulse' },
      { name: 'Manicures e Estética', icon: 'Sparkles' },
      { name: 'Barbearias e Salões', icon: 'Scissors' },
      { name: 'Personal Trainers', icon: 'Dumbbell' },
      { name: 'Nutricionistas', icon: 'Apple' },
      { name: 'Fotógrafos', icon: 'Camera' }
    ]
  },

  howItWorks: {
    title: 'Do zero ao primeiro cliente em 3 passos',
    subtitle: 'Sem complicação e sem precisar de computador. Você configura tudo direto no celular no tempo de uma pausa para o café.',
    steps: [
      {
        number: '01',
        title: 'Crie seu link',
        description: 'Escolha seu endereço contate.site/seu-nome e crie sua conta gratuitamente em menos de 1 minuto.'
      },
      {
        number: '02',
        title: 'Personalize com seus dados',
        description: 'Adicione links ilimitados para WhatsApp, mapas, cardápios e vídeos do YouTube. Escolha a paleta de cores ideal.'
      },
      {
        number: '03',
        title: 'Divulgue na sua bio',
        description: 'Coloque seu link no Instagram, TikTok, WhatsApp e cartão de visita. Seus seguidores viram clientes sem barreiras.'
      }
    ]
  },

  features: {
    title: 'Tudo que você precisa, nada que atrapalha',
    subtitle: 'Focado no que realmente traz resultado para quem presta serviços e atende clientes todos os dias.',
    real: [
      {
        title: 'Links Ilimitados',
        description: 'Adicione quantos botões de contato, catálogo e redes precisar. Reordene com arrastar e soltar facilmente.',
        icon: 'Link2',
        badge: 'Disponível'
      },
      {
        title: 'Vídeos do YouTube Embutidos',
        description: 'Mostre seu trabalho, procedimentos, depoimentos ou apresentação em vídeo sem o cliente sair da página.',
        icon: 'PlayCircle',
        badge: 'Disponível'
      },
      {
        title: '5 Temas de Cor Profissionais',
        description: 'Paletas elegantes pensadas para combinar com sua marca — do escuro sofisticado ao visual clean.',
        icon: 'Palette',
        badge: 'Disponível'
      },
      {
        title: 'Edição 100% no Celular',
        description: 'Painel leve e responsivo. Atualize horários, adicione novos serviços e troque links de onde estiver.',
        icon: 'Smartphone',
        badge: 'Disponível'
      }
    ],
    upcomingTitle: 'Em desenvolvimento para as próximas versões:',
    upcoming: [
      {
        title: 'Chave Pix Copia e Cola',
        description: 'Facilite o recebimento de sinais e pagamentos com um clique.',
        icon: 'QrCode'
      },
      {
        title: 'Agendamento Integrado',
        description: 'Visualização de horários livres com confirmação automática.',
        icon: 'Calendar'
      },
      {
        title: 'Estatísticas de Cliques',
        description: 'Saiba quais botões e serviços geram mais interesse.',
        icon: 'BarChart3'
      },
      {
        title: 'Domínio Próprio',
        description: 'Conecte seu endereço www.seunome.com.br diretamente.',
        icon: 'Globe'
      },
      {
        title: 'QR Code Inteligente',
        description: 'Gere placa de balcão e cartão em alta resolução.',
        icon: 'Sparkles'
      }
    ]
  },

  comparison: {
    title: 'Por que escolher o contate.site?',
    subtitle: 'Veja a diferença entre uma ferramenta pensada para o mercado brasileiro e alternativas genéricas.',
    headers: ['Recurso', 'contate.site', 'Linktree', 'Ferramentas Gringas'],
    rows: [
      {
        feature: '100% em Português (Brasil)',
        contate: 'Sim, nativo',
        contateCheck: true,
        competitor1: 'Parcial (traduzido)',
        competitor2: 'Não (inglês)'
      },
      {
        feature: 'Plano Grátis com Links Ilimitados',
        contate: 'Ilimitados',
        contateCheck: true,
        competitor1: 'Com limitações',
        competitor2: 'Muito limitado'
      },
      {
        feature: 'Taxa sobre vendas ou serviços',
        contate: 'R$ 0 (zero taxas)',
        contateCheck: true,
        competitor1: 'De 9% a 12%',
        competitor2: 'Taxas em dólar'
      },
      {
        feature: 'Foco em WhatsApp para Negócios',
        contate: 'WhatsApp-First',
        contateCheck: true,
        competitor1: 'Genérico',
        competitor2: 'Genérico'
      },
      {
        feature: 'Exige cartão para começar',
        contate: 'Não exige',
        contateCheck: true,
        competitor1: 'Não no free',
        competitor2: 'Geralmente sim'
      },
      {
        feature: 'Vídeos do YouTube embutidos',
        contate: 'Grátis e nativo',
        contateCheck: true,
        competitor1: 'Plano pago',
        competitor2: 'Plano pago'
      }
    ]
  },

  pricing: {
    title: 'Comece grátis. Simples assim.',
    subtitle: 'Divulgue seus serviços sem custos ocultos, pegadinhas ou cobranças surpresa.',
    freeCard: {
      name: 'Grátis para Sempre',
      price: 'R$ 0',
      period: 'sem cartão de crédito',
      badge: 'Disponível Agora',
      description: 'Tudo o que seu negócio precisa para atrair e converter clientes pela bio.',
      features: [
        'Links ilimitados com ordenação arrastar e soltar',
        'Vídeos do YouTube embutidos diretamente na página',
        '5 paletas de cores e temas modernos',
        'Painel simples otimizado para celular',
        'Carregamento ultrarrápido em redes 4G/5G',
        'Sem prazo de expiração'
      ],
      ctaText: 'Criar minha página grátis'
    },
    proCard: {
      name: 'Plano Pro',
      badge: 'Em Breve',
      price: 'Em Breve',
      period: 'recursos avançados',
      description: 'Para profissionais que buscam automações extras e domínio personalizado.',
      features: [
        'Tudo incluso no Plano Grátis',
        'Conexão de domínio próprio (.com.br)',
        'Botão Pix copia e cola instantâneo',
        'Relatórios detalhados de cliques e visitas',
        'Agendamento direto integrado'
      ],
      ctaText: 'Disponível em breve'
    }
  },

  faq: {
    title: 'Dúvidas Frequentes',
    subtitle: 'Tudo o que você precisa saber para começar a usar o contate.site hoje mesmo.',
    items: [
      {
        q: 'Quanto custa para usar o contate.site?',
        a: 'O contate.site é 100% gratuito. Você pode criar sua página, adicionar quantos links quiser, incluir vídeos e organizar seu contato sem pagar nada e sem precisar cadastrar cartão de crédito.'
      },
      {
        q: 'Serve para o meu tipo de negócio?',
        a: 'Sim! É perfeito para qualquer autônomo, prestador de serviços ou profissional liberal — como salões de beleza, barbearias, veterinários, pet shops, dentistas, psicólogos, personal trainers, manicures, esteticistas, fotógrafos, consultores e criadores de conteúdo.'
      },
      {
        q: 'Meus clientes precisam instalar algum aplicativo?',
        a: 'Não! Seus clientes só precisam clicar no link contate.site/seu-nome na sua bio do Instagram, TikTok ou WhatsApp. A página abre instantaneamente no navegador de qualquer celular ou computador.'
      },
      {
        q: 'Preciso saber programar ou mexer com design?',
        a: 'De forma alguma. O contate.site foi construído para ser o mais intuitivo e simples possível. Você monta sua página em menos de 2 minutos direto pelo celular, escolhendo as cores e adicionando seus links.'
      },
      {
        q: 'Como os clientes entram em contato comigo pela página?',
        a: 'Você pode adicionar links diretos para o seu WhatsApp (que abre a conversa imediatamente), mapa de localização, telefone, catálogo, redes sociais e vídeos. Ao tocar no botão, o cliente é direcionado no mesmo segundo.'
      }
    ]
  },

  finalCta: {
    title: 'Pronto para lotar sua agenda?',
    subtitle: 'Crie sua página profissional grátis agora mesmo — em menos tempo que um café.',
    ctaButton: 'Criar minha página grátis',
    guaranteeText: 'Leva apenas 2 minutos · Sem cartão de crédito'
  }
};
