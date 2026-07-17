// Single source of truth for the portfolio's static content. Edit this file to
// update your name, bio, work history, education, skills, competitive
// programming stats, and social links. The homepage and layouts read from here,
// so there is no need to touch markup for routine content changes.

export interface SocialLink {
    label: string;
    href: string;
    // Lucide icon name used in the floating dock (see https://lucide.dev/icons).
    icon: string;
}

export interface WorkItem {
    company: string;
    role: string;
    period: string;
    // Work arrangement + place, e.g. "Remote · Dhaka, Bangladesh".
    location: string;
    // Path (under public/) to the company logo, or null to fall back to a
    // monogram built from the company name.
    logo: string | null;
    points: string[];
}

export interface EducationItem {
    institution: string;
    // Each string renders on its own line (degree, major, CGPA, …) so long
    // details don't wrap awkwardly on any screen size.
    detail: string[];
    period: string;
    logo: string | null;
}

export interface ContestItem {
    // Contest/competition name (bolded in the list).
    name: string;
    // Team name or participation type, e.g. "Team: Aiub_BugBear" / "Individual".
    detail: string;
}

export interface CpItem {
    platform: string;
    handle: string;
    // Public profile URL the handle links to.
    profileUrl: string;
    // Rank title (e.g. "Pupil", "2 Star") shown in the platform's own color.
    rank: string;
    // Rank color, matched to the platform's rating tiers. [light, dark] so the
    // green/etc. stays legible in both themes.
    rankColor: [string, string];
    // Supporting detail after the rank, e.g. "max 1206".
    ratingDetail: string;
    note: string;
    // Path (under public/) to the platform logo.
    logo: string;
}



// Logos live in public/logos. Reference them with a leading slash; components
// join them to BASE_URL so they work in dev and on GitHub Pages.
export const profile = {
    name: "Foysal Munsy",
    greeting: "Hi, I'm Foysal",
    role: "Software Engineer",
    location: "Dhaka, Bangladesh",
    tagline:
        "Software engineer building dependable backends and full-stack products.",
    about:
        "CSE graduate specializing in Software Engineering, working across .NET and the TypeScript ecosystem. I care about correctness under load, clean architecture, and systems that fail gracefully. Alongside product work I compete in programming contests and do research when it matches with my interest.",
    email: "foysal613@outlook.com",
    avatar: "https://avatars.githubusercontent.com/u/77909562?v=4",
    github: "https://github.com/Foysal-Munsy",
    linkedin: "https://linkedin.com/in/foysal-munsy",
};

export const socials: SocialLink[] = [
    { label: "Email", href: `mailto:${profile.email}`, icon: "mail" },
    { label: "GitHub", href: profile.github, icon: "github" },
    { label: "LinkedIn", href: profile.linkedin, icon: "linkedin" },
];

export const work: WorkItem[] = [
    {
        company: "Credosis",
        role: "Software Engineer",
        period: "Apr 2026 - Present",
        location: "Remote · Dhaka, Bangladesh",
        logo: "/logos/credosis.jpg",
        points: [
            "Designing and building the in-house API and booking system with ASP.NET Core Web API.",
            "Built the company frontend with Next.js and TypeScript.",
            "Supervising software engineering interns during product development.",
        ],
    },
    {
        company: "Deepchain Labs",
        role: "Full Stack Engineer",
        period: "Dec 2025 - Mar 2026",
        location: "Remote · Dhaka, Bangladesh",
        logo: "/logos/deepchain.svg",
        points: [
            "Built multi-tenant auth, workspace creation, sprints and task allocation for Kazentic.",
            "Designed API endpoints and database structures around business logic.",
            "Developed sprint-management and time-tracker UI from Figma, wired to the backend.",
        ],
    },
];

export const education: EducationItem[] = [
    {
        institution: "American International University - Bangladesh",
        detail: [
            "BSc in Computer Science & Engineering",
            "Major in Software Engineering",
            "CGPA 3.61 / 4.00",
        ],
        period: "2022 - 2026",
        logo: "/logos/aiub.png",
    },
];

// Icons for each skill are resolved automatically from the label via the shared
// techIcons lookup (src/data/techIcons.ts), so the same logos appear here and
// on project tech tags. Add a skill by dropping its label in; wire a missing
// logo by adding it to that lookup.
export const skills: string[] = [
    "C#",
    ".NET / ASP.NET Core",
    "EF Core",
    "TypeScript",
    "Next.js",
    "NestJS",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
    "MSSQL",
    "Docker",
    "C++",
];

export const competitiveProgramming: CpItem[] = [
    {
        platform: "Codeforces",
        handle: "Mr_FM",
        profileUrl: "https://codeforces.com/profile/Mr_FM",
        rank: "Pupil",
        // Green rank color, legible in both themes.
        rankColor: ["#1a9c3e", "#4ac26b"],
        ratingDetail: "max 1206",

        note: "550+ problems solved and participated 50+ rated contests.",
        logo: "/logos/codeforces.png",
    },
    {
        platform: "CodeChef",
        handle: "mr_fm",
        profileUrl: "https://www.codechef.com/users/mr_fm",
        rank: "2★",
        // Same green as Codeforces for a consistent look.
        rankColor: ["#1a9c3e", "#4ac26b"],
        ratingDetail: "max 1540",

        note: "100+ problems solved and participated 20+ rated contests.",
        logo: "/logos/codechef.png",
    },
];


// A one-line "overall" summary shown above the CP platform rows, CV-style.
export const cpSummary =
    "1200+ DSA problems solved across various platforms and participated in 100+ online contests.";

// Notable contest participation, shown CV-style: the contest name in bold with
// the team/role as a muted suffix.
export const contests: ContestItem[] = [
    {
        name: "ICPC Dhaka Regional Preliminary 2023",
        detail: "Team: Aiub_BugBear",
    },
    {
        name: "NCPC Regional Preliminary 2023",
        detail: "Team: Aiub_BugBear",
    },
    {
        name: "Intra AIUB Programming Contest 2024",
        detail: "Mode: Individual",
    },
    {
        name: "Web Xtream Hackathon 2025",
        detail: "Team: Group_15",
    },
];

