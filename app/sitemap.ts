import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alpha-help.org';

  const routes = [
    '',
    '/faq',
    '/contacto',
    '/login',
    '/register',
    '/politica-privacidad',
    '/politica-cookies',
    '/aviso-legal',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
