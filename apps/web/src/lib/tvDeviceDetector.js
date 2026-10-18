/**
 * Utilitário para detecção e telemetria de Smart TVs
 * Identifica WebOS (LG), Tizen (Samsung), Android TV, Fire TV, Roku e versão do Chromium.
 */

export function detectTvPlatform() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isTv: false,
      osName: 'Desconhecido',
      osVersion: '',
      brand: 'Desconhecido',
      chromiumVersion: null,
      fullLabel: 'Navegador Padrão'
    };
  }

  const ua = navigator.userAgent || '';

  let isTv = false;
  let osName = 'Desktop / Mobile';
  let osVersion = '';
  let brand = 'Genérico';
  let chromiumVersion = null;

  // 1. Extrair versão do Chromium / Chrome
  const chromeMatch = ua.match(/Chrome\/(\d+)\./i);
  if (chromeMatch) {
    chromiumVersion = parseInt(chromeMatch[1], 10);
  }

  // 2. Detecção de LG webOS
  if (/web0s|webos|netcast/i.test(ua)) {
    isTv = true;
    brand = 'LG';
    osName = 'webOS';
    const webosMatch = ua.match(/Web0S[/\s]?([0-9._]+)/i) || ua.match(/WebOS[/\s]?([0-9._]+)/i);
    if (webosMatch) {
      osVersion = webosMatch[1].replace(/_/g, '.');
    }
  }
  // 3. Detecção de Samsung Tizen
  else if (/tizen|samsung-smarttv|smart-tv/i.test(ua)) {
    isTv = true;
    brand = 'Samsung';
    osName = 'Tizen';
    const tizenMatch = ua.match(/Tizen[/\s]?([0-9._]+)/i);
    if (tizenMatch) {
      osVersion = tizenMatch[1].replace(/_/g, '.');
    }
  }
  // 4. Detecção de Android TV / Google TV / Fire OS
  else if (/Android.*TV|BRAVIA|AFTT|AFTM|AFTB|FireTV|MiBOX/i.test(ua)) {
    isTv = true;
    osName = /FireTV|AFT/i.test(ua) ? 'Fire OS' : 'Android TV';
    brand = /FireTV|AFT/i.test(ua) ? 'Amazon' : /BRAVIA/i.test(ua) ? 'Sony' : 'Android TV';
  }
  // 5. Genérico de Smart TV
  else if (/SmartTV|TV Safari|HbbTV|CrKey|Roku/i.test(ua)) {
    isTv = true;
    osName = /Roku/i.test(ua) ? 'Roku OS' : 'Smart TV';
    brand = /Roku/i.test(ua) ? 'Roku' : 'Smart TV';
  }

  const fullLabel = isTv
    ? `${brand} ${osName}${osVersion ? ' ' + osVersion : ''} ${chromiumVersion ? `(Chromium ${chromiumVersion})` : ''}`.trim()
    : 'Navegador Padrão';

  return {
    isTv,
    osName,
    osVersion,
    brand,
    chromiumVersion,
    fullLabel
  };
}
