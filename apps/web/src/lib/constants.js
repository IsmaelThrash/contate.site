
export const RESERVED_SLUGS = [
    'dashboard',
    'login',
    'signup',
    'admin',
    'api',
    'settings',
    'account',
    'profile',
    'config',
    'logout',
    'perfil',
    'usuarios',
    'links',
    'help',
    'support',
    'contact',
    'contato',
    'about',
    'blog',
    'legal',
    'privacy',
    'terms',
    'root',
    'index',
    'home',
    'search',
    'explore',
    'notifications',
    'messages',
    'auth',
    'register',
    'recover',
    'reset-password'
];

export const isReservedSlug = (slug) => {
    return RESERVED_SLUGS.includes(slug.toLowerCase().trim());
};
