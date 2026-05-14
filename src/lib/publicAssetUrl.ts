/** Resolves `public/` paths for `import.meta.env.BASE_URL` (e.g. GitHub Pages subpaths). */
export function publicAssetUrl(path: string): string {
  const trimmed = path.replace(/^\/+/, "");
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/?$/, "/");
  return `${base}${trimmed}`;
}
