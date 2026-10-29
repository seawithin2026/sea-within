
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
    {
      url: `${baseUrl}/about-sea-within.html`,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/legal`,
      priority: 0.5,
    },
  ];
}
