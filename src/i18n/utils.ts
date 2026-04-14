import es from './es';
import en from './en';

export type Lang = 'es' | 'en';
const translations = { es, en };

export function getLang(lang: Lang) {
  return translations[lang];
}

export function getNavLinks(lang: Lang, base: string) {
  if (lang === 'en') {
    return {
      home:     `${base}en/`,
      services: `${base}en/services`,
      projects: `${base}en/projects`,
      clients:  `${base}en/clients`,
      contact:  `${base}en/contact`,
    };
  }
  return {
    home:     base,
    services: `${base}servicios`,
    projects: `${base}proyectos`,
    clients:  `${base}clientes`,
    contact:  `${base}contacto`,
  };
}

export function getProjectHref(lang: Lang, base: string, slug: string) {
  if (lang === 'en') return `${base}en/projects/${slug}`;
  return `${base}proyectos/${slug}`;
}
