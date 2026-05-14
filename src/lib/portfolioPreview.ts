/**
 * iPhone mockup preview URL. Prefer `VITE_PORTFOLIO_URL` in `.env` so deploys
 * can point at the real GitHub Pages path without editing `resume.ts`.
 */
export function resolvePortfolioPreviewUrl(configured: string): string {
  const fromEnv = (import.meta.env.VITE_PORTFOLIO_URL as string | undefined)?.trim();
  if (fromEnv) return fromEnv;
  return configured?.trim() ?? "";
}

export type PhonePreviewMode = "self-embed" | "external-url";

/**
 * `self-embed`: iPhone loads this site with `?iframe=1#hero-section` (resume from top; no nested phone).
 * `external-url`: iframes `portfolioUrl` (must be HTTPS and allow framing).
 */
export function getPhoneIframeSrc(mode: PhonePreviewMode, portfolioUrl: string): string {
  if (mode === "self-embed" && typeof window !== "undefined") {
    const base = import.meta.env.BASE_URL || "/";
    const trimmed = base.replace(/\/$/, "");
    const shell = "?iframe=1#hero-section";
    if (trimmed === "" || trimmed === "/") {
      return `${window.location.origin}/${shell}`;
    }
    return `${window.location.origin}${trimmed}/${shell}`;
  }
  return resolvePortfolioPreviewUrl(portfolioUrl);
}

/** Avoid infinite iframe: same-origin only for `?embed=1` (compact) or `?iframe=1` (full page shell). */
export function canEmbedInIframe(url: string): boolean {
  if (!url) return false;
  try {
    const target = new URL(url, typeof window !== "undefined" ? window.location.href : "https://localhost/");
    if (typeof window === "undefined") return true;
    if (target.origin !== window.location.origin) return true;
    const mode = target.searchParams.get("embed") === "1" || target.searchParams.get("iframe") === "1";
    return mode;
  } catch {
    return false;
  }
}
