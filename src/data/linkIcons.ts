// Resolves a sensible default icon for a project link based on its label, so
// content files can list links without spelling out an icon each time. An
// explicit `icon` on the link always wins; this is only the fallback.
//
// Icons use the same sets as techIcons (lucide/simple-icons), already installed.
const LABEL_ICONS: Array<{ match: RegExp; icon: string }> = [
  { match: /source|code|repo|github/i, icon: "simple-icons:github" },
  { match: /api|docs|scalar|swagger|documentation/i, icon: "lucide:file-code" },
  {
    match: /case study|write.?up|read more|details/i,
    icon: "lucide:book-open",
  },
  { match: /demo|video|youtube/i, icon: "lucide:play" },
  { match: /website|live|site|visit|app/i, icon: "lucide:globe" },
];

export function iconForLink(label: string, explicit?: string): string {
  if (explicit) return explicit;
  const hit = LABEL_ICONS.find((e) => e.match.test(label));
  // Generic external-link icon when nothing matches.
  return hit?.icon ?? "lucide:external-link";
}
