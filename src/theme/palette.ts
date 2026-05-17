/** Brand palette — shared by light mode and referenced in docs. */
export const palette = {
  lilac: "#E9D5FF",
  purple: "#7E22CE",
  purpleDeep: "#4C1D95",
  ink: "#2A2A2A",
  amber: "#FBBF24",
} as const;

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "resume-theme";

export const DEFAULT_THEME: ThemeMode = "dark";
