import os
import re
from scholarly import scholarly
import frontmatter

SCHOLAR_ID = 'LS9hj1IAAAAJ'
RESEARCH_DIR = 'src/content/research'

def normalize_title(title):
    # Remove punctuation, convert to lowercase, normalize spaces
    return re.sub(r'[^\w\s]', '', title.lower()).strip()

def main():
    print(f"Fetching Google Scholar profile: {SCHOLAR_ID}")
    author = scholarly.search_author_id(SCHOLAR_ID)
    scholarly.fill(author, sections=['publications'])
    
    # Read existing local publications
    existing_files = {}
    for filename in os.listdir(RESEARCH_DIR):
        if filename.endswith('.md'):
            filepath = os.path.join(RESEARCH_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
                title = normalize_title(post.get('title', ''))
                existing_files[title] = filepath

    print(f"Found {len(existing_files)} existing publications in {RESEARCH_DIR}")

    # Iterate through scholar publications
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
            print(f"Updating citations for: {title} ({num_citations} citations)")
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
            
            post['scholarCitations'] = num_citations
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(frontmatter.dumps(post))
        else:
            print(f"New publication found: {title}")
            # Create a new markdown file
            safe_name = re.sub(r'[-\s]+', '-', re.sub(r'[^\w\s-]', '', title.lower())).strip('-')
            safe_name = safe_name[:50] # Limit filename length
            if not safe_name:
                continue
                
            filepath = os.path.join(RESEARCH_DIR, f"scholar-{safe_name}.md")
            
            post = frontmatter.Post("")
            post['title'] = title
            post['summary'] = "Auto-imported from Google Scholar."
            post['venue'] = bib.get('citation', 'Google Scholar') # Basic pub doesn't always have venue
            post['year'] = str(bib.get('pub_year', ''))
            post['status'] = 'published'
            post['scholarCitations'] = num_citations
            # Scholar base pubs usually have 'author' as a string in bib
            if 'author' in bib:
                # scholarly usually returns "A Name, B Name"
                post['authors'] = [a.strip() for a in bib['author'].split('and')]
            post['link'] = f"https://scholar.google.com/citations?user={SCHOLAR_ID}"
            post['order'] = 10 
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(frontmatter.dumps(post))

if __name__ == "__main__":
    main()
