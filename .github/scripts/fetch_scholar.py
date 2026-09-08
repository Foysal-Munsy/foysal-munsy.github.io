import os
import re
from scholarly import scholarly, ProxyGenerator
import frontmatter

SCHOLAR_ID = 'LS9hj1IAAAAJ'
RESEARCH_DIR = 'src/content/research'

def normalize_title(title):
    # Remove punctuation, convert to lowercase, normalize spaces
    return re.sub(r'[^\w\s]', '', title.lower()).strip()

def main():
    print("Setting up free proxies to avoid IP blocks...")
    pg = ProxyGenerator()
    pg.FreeProxies()
    scholarly.use_proxy(pg)

    print(f"Fetching Google Scholar profile: {SCHOLAR_ID}")
    author = scholarly.search_author_id(SCHOLAR_ID)
    scholarly.fill(author, sections=['publications'])

    # Index existing local publications by normalized title.
    existing_files = {}
    for filename in os.listdir(RESEARCH_DIR):
        if filename.endswith('.md'):
            filepath = os.path.join(RESEARCH_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
                title = normalize_title(post.get('title', ''))
                existing_files[title] = filepath

    print(f"Found {len(existing_files)} existing publications in {RESEARCH_DIR}")

    updated = 0
    skipped = 0

    # Update-only sync: refresh the citation count on publications that already
    # exist locally. Anything Scholar returns that we don't already track is
    # skipped -- never auto-created. Auto-creating here has produced entries
    # with no real venue/DOI (e.g. a bare journal name), and this workflow
    # commits straight to main, so a stray file would go live untouched.
    for pub in author.get('publications', []):
        # We don't fill every pub to avoid rate limits and keep it fast.
        # The basic `pub` dictionary has `num_citations` and basic `bib` metadata.
        bib = pub.get('bib', {})
        title = bib.get('title', '')
        num_citations = pub.get('num_citations', 0)

        if not title:
            continue

        norm_title = normalize_title(title)
        if norm_title in existing_files:
            filepath = existing_files[norm_title]
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)

            post['scholarCitations'] = num_citations

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(frontmatter.dumps(post))
            print(f"Updated citations for: {title} ({num_citations} citations)")
            updated += 1
        else:
            print(f"Skipped (not tracked locally): {title}")
            skipped += 1

    print(f"Done. Updated {updated}, skipped {skipped} untracked publication(s).")

if __name__ == "__main__":
    main()
