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
  /** Shown on the timeline under the node (e.g. year or range). */
  year?: string;
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
  /** Primary development role (e.g. current traineeship). */
  technicalexperience: Job[];
  /** Earlier roles outside the primary dev track. */
  otherExperience: Job[];
  education: Education[];
  /** Public URL for PDF download */
  resumeDownloadHref?: string;
};

export const resume: ResumeData = {
  name: "Sheree Morrison",
  title: "Aspiring Front-End Developer",
  phone: "07440168734",
  location: "Warrington",
  workRights: "Full UK working rights",
  email: "shereemorrison@outlook.com",
  links: [],
  portfolioUrl: "https://shereemorrison.github.io/DigitalResume/",
  resumeDownloadHref: "/resume.pdf",
  phonePreviewMode: "self-embed",
  siteTabLabel: "SM",
  heroCharacterMode: "reference-gltf",
  summary:
    "Junior Developer with experience building responsive, user-focused interfaces using SwiftUI, Flutter and JavaScript. Strong focus on clean, maintainable code and translating complex data into clear, functional UI components. Experienced working with APIs and collaborating in cross-functional teams.",
  skillCategories: [
    {
      label: "Languages",
      items: ["Swift", "Dart", "JavaScript/TypeScript", "HTML, CSS", "SQL"],
    },
    {
      label: "Frameworks & Libraries",
      items: ["SwiftUI & UIKit", "Flutter", "React", "Svelte"],
    },
    {
      label: "Architecture & Practices",
      items: ["MVVM Architecture", "API Integration", "Responsive Design", "Code Review (GitHub/GitLab)"],
    },
    {
      label: "Tools & IDEs",
      items: ["Xcode", "Android Studio", "VS Code", "Jira & Confluence", "Figma"],
    },
  ],
  experience: [
    {
      role: "Trainee Software Developer",
      company: "Seventh Beam",
      location: "Melbourne, VIC",
      period: "Feb 2025 — Feb 2026",
      summary:
        "Developed iOS and cross-platform applications using SwiftUI and Flutter.",
      highlights: [
        "Integrated third-party SDKs and RESTful APIs.",
        "Built responsive UI components and dashboards displaying dynamic data from APIs.",
        "Focused on clean layout structure and performance across devices.",
      ],
    },
  ],
  otherExperience: [
    {
      role: "Settlements Officer",
      company: "Angle Finance",
      location: "Melbourne, VIC",
      period: "Jul 2021 — Nov 2023",
      summary: "Settlement disbursements and lending operations with a compliance lens.",
      highlights: [
        "AML/KYC compliance checks",
        "Settlement disbursements",
        "Contract generation.",
        "Following this role, I returned to study",
      ],
    },
    {
      role: "Transcriptionist",
      company: "Ubiqus",
      location: "Remote",
      period: "Jan 2019 — Jul 2021",
      summary: "Verbatim transcripts from varied audio sources.",
      highlights: [
        "Maintained high accuracy standards while managing multiple projects.",
        "Created verbatim transcripts from various audio sources including, but not limited to, court hearings and HR disciplinaries.",
      ],
    },
    {
      role: "HR / Crew Coordinator",
      company: "Inco Ships",
      location: "Sydney, NSW",
      period: "Dec 2017 — Dec 2019",
      summary: "Workforce planning/coordination, and payroll support for maritime crews.",
      highlights: [
        "Managed rostering and workforce planning, including travel arrangements and resume vetting.",
        "Generated engagement confirmations and workplace agreements.",
        "Organised training and licenses; provided payroll assistance.",
        "Ensured qualification/licence compliance/validity"
      ],
    },
    {
      role: "Database and Donor Services Coordinator",
      company: "Centenary Institute",
      location: "Sydney, NSW",
      period: "Dec 2015 — Jul 2016",
      summary: "CRM and donor database administration with migration support between platforms.",
      highlights: [
        "Maintained CRM systems and donor database.",
        "Assisted with Salesforce to Raiser's Edge migration including data mapping.",
      ],
    },
    {
      role: "Claims Handler",
      company: "Chance Hunter Solicitors",
      location: "Manchester, UK",
      period: "Jan 2011 — Sep 2014",
      summary: "Workplace claims - sole responsibility for c. 100 cases at any given time",
      highlights: [
        "Investigated claims, including reviewing medical and workplace records",
        "Engaged in settlement negotiations.",
        "Drafted client and third-party correspondence, witness statements, and briefs to counsel.",
      ],
    },
  ],
  education: [
    {
      degree: "Diploma of Information Technology",
      institution: "Kangan Institute",
      note: "Work-based traineeship",
      year: "2025",
    },
    {
      degree: "Certificate IV in Information Technology",
      institution: "Kangan Institute",
      year: "2024",
    },
    {
      degree: "Bachelor of Laws (LLB)",
      institution: "University of Sheffield",
      year: "2009",
    },
  ],
};
