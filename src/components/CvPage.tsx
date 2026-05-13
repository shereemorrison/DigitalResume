import { useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SplitType from "split-type";
import { resume } from "../data/resume";
import styles from "./CvPage.module.css";
import { BackgroundScene } from "./BackgroundScene";

gsap.registerPlugin(ScrollTrigger);

type ScrollRef = MutableRefObject<{ progress: number }>;

const NAV = [
  { href: "#hero-section", label: "Home" },
  { href: "#intro-section", label: "About" },
  { href: "#skills-section", label: "Skills" },
  { href: "#block-experience", label: "Experience" },
];

function heroTitleLines(title: string): [string, string] {
  const parts = title.trim().split(/\s+/);
  if (parts.length >= 2) {
    return [parts[0].toUpperCase(), parts.slice(1).join(" ").toUpperCase()];
  }
  return [title.toUpperCase(), "DEVELOPER"];
}

function nameLines(full: string): [string, string] {
  const parts = full.trim().split(/\s+/);
  if (parts.length >= 2) {
    return [parts[0].toUpperCase(), parts.slice(1).join(" ").toUpperCase()];
  }
  return [full.toUpperCase(), ""];
}

type Props = { scrollRef: ScrollRef };

export function CvPage({ scrollRef }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroGridRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const heroPanelRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const introWrRef = useRef<HTMLDivElement>(null);
  const intro1Ref = useRef<HTMLParagraphElement>(null);
  const introBtnsRef = useRef<HTMLDivElement>(null);
  const expSectionRef = useRef<HTMLElement>(null);
  const expTitleRef = useRef<HTMLDivElement>(null);

  const [l1, l2] = heroTitleLines(resume.title);
  const [n1, n2] = nameLines(resume.name);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      anchors: true,
    });

    const onLenisScroll = (inst: Lenis) => {
      scrollRef.current.progress = inst.progress;
      if (barRef.current) barRef.current.style.transform = `scaleX(${inst.progress})`;
      ScrollTrigger.update();
    };
    lenis.on("scroll", onLenisScroll);

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const splits: SplitType[] = [];

    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      const heroGrid = heroGridRef.current;
      const heroVisual = heroVisualRef.current;
      const panel = heroPanelRef.current;
      const navLinks = heroGrid?.querySelectorAll<HTMLElement>("[data-hero-tab]") ?? [];
      const intro = introRef.current;
      const introWr = introWrRef.current;
      const intro1 = intro1Ref.current;
      const introBtns = introBtnsRef.current;
      const expSection = expSectionRef.current;
      const expTitle = expTitleRef.current;

      let lines1: HTMLElement[] = [];

      if (intro1) {
        const s1 = new SplitType(intro1, { types: "lines" });
        splits.push(s1);
        lines1 = (s1.lines ?? []) as HTMLElement[];
      }
  const lineEls = [...lines1];


      const heroTl = gsap.timeline();
      if (panel && heroVisual) {
        const r = heroVisual.getBoundingClientRect();

        if (r.width === 0 || r.height === 0) {
          // slot hasn't painted yet — skip intro, just place it
          panel.classList.add(styles.heroPanelSlotted);
          if (navLinks.length) gsap.set(navLinks, { opacity: 1 });
        } else {
          if (navLinks.length) heroTl.set(navLinks, { opacity: 0 });
          heroTl.fromTo(
            panel,
            {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              opacity: 1,
            },
            {
              top: r.top,
              left: r.left,
              width: r.width,
              height: r.height,
              duration: 0.85,
              ease: "power2.inOut",
              onComplete: () => {
                panel.classList.add(styles.heroPanelSlotted);
              },
            },
            0.15
          );
          if (navLinks.length) {
            heroTl.to(navLinks, { opacity: 1, stagger: { each: 0.12 }, duration: 0.45 }, ">-0.2");
          }
        }
      } else if (navLinks.length) {
        gsap.set(navLinks, { opacity: 1 });
      }

      if (hero && expSection) {
        ScrollTrigger.create({
          trigger: hero,
          endTrigger: expSection,
          pin: true,
          start: "top top",
          end: "bottom bottom",
          pinSpacing: false,
        });
      }

      if (heroGrid && intro) {
        const fadePrev = gsap.timeline();
        fadePrev.fromTo(heroGrid, { opacity: 1 }, { opacity: 0, ease: "none" });
        ScrollTrigger.create({
          trigger: intro,
          start: "top 55%",
          end: "top 12%",
          scrub: 1,
          animation: fadePrev,
          pinSpacing: false,
        });
      }

      if (introWr && intro) {
        gsap.set(introWr, { opacity: 0 });
        if (lineEls.length) gsap.set(lineEls, { yPercent: 100, rotate: 3 });
        if (introBtns) gsap.set(introBtns, { yPercent: 110 });

        const introTl = gsap.timeline();
        introTl.to(introWr, { opacity: 1, duration: 0.35 });
        introTl.to(
          lineEls,
          { yPercent: 0, rotate: 0, stagger: { each: 0.08 }, duration: 0.55, ease: "power2.out" },
          ">+0.2"
        );
        if (introBtns) {
          introTl.to(introBtns, { yPercent: 0, duration: 0.5, ease: "power2.out" }, ">-0.1");
        }

        ScrollTrigger.create({
          trigger: intro,
          start: "top 70%",
          end: "top top",
          scrub: 1,
          animation: introTl,
          pinSpacing: false,
        });
      }

      if (expSection && expTitle && introWr) {
        const fadeIntro = gsap.timeline();
        fadeIntro.fromTo(introWr, { opacity: 1 }, { opacity: 0, ease: "none" });
        ScrollTrigger.create({
          trigger: expSection,
          start: "top 55%",
          end: "top 12%",
          scrub: 1,
          animation: fadeIntro,
          pinSpacing: false,
        });

        ScrollTrigger.create({
          trigger: expSection,
          endTrigger: expSection,
          pin: expTitle,
          start: "top top",
          end: "bottom bottom",
          pinSpacing: false,
        });
      }

      const pills = root.querySelectorAll("[data-skill-pill]");
      if (pills.length) {
        gsap.from(pills, {
          scale: 0.88,
          opacity: 0,
          duration: 0.4,
          stagger: { each: 0.03, from: "random" },
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: "#skills-section",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      const jobs = root.querySelectorAll("[data-job]");
      if (jobs.length) {
        gsap.from(jobs, {
          y: 40,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#block-experience",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, root);

    ScrollTrigger.refresh();
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(ticker);
      gsap.ticker.lagSmoothing(500);
      lenis.destroy();
    };
  }, [scrollRef]);

  return (
    <div ref={rootRef} className={styles.page}>
      <div className={styles.progressTrack}>
        <div ref={barRef} className={styles.progressBar} />
      </div>

      <nav className={styles.nav} aria-label="Primary">
        <button
          type="button"
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
        <ul className={`${styles.navList} ${menuOpen ? styles.navListOpen : ""}`}>
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                className={styles.navLink}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.navRight}>
          <div className={styles.navContact}>
            <a href={`mailto:${resume.email}`}>{resume.email}</a>
            <a href={`tel:+44${resume.phone.replace(/^0/, "")}`}>{resume.phone}</a>
          </div>
        </div>
      </nav>

      <section ref={heroRef} id="hero-section" className={styles.hero}>
        <div ref={heroGridRef} className={styles.heroGrid}>
          <h1 className={styles.heroTitle}>
            <span>{l1}</span>
            <span>{l2}</span>
          </h1>
          <div ref={heroPanelRef} className={styles.heroPanel} aria-hidden>
            <div ref={heroVisualRef} style={{ width: "100%", height: "100%" }}>
              <BackgroundScene scrollRef={scrollRef} />
            </div>
          </div>
          <h2 className={styles.heroName}>
            <span>{n1}</span>
            {n2 ? <span>{n2}</span> : null}
          </h2>
        </div>
      </section>

      <section ref={introRef} id="intro-section" className={styles.intro}>
        <div ref={introWrRef} className={styles.introInner}>
          <h2 className={styles.introTitle}>Who am I</h2>
          <div className={styles.introGrid}>
            <p ref={intro1Ref} className={styles.introBig}>
              {resume.summary}
            </p>
            <div ref={introBtnsRef} className={styles.introActions}>
              <a className={styles.btn} href={`mailto:${resume.email}`}>
                Email me
              </a>
              <a className={styles.btn} href={`tel:+44${resume.phone.replace(/^0/, "")}`}>
                Call
              </a>
            </div>
          </div>
          </div>
      </section>

      <section id="skills-section" className={styles.skillsBlock}>
        <div className={styles.skillsInner}>
          <h2 className={styles.skillsTitle}>Technical skills</h2>
          <ul className={styles.skillTags}>
            {resume.skillCategories.map((cat) => (
              <li key={cat.label} className={styles.skillCategory}>
                <span className={styles.skillCategoryLabel}>{cat.label}</span>
                {cat.items.map((item) => (
                  <span key={item} className={styles.skillTag}>{item}</span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.education}>
        <div className={styles.educationInner}>
          <h2 className={styles.educationTitle}>Education</h2>
          <ul className={styles.eduList}>
            {resume.education.map((edu) => (
              <li key={edu.degree} className={styles.eduItem}>
                <p className={styles.eduDegree}>{edu.degree}</p>
                <span className={styles.eduInstitution}>
                  {edu.institution}{edu.note ? ` · ${edu.note}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section ref={expSectionRef} id="block-experience" className={styles.experience}>
        <div ref={expTitleRef} className={styles.expTitleBar}>
          <h2 className={styles.expTitle}>Experience</h2>
        </div>
        <div className={styles.expInner}>
          {resume.experience.map((job) => (
            <article key={`${job.company}-${job.period}`} className={styles.jobCard} data-job>
              <h3 className={styles.jobRole}>{job.role}</h3>
              <span className={styles.jobMeta}>
                {job.company} · {job.location} · {job.period}
              </span>
              <p className={styles.jobSummary}>{job.summary}</p>
              {job.highlights.length > 0 ? (
                <ul className={styles.jobBullets}>
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        Sheree Morrison{" "}
        <a href="https://github.com/shereemorrison"></a> · 07440168734 · shereemorrison@outlook.com
      </footer>
    </div>
  );
}