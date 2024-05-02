export default async function sitemap() {
  const staticRoutes = ["", "/liked", "/search"].map((route) => ({
    url: `https://melodi-mix.vercel.app${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...staticRoutes];
}
