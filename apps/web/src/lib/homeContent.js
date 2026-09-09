/**
 * Centralized content and copy data for contate.site homepage
 * Official Homologated Option 1 Text & SEO-Optimized Structure
 */

export const homeContent = {
  seo: {
    title: 'contate.site — O Melhor Link da Bio para o Seu Negócio (100% Grátis)',
    description: 'Crie seu link da bio grátis em 2 minutos. Centralize suas redes sociais, catálogo de serviços, vídeos e formas de contato numa página moderna e profissional sem taxas.',
    canonical: 'https://contate.site/',
    keywords: 'link da bio, link na bio, pagina de links, cartao de visita digital gratis, arvore de links, alternativa linktree brasil, catalogo digital bio instagram'
  },

  nav: {
    links: [
      { label: 'Como Funciona', href: '#como-funciona' },
      { label: 'Nichos & Modelos', href: '#exemplos' },
      { label: 'Recursos', href: '#recursos' },
      { label: 'Comparativo', href: '#comparativo' },
      { label: 'Plano Grátis', href: '#planos' },
      { label: 'FAQ', href: '#faq' },
    ],
    loginText: 'Entrar',
    ctaText: 'Criar página grátis'
  },

  hero: {
    badge: '✦ Centralize tudo o que você faz em um só lugar',
    titleLine1: 'Seus clientes encontram tudo',
    titleHighlight: 'em um único link na bio.',
    subtitle: 'Centralize suas redes sociais, catálogo de serviços, vídeos e formas de contato em uma página moderna criada em 2 minutos direto do celular. 100% grátis e sem complicação.',
    reservationPrefix: 'contate.site/',
    reservationPlaceholder: 'seu-nome',
    ctaButton: 'Garantir meu link grátis',
    guarantees: [
      '100% Gratuito',
      'Sem cartão de crédito',
      'Pronta em 2 minutos',
      'Zero taxas sobre serviços'
    ]
  },

  profiles: {
    beleza: {
      id: 'beleza',
      tabLabel: 'Beleza & Estética',
      name: 'Studio Bella Hair',
      role: 'Salão & Estética VIP',
      initials: 'SB',
      rating: '4.9',
      reviewsCount: '88 avaliações',
      avatarGradient: 'from-rose-500 to-pink-600',
      bannerGradient: 'from-rose-500/90 via-pink-600/80 to-rose-700',
      socialProof: '📅 Atendimentos todos os dias',
      benefitHeadline: 'Atendimento direto sem perder mensagens no direct',
      benefitText: 'Clientes tocam no link, conhecem seus serviços e entram em contato direto com você em um toque.',
      links: [
        { label: '💬 Atendimento & Agendamento', type: 'whatsapp', primary: true },
        { label: '✂️ Tabela de Preços & Procedimentos', type: 'link' },
        { label: '📍 Localização do Espaço no Maps', type: 'link' },
        { label: '📹 Vídeo: Tendências de Mechas 2026', type: 'video' }
      ]
    },
    pet: {
      id: 'pet',
      tabLabel: 'Pet & Veterinária',
      name: 'Dra. Ana Costa',
      role: 'Veterinária & Cirurgiã',
      initials: 'AC',
      rating: '4.9',
      reviewsCount: '120+ tutores',
      avatarGradient: 'from-emerald-500 to-teal-600',
      bannerGradient: 'from-emerald-600/90 via-teal-600/80 to-emerald-800',
      socialProof: '⭐ 4,9 no Google (+120 avaliações)',
      benefitHeadline: 'Atendimento rápido e orientações em um só lugar',
      benefitText: 'Tutores encontram orientações rápidas, botão de emergência 24h e agendamento de consultas e vacinas no primeiro toque.',
      links: [
        { label: '💬 Falar no WhatsApp', type: 'whatsapp', primary: true },
        { label: '🚨 Plantão de Emergência 24h', type: 'emergency' },
        { label: '🐾 Dicas de Saúde no Instagram', type: 'link' },
        { label: '📹 Vídeo: Cuidados Essenciais com Filhotes', type: 'video' }
      ]
    },
    saude: {
      id: 'saude',
      tabLabel: 'Saúde & Odonto',
      name: 'Dr. Carlos Lima',
      role: 'Odontologia & Implantes',
      initials: 'CL',
      rating: '5.0',
      reviewsCount: '500+ pacientes',
      avatarGradient: 'from-cyan-600 to-blue-700',
      bannerGradient: 'from-cyan-600/90 via-blue-600/80 to-indigo-800',
      socialProof: '👥 +500 pacientes atendidos',
      benefitHeadline: 'Credibilidade e profissionalismo imediato',
      benefitText: 'Apresente seus tratamentos, localização da clínica e canais de contato para transmitir total confiança.',
      links: [
        { label: '🦷 Avaliação & Consulta', type: 'whatsapp', primary: true },
        { label: '😁 Galeria: Antes e Depois', type: 'link' },
        { label: '📍 Como Chegar & Estacionamento', type: 'link' },
        { label: '📹 Conheça Nossa Estrutura', type: 'video' }
      ]
    },
    criador: {
      id: 'criador',
      tabLabel: 'Criador & Mídia',
      name: 'Rafa Santos',
      role: 'Conteúdo & Tecnologia',
      initials: 'RS',
      rating: '4.9',
      reviewsCount: '210 mil inscritos',
      avatarGradient: 'from-indigo-600 to-blue-700',
      bannerGradient: 'from-indigo-600/90 via-blue-600/80 to-slate-900',
      socialProof: '🔥 Novo conteúdo toda semana',
      benefitHeadline: 'Toda a sua audiência conectada em um só lugar',
      benefitText: 'Divulgue seus vídeos mais recentes, podcasts, canais comunitários e facilite o contato para parcerias e patrocínios.',
      links: [
        { label: '▶ Assistir Último Vídeo no YouTube', type: 'video', primary: true },
        { label: '🎧 Ouvir Podcast no Spotify', type: 'link' },
        { label: '💼 Mídia Kit & Propostas Comerciais', type: 'link' },
        { label: '💬 Canal Exclusivo no Telegram', type: 'link' }
      ]
    }
  },

  segments: {
    label: 'A vitrine digital ideal para o seu nicho:',
    items: [
      { name: 'Criadores & Influenciadores', icon: 'Video' },
      { name: 'Dentistas & Clínicas Médicas', icon: 'Stethoscope' },
      { name: 'Veterinários & Pet Shops', icon: 'HeartPulse' },
      { name: 'Manicures, Lash & Estética', icon: 'Sparkles' },
      { name: 'Barbearias & Salões de Beleza', icon: 'Scissors' },
      { name: 'Personal Trainers & Academias', icon: 'Dumbbell' },
      { name: 'Nutricionistas & Terapeutas', icon: 'Apple' },
      { name: 'Fotógrafos & Produtoras', icon: 'Camera' }
    ]
  },

  howItWorks: {
    title: 'Como criar seu link da bio profissional em 3 passos',
    subtitle: 'Sem complicação técnica e sem precisar de computador. Você configura tudo direto no celular durante o café.',
    steps: [
      {
        number: '01',
        title: 'Escolha seu endereço único',
        description: 'Defina seu link exclusivo contate.site/seu-nome e crie sua conta gratuitamente em menos de 1 minuto.'
      },
      {
        number: '02',
        title: 'Adicione seus links e redes',
        description: 'Cadastre suas redes sociais, canais de contato, catálogo de produtos, localização no Google Maps e vídeos do YouTube.'
      },
      {
        number: '03',
        title: 'Divulgue na bio e onde quiser',
        description: 'Adicione seu link no Instagram, TikTok, canais de mensagens e materiais impressos. Seus seguidores encontram tudo em um só toque.'
      }
    ]
  },

  features: {
    title: 'Tudo que o seu negócio precisa, sem complicação',
    subtitle: 'Desenvolvido para quem quer valorizar sua presença digital, reunir seus projetos e facilitar o acesso dos clientes.',
    real: [
      {
        title: 'Links e Botões Ilimitados',
        description: 'Adicione quantos botões de contato, catálogo, portfólio e redes precisar. Reordene com arrastar e soltar facilmente.',
        icon: 'Link2',
        badge: 'Disponível'
      },
      {
        title: 'Vídeos do YouTube Embutidos',
        description: 'Mostre seu trabalho, procedimentos, depoimentos ou apresentação em vídeo sem o visitante sair da sua página.',
        icon: 'PlayCircle',
        badge: 'Disponível'
      },
      {
        title: 'Temas Modernos em Alta Definição',
        description: 'Paletas elegantes com estética dark e clean pensadas para valorizar sua autoridade e passar confiança imediata.',
        icon: 'Palette',
        badge: 'Disponível'
      },
      {
        title: 'Edição 100% Otimizada para Celular',
        description: 'Painel leve e ultrarrápido. Atualize horários, adicione novos serviços e troque links de onde estiver em segundos.',
        icon: 'Smartphone',
        badge: 'Disponível'
      }
    ],
    upcomingTitle: 'Em breve para turbinar ainda mais seu atendimento:',
    upcoming: [
      {
        title: 'Chave Pix Copia e Cola',
        description: 'Receba pagamentos e sinais de agendamento instantaneamente com 1 toque.',
        icon: 'QrCode'
      },
      {
        title: 'Agendamento Direto Integrado',
        description: 'Visualização de dias e horários livres com confirmação automática.',
        icon: 'Calendar'
      },
      {
        title: 'Estatísticas de Cliques e Visitas',
        description: 'Saiba exatamente quais botões e links geram mais faturamento.',
        icon: 'BarChart3'
      },
      {
        title: 'Domínio Personalizado .com.br',
        description: 'Conecte seu próprio site profissional diretamente ao seu perfil.',
        icon: 'Globe'
      },
      {
        title: 'QR Code Inteligente para Balcão',
        description: 'Gere display de balcão e cartão de visita em alta resolução para impressão.',
        icon: 'Sparkles'
      }
    ]
  },

  comparison: {
    title: 'contate.site vs Linktree: Por que somos melhores?',
    subtitle: 'Veja a diferença prática entre uma solução 100% brasileira pensada para o seu público e ferramentas gringas genéricas.',
    headers: ['Funcionalidade', 'contate.site', 'Linktree', 'Outras Ferramentas'],
    rows: [
      {
        feature: '100% em Português e Suporte BR',
        contate: 'Sim, nativo',
        contateCheck: true,
        competitor1: 'Parcial (traduzido)',
        competitor2: 'Em inglês'
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
        competitor2: 'Cobranças em dólar'
      },
      {
        feature: 'Recursos Essenciais 100% Liberados',
        contate: 'Sem bloqueios',
        contateCheck: true,
        competitor1: 'Muitos recursos pagos',
        competitor2: 'Muito restrito'
      },
      {
        feature: 'Exige Cartão de Crédito no Cadastro',
        contate: 'Não exige',
        contateCheck: true,
        competitor1: 'Não no free',
        competitor2: 'Frequentemente sim'
      },
      {
        feature: 'Vídeos do YouTube Embutidos Grátis',
        contate: 'Grátis e nativo',
        contateCheck: true,
        competitor1: 'Apenas no pago',
        competitor2: 'Apenas no pago'
      }
    ]
  },

  pricing: {
    title: 'Comece grátis. Sem pegadinhas, sem taxas.',
    subtitle: 'Divulgue seus serviços, atraia mais clientes e fortaleça sua marca sem custos ocultos.',
    freeCard: {
      name: 'Grátis para Sempre',
      price: 'R$ 0',
      period: 'sem cartão de crédito',
      badge: 'Disponível Agora',
      description: 'Tudo o que seu negócio precisa para atrair e converter clientes pela bio.',
      features: [
        'Links ilimitados com ordenação arrastar e soltar',
        'Vídeos do YouTube embutidos diretamente na página',
        'Temas e paletas profissionais homologadas',
        'Painel simples e responsivo para celular',
        'Carregamento instantâneo em conexões 4G/5G',
        'Sem prazo de validade ou expiração'
      ],
      ctaText: 'Criar minha página grátis'
    },
    proCard: {
      name: 'Plano Pro VIP',
      badge: 'Em Breve',
      price: 'Em Breve',
      period: 'recursos premium',
      description: 'Para profissionais que buscam automações avançadas e domínio personalizado.',
      features: [
        'Tudo incluso no Plano Grátis',
        'Conexão de domínio próprio (.com.br)',
        'Botão Pix copia e cola instantâneo',
        'Métricas analíticas de cliques e conversão',
        'Agendamento direto com notificações automáticas'
      ],
      ctaText: 'Entrar na lista VIP'
    }
  },

  faq: {
    title: 'Dúvidas Frequentes sobre o contate.site',
    subtitle: 'Tudo o que você precisa saber para reunir seus links e profissionalizar sua presença digital hoje mesmo.',
    items: [
      {
        q: 'Como colocar o link do contate.site na bio do Instagram ou TikTok?',
        a: 'É muito simples: você cria sua conta grátis em menos de 2 minutos, adiciona seus links, redes sociais, formas de contato ou catálogo. Depois, basta copiar o endereço contate.site/seu-nome e colar no campo "Links" da bio do seu Instagram, TikTok ou onde desejar.'
      },
      {
        q: 'Quanto custa para usar o contate.site? É grátis mesmo?',
        a: 'Sim, é 100% gratuito! Você pode criar sua página, adicionar quantos links quiser, incluir vídeos e organizar suas redes sem pagar mensalidade e sem precisar cadastrar cartão de crédito.'
      },
      {
        q: 'O contate.site é uma boa alternativa ao Linktree?',
        a: 'Com certeza! O contate.site foi desenvolvido sob medida para quem busca uma página de links rápida, moderna e sem as limitações de ferramentas estrangeiras. Enquanto outras plataformas cobram em dólar ou bloqueiam recursos básicos no plano gratuito, o contate.site oferece links ilimitados, vídeos embutidos, integração com todas as suas redes e carregamento ultrarrápido — 100% em português e sem taxas sobre seu trabalho.'
      },
      {
        q: 'Serve para o meu tipo de negócio ou serviço autônomo?',
        a: 'Sim! É ideal para qualquer profissional autônomo, criador ou empresa: lojas, salões de beleza, barbearias, dentistas, clínicas médicas, veterinários, pet shops, personal trainers, psicólogos, fotógrafos, nutricionistas, advogados, consultores e criadores de conteúdo.'
      },
      {
        q: 'Meus clientes precisam baixar ou instalar algum aplicativo?',
        a: 'Não! Seus visitantes só precisam tocar no seu link na bio. A página abre instantaneamente no navegador de qualquer celular ou computador, sem necessidade de cadastro ou download.'
      },
      {
        q: 'Preciso ter conhecimentos de informática ou design para montar minha página?',
        a: 'Nenhum! O painel foi projetado para ser usado direto na tela do smartphone com facilidade total. Você só precisa preencher seu nome, escolher suas cores e colar os links que deseja exibir.'
      },
      {
        q: 'Que tipo de links e conteúdos posso colocar na minha página?',
        a: 'Tudo o que o seu negócio ou projeto precisa! Você pode adicionar links para todas as suas redes sociais (Instagram, TikTok, YouTube), canais de atendimento direto (como WhatsApp, Telegram e e-mail), catálogos, cardápios digitais, localização no Google Maps e até vídeos que rodam direto na página sem o visitante precisar sair.'
      }
    ]
  },

  finalCta: {
    title: 'Pronto para profissionalizar sua presença digital?',
    subtitle: 'Crie sua página profissional grátis agora mesmo — em menos tempo do que preparar um café.',
    ctaButton: 'Criar minha página grátis',
    guaranteeText: 'Leva apenas 2 minutos · Sem cartão de crédito · 100% Grátis'
  }
};
