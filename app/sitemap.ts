import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.seawithinyourself.com';

  return [
    {
      url: baseUrl,
      priority: 1,
    },
    {
      url: `${baseUrl}/reveal`,
      priority: 0.9,
    },
  ];
}