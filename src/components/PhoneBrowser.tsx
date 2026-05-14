import { useLayoutEffect, useRef } from "react";
import { canEmbedInIframe } from "../lib/portfolioPreview";
import styles from "./PhoneBrowser.module.css";

/** Logical iPhone 13 mini-ish viewport for the live preview iframe. */
const IFRAME_W = 390;
const IFRAME_H = 844;

type Props = {
  url: string;
  title?: string;
};

export function PhoneBrowser({ url, title = "Portfolio preview" }: Props) {
  const browserRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = browserRef.current;
    if (!el) return;

    const setScale = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 4 || h < 4) {
        el.style.setProperty("--phone-scale", "1");
        return;
      }
      /** Contain: full page visible inside the glass (no horizontal crop / bright edge bleed). */
      const fit = Math.min(w / IFRAME_W, h / IFRAME_H);
      const scale = Math.min(4, Math.max(0.1, Math.ceil(fit * 2000) / 2000));
      el.style.setProperty("--phone-scale", String(scale));
    };

    setScale();
    const ro = new ResizeObserver(setScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!url) {
    return <div className={styles.placeholder} aria-hidden />;
  }

  if (!canEmbedInIframe(url)) {
    return (
      <div className={styles.fallback}>
        <p className={styles.fallbackText}>
          Live preview is turned off here so the page does not load inside itself.
        </p>
        <a className={styles.fallbackLink} href={url} target="_blank" rel="noreferrer">
          Open site
        </a>
      </div>
    );
  }

  return (
    <div ref={browserRef} className={styles.browser}>
      <iframe
        title={title}
        src={url}
        className={styles.iframe}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
