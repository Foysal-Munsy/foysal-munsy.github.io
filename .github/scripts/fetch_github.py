import os
import requests
import frontmatter

GITHUB_USER = 'Foysal-Munsy'
PROJECTS_DIR = 'src/content/projects'

def main():
    print(f"Fetching GitHub repositories for {GITHUB_USER}...")
    url = f"https://api.github.com/users/{GITHUB_USER}/repos?per_page=100&sort=updated"

    headers = {}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch repos: {response.status_code}")
        return

    repos = response.json()

    # Index existing projects by their repo URL.
    existing_files = {}
    for filename in os.listdir(PROJECTS_DIR):
        if filename.endswith('.md'):
            filepath = os.path.join(PROJECTS_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
                repo_url = post.get('repo', '').strip('/')
                if repo_url:
                    existing_files[repo_url] = filepath

    created = 0
    skipped = 0

    for repo in repos:
        topics = repo.get('topics', [])
        if 'featured' not in topics:
            continue

        repo_url = repo['html_url'].strip('/')
        if repo_url in existing_files:
            # Never overwrite an existing entry: the local summary, tech list,
            # order, featured flag and case-study body are hand-curated, and
            # GitHub descriptions/topics are often stale or low quality.
            print(f"Skipped (already tracked): {repo['name']}")
            skipped += 1
            continue

        print(f"Creating draft for new featured repo: {repo['name']}")
        desc = repo.get('description') or ''
        homepage = repo.get('homepage') or ''

        # Tech stack from topics (exclude 'featured').
        tech = [t for t in topics if t != 'featured']

        filepath = os.path.join(PROJECTS_DIR, f"github-{repo['name']}.md")
        post = frontmatter.Post("")
        post['title'] = repo['name'].replace('-', ' ').title()
        post['summary'] = desc
        post['role'] = "Creator"  # Default fallback; curate before publishing.
        post['timeframe'] = repo['created_at'][:4]
        post['tech'] = tech
        post['repo'] = repo_url
        if homepage:
            post['liveUrl'] = homepage
        # New auto-discovered repos start as drafts so they can never appear on
        # the live site until the owner has reviewed the summary/links and
        # flipped draft to false.
        post['draft'] = True

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(frontmatter.dumps(post))
        print(f"Created (draft): {filepath}")
        created += 1

    print(f"Done. Created {created} draft(s), skipped {skipped} existing entry/entries.")

if __name__ == "__main__":
    main()
