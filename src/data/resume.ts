export type Job = {
  role: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
};

export type SkillCategory = {
  label: string;
  items: string[];
};

export type Education = {
  degree: string;
  institution: string;
  note?: string;
};

export type ResumeData = {
  name: string;
  title: string;
  phone: string;
  location: string;
  workRights: string;
  email: string;
  links: { label: string; href: string }[];
  summary: string;
  skillCategories: SkillCategory[];
  experience: Job[];
  education: Education[];
};

export const resume: ResumeData = {
  name: "Sheree Morrison",
  title: "Junior Software Developer",
  phone: "07440168734",
  location: "Warrington",
  workRights: "Full UK working rights",
  email: "shereemorrison@outlook.com",
  links: [],
  summary:
    "Junior Developer with experience building responsive, user-focused interfaces using SwiftUI, Flutter and JavaScript. Strong focus on clean, maintainable code and translating complex data into clear, functional UI components. Experienced working with APIs and collaborating in cross-functional teams.",
  skillCategories: [
    {
      label: "Languages",
      items: ["HTML, CSS", "Swift", "Dart", "JavaScript / TypeScript", "SQL"],
    },
    {
      label: "Frameworks & Libraries",
      items: ["SwiftUI & UIKit", "Flutter", "React", "Svelte"],
    },
    {
      label: "Architecture & Practices",
      items: ["MVVM Architecture", "API Integration", "Responsive Design", "Code Review (GitHub / GitLab)"],
    },
    {
      label: "Tools & IDEs",
      items: ["Xcode", "Android Studio", "VS Code", "Jira & Confluence", "Figma"],
    },
  ],
  experience: [
    {
      role: "Software Developer (Traineeship)",
      company: "Seventh Beam",
      location: "Melbourne, VIC",
      period: "Feb 2025 — Feb 2026",
      summary: "Developed iOS and cross-platform applications using SwiftUI and Flutter with focus on MVVM architecture.",
      highlights: [
        "Integrated third-party SDKs and RESTful APIs.",
        "Built responsive UI components and dashboards displaying dynamic data from APIs.",
        "Focused on clean layout structure and performance across devices.",
      ],
    },
    {
      role: "Settlements Officer",
      company: "Angle Finance",
      location: "Melbourne, VIC",
      period: "Jul 2021 — Nov 2023",
      summary: "Settlement disbursements and lending operations with a compliance lens.",
      highlights: [
        "AML/KYC compliance checks and settlement disbursements.",
        "Coordinated contract generation.",
        "Developed strong attention to detail and process management skills.",
      ],
    },
    {
      role: "Transcriptionist",
      company: "Ubiqus",
      location: "Remote",
      period: "Jan 2019 — Jul 2021",
      summary: "Verbatim and high-accuracy transcripts from varied audio sources.",
      highlights: [
        "Maintained high accuracy standards while managing multiple projects.",
        "Created verbatim transcripts from various audio sources.",
      ],
    },
    {
      role: "HR / Crew Coordinator",
      company: "Inco Ships",
      location: "Sydney, NSW",
      period: "Dec 2017 — Dec 2019",
      summary: "Workforce coordination, documentation, and payroll support for maritime crews.",
      highlights: [
        "Managed rostering and workforce planning systems.",
        "Generated engagement confirmations and workplace agreements.",
        "Organised training and licenses; provided payroll assistance.",
      ],
    },
  ],
  education: [
    {
      degree: "Diploma of Information Technology",
      institution: "Kangan Institute",
      note: "Work-based traineeship",
    },
    {
      degree: "Certificate IV in Information Technology",
      institution: "Kangan Institute",
    },
    {
      degree: "Bachelor of Laws (LLB)",
      institution: "University of Sheffield",
    },
  ],
};