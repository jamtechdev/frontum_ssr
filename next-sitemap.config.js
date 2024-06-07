module.exports = {
  siteUrl: "https://mondopedia.it/",
  generateRoutes: ["/sitemaps/pages.xml"],
};

paths: [
  { loc: "/", lastmod: new Date(), changefrequency: "daily", priority: 0.7 },
  {
    loc: "/about-us",
    lastmod: new Date(),
    changefrequency: "monthly",
    priority: 0.8,
  },
  {
    loc: "/contact-us",
    lastmod: new Date(),
    changefrequency: "monthly",
    priority: 0.5,
  },
];

transform: (config) => {
  // Modify configurations for specific URLs (e.g., based on route names)
  config.paths.forEach((path) => {
    if (path.loc === "/about-us") {
      path.changefrequency = "weekly";
      path.priority = 0.9;
    }
  });
  return config;
};
