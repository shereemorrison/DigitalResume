import { useEffect, useRef } from "react";
import { CvPage } from "./components/CvPage";
import { PhoneEmbedResume } from "./components/PhoneEmbedResume";
import { resume } from "./data/resume";
import styles from "./App.module.css";

export default function App() {
  const scrollRef = useRef({ progress: 0 });

  useEffect(() => {
    const label = resume.siteTabLabel.trim() || "SM";
    const lock = () => {
      if (document.title !== label) document.title = label;
    };
    lock();
    const obs = new MutationObserver(lock);
    obs.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => obs.disconnect();
  }, []);

  const isEmbed =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("embed") === "1";
  const hidePhoneMockup =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("iframe") === "1";

  if (isEmbed) {
    return <PhoneEmbedResume />;
  }

  return (
    <div className={styles.app}>
      <CvPage scrollRef={scrollRef} hidePhoneMockup={hidePhoneMockup} />
    </div>
  );
}
