/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://your-fitness-blog.com', // 本番URLに合わせて変更
  generateRobotsTxt: true,
  outDir: './public',
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/404'],
};
