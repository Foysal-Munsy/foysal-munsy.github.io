// Central lookup that maps a technology label to an Iconify icon name, so both
// the Skills section and project "tech" tags render the same proper, colored
// brand logos.
//
// Icon sets in use (all installed as @iconify-json/*):
//   - "logos:*"        full-color brand logos (preferred)
//   - "simple-icons:*" monochrome brand marks that follow the text color
//                      (used when a colored logo is pure black/white and would
//                      disappear in one theme, e.g. Next.js)
//   - "lucide:*"       generic outline icons for things without a brand logo
//
// Keys are matched case-insensitively against the tech label. If a label has no
// entry here, the badge simply renders without an icon.
const TECH_ICONS: Record<string, string> = {
    // Languages
    "c#": "logos:c-sharp",
    "c++": "logos:c-plusplus",
    typescript: "logos:typescript-icon",
    javascript: "logos:javascript",
    python: "logos:python",

    // .NET ecosystem
    ".net": "logos:dotnet",
    ".net 8": "logos:dotnet",
    ".net / asp.net core": "logos:dotnet",
    "asp.net core": "logos:dotnet",
    "asp.net web api": "logos:dotnet",
    "ef core": "simple-icons:dotnet",
    "entity framework": "simple-icons:dotnet",
    serilog: "lucide:scroll-text",
    "3-tier architecture": "lucide:layers-3",

    // JS/TS frameworks & runtimes
    "next.js": "simple-icons:nextdotjs",
    nextjs: "simple-icons:nextdotjs",
    nestjs: "logos:nestjs",
    "node.js": "logos:nodejs-icon",
    nodejs: "logos:nodejs-icon",
    react: "logos:react",

    // Databases
    postgresql: "logos:postgresql",
    postgres: "logos:postgresql",
    mongodb: "logos:mongodb-icon",
    mssql: "simple-icons:microsoftsqlserver",
    "mssql server": "simple-icons:microsoftsqlserver",
    "sql server": "simple-icons:microsoftsqlserver",
    redis: "logos:redis",

    // Infra & tooling
    docker: "logos:docker-icon",
    kubernetes: "logos:kubernetes",
    render: "lucide:cloud",
    tailwind: "logos:tailwindcss-icon",
    "tailwind css": "logos:tailwindcss-icon",
    astro: "logos:astro-icon",
    git: "logos:git-icon",
    github: "simple-icons:github",
    figma: "logos:figma",
    prisma: "logos:prisma",
    graphql: "logos:graphql",
    jwt: "logos:jwt-icon",
    swagger: "logos:swagger",
    "swagger ui": "logos:swagger",
    brevo: "lucide:mail",
    "google calendar api": "logos:google-calendar",

    // ML / CV
    pytorch: "logos:pytorch-icon",
    tensorflow: "logos:tensorflow",
    opencv: "logos:opencv",
    yolov9: "lucide:scan-eye",
};


export function iconForTech(label: string): string | undefined {
    return TECH_ICONS[label.trim().toLowerCase()];
}
