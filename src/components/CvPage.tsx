import { useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { resume, type Job } from "../data/resume";
import { getPhoneIframeSrc } from "../lib/portfolioPreview";
import styles from "./CvPage.module.css";
import { BackgroundScene } from "./BackgroundScene";
import { PhoneBrowser } from "./PhoneBrowser";

gsap.registerPlugin(ScrollTrigger);

type ScrollRef = MutableRefObject<{ progress: number }>;

const NAV = [
  { href: "#hero-section", label: "Home" },
  { href: "#intro-section", label: "About" },
  { href: "#skills-section", label: "Skills" },
  { href: "#education-section", label: "Education" },
  { href: "#block-experience", label: "Technical experience" },
  { href: "#other-experience-section", label: "Other experience" },
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

function JobArticle({ job }: { job: Job }) {
  return (
    <article className={styles.jobCard} data-job>
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
  );
}

function OtherJobTile({ job }: { job: Job }) {
  return (
    <article className={styles.otherExpTile}>
      <h3 className={styles.otherExpCompany}>{job.company}</h3>
      <p className={styles.otherExpRole}>{job.role}</p>
      <span className={styles.otherExpMeta}>
        {job.location} · {job.period}
      </span>
      <p className={styles.otherExpSummary}>{job.summary}</p>
      {job.highlights.length > 0 ? (
        <ul className={styles.otherExpBullets}>
          {job.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

type Props = {
  scrollRef: ScrollRef;
  /** Set when this tree is loaded inside the About iframe (`?iframe=1`) so the nested phone is not rendered. */
  hidePhoneMockup?: boolean;
};

export function CvPage({ scrollRef, hidePhoneMockup = false }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroGridRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const introWrRef = useRef<HTMLDivElement>(null);
  const introCopyRef = useRef<HTMLDivElement>(null);
  const introPhoneRef = useRef<HTMLDivElement>(null);
  const expSectionRef = useRef<HTMLElement>(null);
  const otherExpSectionRef = useRef<HTMLElement>(null);

  const [l1, l2] = heroTitleLines(resume.title);
  const [n1, n2] = nameLines(resume.name);
  const phoneIframeSrc = useMemo(
    () => getPhoneIframeSrc(resume.phonePreviewMode, resume.portfolioUrl),
    [resume.phonePreviewMode, resume.portfolioUrl]
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const isPhonePreviewShell = hidePhoneMockup;

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

    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      const heroGrid = heroGridRef.current;
      const heroName = heroNameRef.current;
      const intro = introRef.current;
      const introWr = introWrRef.current;
      const introCopy = introCopyRef.current;
      const expSection = expSectionRef.current;
      const otherExpSection = otherExpSectionRef.current;

      const pinEnd = otherExpSection ?? expSection;
      if (!isPhonePreviewShell && hero && pinEnd) {
        ScrollTrigger.create({
          trigger: hero,
          endTrigger: pinEnd,
          pin: true,
          start: "top top",
          end: "bottom bottom",
          pinSpacing: false,
        });
      }

      if (!isPhonePreviewShell && heroGrid && intro) {
        const fadePrev = gsap.timeline();
        const fadeHeroTargets = heroName ? [heroGrid, heroName] : [heroGrid];
        fadePrev.fromTo(fadeHeroTargets, { opacity: 1 }, { opacity: 0, ease: "none" });
        ScrollTrigger.create({
          trigger: intro,
          start: "top 58%",
          end: "top 10%",
          scrub: 1,
          animation: fadePrev,
          pinSpacing: false,
        });
      }

      if (!isPhonePreviewShell && introCopy && intro) {
        gsap.from(introCopy, {
          y: 32,
          opacity: 0,
          duration: 0.52,
          ease: "power2.out",
          scrollTrigger: {
            trigger: intro,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      }

      const introPhone = introPhoneRef.current;
      if (!isPhonePreviewShell && introPhone && intro) {
        gsap.set(introPhone, { transformPerspective: 1100, force3D: true });
        gsap.fromTo(
          introPhone,
          {
            xPercent: 42,
            rotationY: -38,
            rotationX: 10,
            rotationZ: -2,
            yPercent: 18,
            scale: 0.72,
            opacity: 0.12,
          },
          {
            xPercent: 0,
            rotationY: 0,
            rotationX: 0,
            rotationZ: 0,
            yPercent: 0,
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: intro,
              start: "top bottom",
              end: "center 36%",
              scrub: 0.9,
            },
          }
        );
      }

      if (!isPhonePreviewShell && expSection && introWr) {
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
      }

      if (!isPhonePreviewShell) {
        const jobCards = root.querySelectorAll<HTMLElement>("[data-job]");
        jobCards.forEach((card) => {
          gsap.from(card, {
            y: 36,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
        });
      }
    }, root);

    ScrollTrigger.refresh();
    requestAnimationFrame(() => ScrollTrigger.refresh());

    if (isPhonePreviewShell) {
      lenis.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => {
        lenis.scrollTo(0, { immediate: true });
      });
    }

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(ticker);
      gsap.ticker.lagSmoothing(500);
      lenis.destroy();
    };
  }, [scrollRef, hidePhoneMockup]);

  return (
    <div
      ref={rootRef}
      className={styles.page}
      {...(hidePhoneMockup ? { "data-iframe-preview": "" } : {})}
    >
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
          {resume.resumeDownloadHref ? (
            <a
              className={styles.navResume}
              href={resume.resumeDownloadHref}
              download="Sheree-Morrison-Resume.pdf"
              onClick={() => setMenuOpen(false)}
            >
              Download resume
            </a>
          ) : null}
          <div className={styles.navContact}>
            <a href={`mailto:${resume.email}`}>{resume.email}</a>
            <a href={`tel:+44${resume.phone.replace(/^0/, "")}`}>{resume.phone}</a>
          </div>
        </div>
      </nav>

      <section ref={heroRef} id="hero-section" className={styles.hero}>
        <div ref={heroGridRef} className={styles.heroGrid}>
          <div className={styles.heroGlobe} aria-hidden>
            <div className={styles.heroGlobeInner}>
              <BackgroundScene />
            </div>
          </div>
          <h1 className={styles.heroTitle}>
            <span>{l1}</span>
            <span>{l2}</span>
          </h1>
        </div>
        <h2 ref={heroNameRef} className={styles.heroName}>
          <span>{n1}</span>
          {n2 ? <span>{n2}</span> : null}
        </h2>
      </section>

      <div
        className={`${styles.introSkillsChapter} ${hidePhoneMockup ? styles.introSkillsChapterNoPhone : ""}`}
      >
        <section ref={introRef} id="intro-section" className={styles.intro}>
          <div className={styles.sectionInner}>
            <div ref={introWrRef} className={styles.introContent}>
              <h2 className={styles.introTitle}>About me</h2>
              <div ref={introCopyRef} className={styles.introCopy}>
                <p className={styles.introBig}>
                  {resume.summary}
                </p>
                <div className={styles.introActions}>
                  <a className={styles.btn} href={`mailto:${resume.email}`}>
                    Email me
                  </a>
                  <a className={styles.btn} href={`tel:+44${resume.phone.replace(/^0/, "")}`}>
                    Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills-section" className={styles.skillsBlock}>
          <div className={styles.sectionInner}>
            <div className={styles.skillsBlockLayout}>
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
              <div className={styles.skillsEducationCol}>
                <h3 id="education-section" className={styles.educationTitle}>
                  Education
                </h3>
                <ul className={styles.eduTimelineVertical}>
                  {resume.education.map((edu) => (
                    <li key={`${edu.degree}-${edu.institution}`} className={styles.eduTimelineVertItem}>
                      <div className={styles.eduTimelineVertRail}>
                        <span className={styles.eduTimelineNode} aria-hidden />
                      </div>
                      <div className={styles.eduTimelineVertBody}>
                        {edu.year ? <p className={styles.eduTimelineYear}>{edu.year}</p> : null}
                        <p className={styles.eduDegree}>{edu.degree}</p>
                        <span className={styles.eduInstitution}>
                          {edu.institution}
                          {edu.note ? ` · ${edu.note}` : ""}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {!hidePhoneMockup ? (
          <div className={styles.phoneChapterRail}>
            <div ref={introPhoneRef} className={styles.phoneStage}>
              <div className={styles.phoneDevice}>
                <div className={styles.phoneRim} />
                <div className={styles.phoneIsland} aria-hidden />
                <div className={styles.phoneScreen}>
                  <PhoneBrowser
                    url={phoneIframeSrc}
                    title={`${resume.siteTabLabel} preview`}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <section ref={expSectionRef} id="block-experience" className={styles.experience}>
        <div className={styles.sectionInner}>
          <h2 className={styles.experienceTitle}>Technical experience</h2>
          {resume.experience.map((job) => (
            <JobArticle key={`${job.company}-${job.period}`} job={job} />
          ))}
        </div>
      </section>

      <section ref={otherExpSectionRef} id="other-experience-section" className={styles.otherExperience}>
        <div className={styles.sectionInner}>
          <h2 className={styles.otherExperienceTitle}>Other experience</h2>
        </div>
        <div className={styles.otherExperienceGrid}>
          {resume.otherExperience.map((job) => (
            <OtherJobTile key={`${job.company}-${job.period}`} job={job} />
          ))}
        </div>
      </section>

      <footer id="site-footer" className={styles.footer}>
        <span>Sheree Morrison</span>
        {" · "}
        <a href="https://github.com/shereemorrison">GitHub</a>
        {" · "}
        <span>07440168734 · shereemorrison@outlook.com</span>
      </footer>
    </div>
  );
}