import { createRoot } from "react-dom/client";
import "lenis/dist/lenis.css";
import App from "./App";
import "./theme/theme.css";
import "./index.css";
import { ThemeProvider } from "./theme";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
