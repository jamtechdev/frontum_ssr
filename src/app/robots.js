export default function robots() {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: 'https://mondopedia.it/sitemaps/pages.xml',
    }
  }