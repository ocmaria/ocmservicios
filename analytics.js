(() => {
  'use strict';
  const id = window.OCM_ANALYTICS_ID;
  if (!/^G-[A-Z0-9]+$/.test(id || '')) return;
  const key = 'ocm-analytics-consent-v1';
  let consent;
  try { consent = localStorage.getItem(key); } catch (_) {}
  let started = false;
  window.dataLayer = window.dataLayer || [];
  function tag() { window.dataLayer.push(arguments); }
  function event(name, parameters) {
    if (consent === 'accepted' && started) tag('event', name, parameters);
  }
  function start() {
    if (started) return;
    started = true;
    window['ga-disable-' + id] = false;
    tag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    tag('js', new Date());
    tag('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    event('page_view', { page_location: location.origin + location.pathname, page_title: document.title });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }
  const panel = document.createElement('aside');
  panel.className = 'analytics-consent';
  panel.setAttribute('aria-label', 'Preferencias de analítica');
  panel.innerHTML = '<p>Nos ayudas a mejorar la web si aceptas cookies de Google Analytics para medir visitas y clics. Es opcional. No enviamos tu nombre ni el contenido de tus mensajes. Puedes cambiar tu elección en el pie de página. <a href="analitica.html">Información sobre analítica y cookies</a>.</p><div><button type="button" data-choice="accepted">Aceptar analítica</button><button type="button" data-choice="rejected">Rechazar analítica</button></div>';
  panel.hidden = consent === 'accepted' || consent === 'rejected';
  document.body.append(panel);
  panel.addEventListener('click', e => {
    const button = e.target.closest('[data-choice]');
    if (!button) return;
    consent = button.dataset.choice;
    try { localStorage.setItem(key, consent); } catch (_) {}
    panel.hidden = true;
    if (consent === 'accepted') start();
    else {
      window['ga-disable-' + id] = true;
      if (started) tag('consent', 'update', { analytics_storage: 'denied' });
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (!/^_ga(?:_|$)/.test(name)) return;
        const domains = [null, location.hostname, '.' + location.hostname, '.ocmservicios.com'];
        domains.forEach(domain => { document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : ''); });
      });
    }
  });
  const preferences = document.createElement('button');
  preferences.type = 'button';
  preferences.className = 'analytics-preferences';
  preferences.textContent = 'Preferencias de analítica';
  preferences.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button').focus(); });
  document.querySelector('footer').append(preferences);
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    const section = link.closest('section');
    const parameters = { section: section ? section.id || 'inicio' : link.classList.contains('mobile-whatsapp') ? 'boton_movil' : 'cabecera' };
    if (/^https:\/\/wa\.me\//.test(href)) event('whatsapp_click', parameters);
    else if (/^tel:/.test(href)) event('phone_click', parameters);
  });
  if ('IntersectionObserver' in window) {
    const seen = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || consent !== 'accepted' || seen.has(entry.target.id)) return;
        seen.add(entry.target.id);
        event('section_view', { section: entry.target.id });
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
  if (consent === 'accepted') start();
})();

