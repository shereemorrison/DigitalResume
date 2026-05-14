import { useLayoutEffect } from "react";
import { resume } from "../data/resume";
import styles from "./PhoneEmbedResume.module.css";

/** Compact CV for `?embed=1` — loaded inside the About iPhone iframe (no WebGL, no nested phone). */
export function PhoneEmbedResume() {
  const allJobs = [...resume.experience, ...resume.otherExperience];

  useLayoutEffect(() => {
    if (window.location.hash !== "#embed-skills") return;
    requestAnimationFrame(() => {
      document.getElementById("embed-skills")?.scrollIntoView({ block: "start", behavior: "auto" });
    });
  }, []);

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <h1 className={styles.roleHeading}>{resume.title}</h1>
        <p className={styles.meta}>
          {resume.location} · {resume.workRights}
        </p>
        <div className={styles.links}>
          <a href={`mailto:${resume.email}`}>{resume.email}</a>
          <a href={`tel:+44${resume.phone.replace(/^0/, "")}`}>{resume.phone}</a>
          <a href="https://github.com/shereemorrison" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Summary</h2>
        <p className={styles.p}>{resume.summary}</p>
      </section>

      <section id="embed-skills" className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <ul className={styles.skills}>
          {resume.skillCategories.map((cat) => (
            <li key={cat.label}>
              <span className={styles.cat}>{cat.label}</span>
              {cat.items.join(" · ")}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Education</h2>
        {resume.education.map((edu) => (
          <p key={edu.degree} className={styles.edu}>
            <span className={styles.eduDeg}>{edu.degree}</span>
            {" · "}
            {edu.institution}
            {edu.note ? ` · ${edu.note}` : ""}
          </p>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Technical experience</h2>
        {allJobs.map((job) => (
          <div key={`${job.company}-${job.period}`} className={styles.job}>
            <p className={styles.jobLine}>
              {job.role} — {job.company}
            </p>
            <p className={styles.jobMeta}>
              {job.location} · {job.period}
            </p>
            <p className={styles.p}>{job.summary}</p>
            {job.highlights.length > 0 ? (
              <ul className={styles.bullets}>
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      <p className={styles.tagline}>Embedded preview · full site in main window</p>
    </div>
  );
}
