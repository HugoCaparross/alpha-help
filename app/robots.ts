import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/perfil/',
        '/cuestionarios/',
        '/sesiones/',
        '/recursos/',
        '/estudio/',
        '/api/',
      ],
    },
    sitemap: 'https://alpha-help.org/sitemap.xml',
  };
}