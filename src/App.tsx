import { useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { BackgroundScene } from "./components/BackgroundScene";
import { CvPage } from "./components/CvPage";
import styles from "./App.module.css";

const R3F_HOST_ID = "r3f-bg";

export default function App() {
  const scrollRef = useRef({ progress: 0 });

  const r3fHost = useMemo(() => {
    if (typeof document === "undefined") return null;
    return document.getElementById(R3F_HOST_ID);
  }, []);

  return (
    <div className={styles.app}>
      {r3fHost ? createPortal(<BackgroundScene scrollRef={scrollRef} />, r3fHost) : null}
      <CvPage scrollRef={scrollRef} />
    </div>
  );
}
