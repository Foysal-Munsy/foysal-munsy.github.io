// Progressive enhancement for research rows.
//
// OpenAlex (https://openalex.org) exposes citation metadata by DOI over a
// CORS-open, keyless API, so a static GitHub Pages site can show live numbers
// with no server. This script hydrates three kinds of element, all keyed off a
// clean DOI in a data-doi attribute:
//
//   .oa-authors  the real author byline of a work
//   .oa-count    its cited-by count
//   .oa-cite     a <details> panel whose BibTeX and APA are built on open
//   .oa-total    a summed citation total across the page's works
//
// Everything is an enhancement: if the fetch fails or JS is off, the rows just
// keep their server-rendered content and the totals stay hidden.

type Work = {
    title?: string;
    publication_year?: number;
    cited_by_count?: number;
    doi?: string;
    authorships?: {
        author?: { display_name?: string };
        author_position?: string;
    }[];
    primary_location?: { source?: { display_name?: string } } | null;
    biblio?: { volume?: string; issue?: string; first_page?: string; last_page?: string };
};

// Author name to highlight in bylines. Kept in sync with profile.name in
// src/data/resume.ts.
const SELF = "Foysal Munsy";

const ENDPOINT = "https://api.openalex.org/works/doi:";
const cache = new Map<string, Promise<Work | null>>();

// data-doi attributes hold the clean DOI (no https://doi.org/ prefix).
function fetchWork(doi: string): Promise<Work | null> {
    if (!cache.has(doi)) {
        cache.set(
            doi,
            fetch(`${ENDPOINT}${encodeURIComponent(doi)}`)
                .then((res) => (res.ok ? res.json() : null))
                .catch(() => null),
        );
    }
    return cache.get(doi)!;
}

// Split an OpenAlex display name ("Given Family") into its parts for inverted
// author formatting. Best effort: the last space-separated token is treated as
// the family name.
function splitName(name: string): { family: string; given: string } {
    const trimmed = name.trim();
    const idx = trimmed.lastIndexOf(" ");
    if (idx === -1) return { family: trimmed, given: "" };
    return { family: trimmed.slice(idx + 1), given: trimmed.slice(0, idx) };
}

function inverted(name: string): string {
    const { family, given } = splitName(name);
    if (!given) return family;
    // Reduce "Given Middle" to initials: "Family, G. M."
    const initials = given
        .split(/[\s-]+/)
        .map((part) => `${part.charAt(0)}.`)
        .join(" ");
    return `${family}, ${initials}`;
}

// OpenAlex sometimes lists a name only as initials or a raw affiliation
// string; skip entries that would make an unusable citation.
function displayNames(work: Work): string[] {
    const names = (work.authorships ?? [])
        .map((a) => a.author?.display_name)
        .filter((n): n is string => Boolean(n && n.length > 1));
    return Array.from(new Set(names));
}

function isSelf(name: string): boolean {
    return name.toLowerCase() === SELF.toLowerCase();
}

function yearOf(work: Work, fallback: string): string {
    return work.publication_year ? String(work.publication_year) : fallback;
}

// --- Citation text builders ------------------------------------------------

function bibTeX(work: Work, doi: string, fallbackTitle: string): string {
    const names = displayNames(work);
    const first = names.length ? names[0] : "Author";
    const key = `${splitName(first).family.toLowerCase().replace(/\W+/g, "")}${yearOf(work, "")}${work.title ? "" : "n.d."}`.replace(/\s+/g, "");
    const authorField = names.length
        ? names.map((n) => splitName(n).given ? `${splitName(n).family}, ${splitName(n).given}` : splitName(n).family).join(" and ")
        : "";
    const source = work.primary_location?.source?.display_name;
    const biblio = work.biblio ?? {};
    const lines = [
        `  title   = {${work.title || fallbackTitle}},`,
        authorField && `  author  = {${authorField}},`,
        source && `  journal = {${source}},`,
        yearOf(work, "") && `  year    = {${yearOf(work, "")}},`,
        biblio.volume && `  volume  = {${biblio.volume}},`,
        biblio.issue && `  number  = {${biblio.issue}},`,
        biblio.first_page && `  pages   = {${biblio.first_page}${biblio.last_page && biblio.last_page !== biblio.first_page ? `--${biblio.last_page}` : ""}},`,
        `  doi     = {${doi}},`,
    ]
        .filter(Boolean)
        .join("\n");
    return `@article{${key},\n${lines}\n}`;
}

function apa(work: Work, doi: string, fallbackTitle: string): string {
    const names = displayNames(work);
    const source = work.primary_location?.source?.display_name;
    const biblio = work.biblio ?? {};
    let byline = "";
    if (names.length) {
        if (names.length > 20) {
            byline = `${inverted(names[0])}, ... ${inverted(names[names.length - 1])}`;
        } else {
            const list = names.map(inverted);
            byline = list.length > 1 ? `${list.slice(0, -1).join(", ")}, & ${list[list.length - 1]}` : list[0];
        }
    }
    const year = yearOf(work, "");
    const title = work.title || fallbackTitle;
    const where = [source, biblio.volume ? `${biblio.volume}` : ""]
        .filter(Boolean)
        .join(", ");
    const biblioTail = biblio.issue ? `(${biblio.issue})` : "";
    const pageTail = biblio.first_page || "";
    return `${byline} (${year || "n.d."}). ${title}.${where ? ` ${where}${biblioTail}${pageTail ? `, ${pageTail}` : ""}.` : ""} https://doi.org/${doi}`;
}

// --- Hydration helpers -------------------------------------------------------

function doiOf(el: Element): string {
    return el.getAttribute("data-doi") || "";
}

async function fillAuthors(el: HTMLElement): Promise<void> {
    const work = await fetchWork(doiOf(el));
    if (!work) return;
    const names = displayNames(work);
    if (!names.length) return;
    const line = el.querySelector(".oa-authors-list");
    if (line) {
        names.forEach((n, i) => {
            const span = document.createElement("span");
            if (isSelf(n)) span.innerHTML = `<b>${escapeHtml(n)}</b>`;
            else span.textContent = n;
            line.appendChild(span);
            if (i < names.length - 1) line.appendChild(document.createTextNode(", "));
        });
        el.hidden = false;
    }
}

async function populateCite(details: HTMLDetailsElement): Promise<void> {
    if (details.dataset.ready) return;
    const doi = doiOf(details);
    const fallback = details.getAttribute("data-title") || "";
    const work = await fetchWork(doi);
    const state = details.querySelector<HTMLElement>(".oa-cite-state");
    const fields = details.querySelector<HTMLElement>(".oa-cite-fields");
    const bib = details.querySelector<HTMLElement>(".oa-cite-bib");
    const apaEl = details.querySelector<HTMLElement>(".oa-cite-apa");
    if (!work || (!work.title && !fallback) || !fields || !bib || !apaEl) {
        if (state) state.textContent = "Citation metadata could not be loaded for this DOI.";
        return;
    }
    bib.textContent = bibTeX(work, doi, fallback);
    apaEl.textContent = apa(work, doi, fallback);
    if (state) state.hidden = true;
    fields.hidden = false;
    details.dataset.ready = "1";
}

async function fillTotals(): Promise<void> {
    const counts = Array.from(document.querySelectorAll<HTMLElement>(".oa-count[data-doi]"));
    const resolved = await Promise.all(
        counts.map(async (el) => {
            const work = await fetchWork(doiOf(el));
            if (!work || typeof work.cited_by_count !== "number") return 0;
            el.textContent = String(work.cited_by_count);
            const holder = el.closest("[data-count]") as HTMLElement | null;
            if (holder) holder.hidden = false;
            return work.cited_by_count;
        }),
    );
    const total = resolved.reduce((sum, n) => sum + n, 0);
    if (total <= 0) return;
    document.querySelectorAll<HTMLElement>(".oa-total").forEach((el) => {
        el.textContent = String(total);
        const line = el.closest("[data-total]") as HTMLElement | null;
        if (line) line.hidden = false;
    });
}

function escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// --- Wiring -------------------------------------------------------------------

document.querySelectorAll<HTMLElement>('[data-doi].oa-authors').forEach((el) => void fillAuthors(el));

document.querySelectorAll<HTMLElement>('[data-doi].oa-cite').forEach((details) => {
    details.addEventListener("toggle", () => {
        if ((details as HTMLDetailsElement).open) void populateCite(details as HTMLDetailsElement);
    });
});

// Fills every row's live count and the page total in one pass.
void fillTotals();

// Copy buttons inside cite panels: each carries data-target pointing at the id
// of the <pre> whose text to copy.
document.addEventListener("click", async (event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-copy]");
    if (!button) return;
    const target = document.getElementById(button.getAttribute("data-copy") || "");
    if (!target) return;
    const text = (target as HTMLElement).textContent || "";
    const original = button.textContent;
    const done = (ok: boolean) => {
        button.textContent = ok ? "Copied" : original;
        window.setTimeout(() => {
            button.textContent = original;
        }, 1600);
    };
    try {
        await navigator.clipboard.writeText(text);
        done(true);
    } catch {
        // Fallback for older browsers / blocked clipboard: select the text.
        const range = document.createRange();
        range.selectNodeContents(target);
        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        done(false);
    }
});
