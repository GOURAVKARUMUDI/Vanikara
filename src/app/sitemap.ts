import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vanikara-web.vercel.app';
  
  const routes = [
    '',
    '/about',
    '/projects',
    '/products',
    '/ai',
    '/careers',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
    '/refund',
    '/security',
    '/legal',
    '/press',
    '/brand',
    '/investors',
    '/faq',
    '/status',
    '/changelog',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
