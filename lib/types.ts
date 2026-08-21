export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string;
};

export type EducationItem = {
  id: string;
  school: string;
  degree: string;
  location: string;
  start: string;
  end: string;
  details: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  url: string;
  description: string;
};

export type CertificateItem = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type ResumeData = {
  personal: {
    fullName: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
    photo: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  skills: string[];
};

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const emptyResume = (): ResumeData => ({
  personal: {
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
    photo: "",
  },
  experience: [],
  education: [],
  projects: [],
  certificates: [],
  skills: [],
});

export const sampleResume = (): ResumeData => ({
  personal: {
    fullName: "Alexandra Morgan",
    headline: "Senior Software Engineer",
    email: "alexandra.morgan@email.com",
    phone: "(415) 555-0132",
    location: "San Francisco, CA",
    website: "alexandramorgan.dev",
    photo: "",
    summary:
      "Results-driven software engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Proven track record of shipping high-impact products, improving performance, and mentoring junior engineers. Passionate about clean architecture and developer experience.",
  },
  experience: [
    {
      id: newId(),
      role: "Senior Software Engineer",
      company: "Lumina Systems",
      location: "San Francisco, CA",
      start: "Jan 2021",
      end: "Present",
      bullets:
        "Led migration of a legacy monolith to a microservices architecture serving 4M+ monthly users\nImproved page load times by 60% through code-splitting and caching strategies\nMentored a team of 5 engineers and established code review and testing standards",
    },
    {
      id: newId(),
      role: "Software Engineer",
      company: "Northwind Labs",
      location: "Oakland, CA",
      start: "Jun 2018",
      end: "Dec 2020",
      bullets:
        "Built and shipped 12+ features across a React/TypeScript product suite\nReduced bug report rate by 35% by introducing automated end-to-end tests\nCollaborated with design to build a reusable component library adopted by 4 product teams",
    },
  ],
  education: [
    {
      id: newId(),
      school: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      location: "Berkeley, CA",
      start: "2014",
      end: "2018",
      details: "GPA 3.8/4.0 · Dean's List · ACM Programming Team",
    },
  ],
  projects: [
    {
      id: newId(),
      name: "OpenSource Metrics",
      url: "github.com/alexandramorgan/oss-metrics",
      description:
        "Open-source dashboard that aggregates contributor analytics across GitHub repositories; 1,200+ GitHub stars.",
    },
  ],
  certificates: [
    {
      id: newId(),
      name: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2022",
    },
  ],
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "GraphQL",
    "PostgreSQL",
    "Docker",
    "AWS",
    "CI/CD",
    "System Design",
  ],
});

const marketingResume = (): ResumeData => ({
  personal: {
    fullName: "Marcus Chen",
    headline: "Digital Marketing Manager",
    email: "marcus.chen@email.com",
    phone: "(312) 555-0148",
    location: "Chicago, IL",
    website: "marcuschen.co",
    photo: "",
    summary:
      "Data-driven marketing manager with 6+ years growing brands through SEO, paid media, and email campaigns. Grew organic traffic 3x and cut customer acquisition cost by 28%. Expert at leading small teams and translating analytics into revenue.",
  },
  experience: [
    {
      id: newId(),
      role: "Digital Marketing Manager",
      company: "Brightwave Agency",
      location: "Chicago, IL",
      start: "Mar 2020",
      end: "Present",
      bullets:
        "Grew organic traffic by 3x and doubled qualified leads through an SEO content strategy\nCut customer acquisition cost by 28% by reallocating paid budgets to best-performing channels\nLed a team of 4 marketers and managed a $1.2M annual budget",
    },
    {
      id: newId(),
      role: "SEO Specialist",
      company: "Cascade Retail",
      location: "Chicago, IL",
      start: "Jun 2018",
      end: "Feb 2020",
      bullets:
        "Raised keyword rankings for 400+ search terms and boosted e-commerce revenue by 35%\nBuilt automated reporting dashboards that saved the team 10 hours per week",
    },
  ],
  education: [
    {
      id: newId(),
      school: "Northwestern University",
      degree: "B.A. in Communications",
      location: "Evanston, IL",
      start: "2014",
      end: "2018",
      details: "Minor in Data Science",
    },
  ],
  projects: [
    {
      id: newId(),
      name: "Content ROI Tracker",
      url: "github.com/marcuschen/roi-tracker",
      description:
        "Open-source tool that attributes revenue to content pieces; used by 200+ marketers.",
    },
  ],
  certificates: [
    {
      id: newId(),
      name: "Google Analytics Certification",
      issuer: "Google",
      year: "2021",
    },
  ],
  skills: [
    "SEO",
    "SEM",
    "Google Analytics",
    "Content Strategy",
    "Email Marketing",
    "Facebook Ads",
    "Google Ads",
    "A/B Testing",
    "Copywriting",
    "HubSpot",
  ],
});

const managerResume = (): ResumeData => ({
  personal: {
    fullName: "Priya Patel",
    headline: "Operations & Program Manager",
    email: "priya.patel@email.com",
    phone: "(646) 555-0179",
    location: "New York, NY",
    website: "linkedin.com/in/priyapatel",
    photo: "",
    summary:
      "Operations leader with 9 years of experience scaling programs, improving processes, and building high-performing teams. Cut operating costs by 22% and improved on-time delivery to 98% across 3 departments. Known for data-driven decision-making and cross-functional collaboration.",
  },
  experience: [
    {
      id: newId(),
      role: "Operations Manager",
      company: "Meridian Logistics",
      location: "New York, NY",
      start: "Jan 2021",
      end: "Present",
      bullets:
        "Reduced operating costs by 22% by renegotiating vendor contracts and streamlining workflows\nImproved on-time delivery from 84% to 98% by redesigning the fulfillment pipeline\nManaged a team of 25 across warehouse and dispatch",
    },
    {
      id: newId(),
      role: "Program Coordinator",
      company: "Citywide Health Alliance",
      location: "New York, NY",
      start: "Jul 2017",
      end: "Dec 2020",
      bullets:
        "Coordinated 40+ community programs serving 50,000 residents annually\nSecured $750K in grant funding and reported outcomes to funders",
    },
  ],
  education: [
    {
      id: newId(),
      school: "Columbia University",
      degree: "MBA",
      location: "New York, NY",
      start: "2015",
      end: "2017",
      details: "Focus in Operations Management",
    },
  ],
  projects: [
    {
      id: newId(),
      name: "Warehouse Digitization",
      url: "",
      description:
        "Led rollout of barcode tracking across 3 warehouses, cutting inventory errors by 65%.",
    },
  ],
  certificates: [
    {
      id: newId(),
      name: "PMP Certification",
      issuer: "PMI",
      year: "2019",
    },
    {
      id: newId(),
      name: "Lean Six Sigma Green Belt",
      issuer: "ASQ",
      year: "2018",
    },
  ],
  skills: [
    "Project Management",
    "Process Improvement",
    "Budgeting",
    "Vendor Management",
    "Supply Chain",
    "Data Analysis",
    "Team Leadership",
    "Excel",
    "Lean / Six Sigma",
    "Stakeholder Communication",
  ],
});

const graduateResume = (): ResumeData => ({
  personal: {
    fullName: "Jordan Lee",
    headline: "Recent Graduate — Marketing & Data",
    email: "jordan.lee@email.com",
    phone: "(503) 555-0164",
    location: "Portland, OR",
    website: "jordanlee.dev",
    photo: "",
    summary:
      "Motivated recent graduate with a B.S. in Marketing Analytics and hands-on internship experience in social media and data reporting. Strong foundation in analytics tools, campaign coordination, and team projects. Eager to apply research and creativity to a growing brand.",
  },
  experience: [
    {
      id: newId(),
      role: "Marketing Intern",
      company: "Bloomfield Coffee Co.",
      location: "Portland, OR",
      start: "Jun 2024",
      end: "Aug 2024",
      bullets:
        "Grew Instagram following by 40% over 3 months with a content calendar\nCompiled weekly campaign reports in Google Analytics and Excel for the marketing lead\nAssisted in planning 2 product launch events with 300+ attendees",
    },
  ],
  education: [
    {
      id: newId(),
      school: "University of Oregon",
      degree: "B.S. in Marketing Analytics",
      location: "Eugene, OR",
      start: "2020",
      end: "2024",
      details: "GPA 3.7/4.0 · Dean's List (4 semesters)",
    },
  ],
  projects: [
    {
      id: newId(),
      name: "Campus Brand Audit",
      url: "",
      description:
        "Analyzed student organization branding across social channels and proposed a unified strategy adopted by 5 clubs.",
    },
  ],
  certificates: [
    {
      id: newId(),
      name: "Google Data Analytics Certificate",
      issuer: "Coursera",
      year: "2024",
    },
  ],
  skills: [
    "Excel",
    "Google Analytics",
    "Canva",
    "Social Media Marketing",
    "Data Reporting",
    "SEO Basics",
    "Market Research",
    "Public Speaking",
  ],
});

export type CoverLetterData = {
  recipientName: string;
  company: string;
  position: string;
  date: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderLocation: string;
  opening: string;
  body: string;
  closing: string;
};

export const emptyCoverLetter = (): CoverLetterData => ({
  recipientName: "",
  company: "",
  position: "",
  date: "",
  senderName: "",
  senderEmail: "",
  senderPhone: "",
  senderLocation: "",
  opening: "",
  body: "",
  closing: "",
});

export const sampleCoverLetter = (): CoverLetterData => ({
  recipientName: "Hiring Manager",
  company: "Acme Corporation",
  position: "Senior Software Engineer",
  date: new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  senderName: "(Your name)",
  senderEmail: "you@email.com",
  senderPhone: "(555) 123-4567",
  senderLocation: "City, ST",
  opening: "Dear Hiring Manager,",
  body:
    "I am writing to express my strong interest in the Senior Software Engineer position at Acme Corporation. With over 8 years of experience building scalable web applications and leading high-performing teams, I am confident I can contribute to your mission from day one.\n\nIn my current role I led the migration of a legacy monolith serving 4M+ monthly users to a modern microservices architecture, improving page load times by 60%. I am particularly drawn to Acme's focus on developer experience and would love to bring the same impact to your team.\n\nI would welcome the opportunity to discuss how my background aligns with the needs of your organization. Thank you for your time and consideration.",
  closing: "Sincerely,",
});

export function coverLetterFromResume(r: ResumeData): CoverLetterData {
  const base = sampleCoverLetter();
  return {
    ...base,
    senderName: r.personal.fullName || base.senderName,
    senderEmail: r.personal.email || base.senderEmail,
    senderPhone: r.personal.phone || base.senderPhone,
    senderLocation: r.personal.location || base.senderLocation,
  };
}

export type SampleProfile = {
  id: string;
  name: string;
  build: () => ResumeData;
};

export const SAMPLE_PROFILES: SampleProfile[] = [
  { id: "developer", name: "Software Developer", build: sampleResume },
  { id: "marketing", name: "Marketing Specialist", build: marketingResume },
  { id: "manager", name: "Operations Manager", build: managerResume },
  { id: "freshgrad", name: "Recent Graduate", build: graduateResume },
];

