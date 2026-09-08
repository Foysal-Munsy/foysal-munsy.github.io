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
    
    # Read existing projects by their repo URL
    existing_files = {}
    for filename in os.listdir(PROJECTS_DIR):
        if filename.endswith('.md'):
            filepath = os.path.join(PROJECTS_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
                repo_url = post.get('repo', '').strip('/')
                if repo_url:
                    existing_files[repo_url] = filepath

    for repo in repos:
        topics = repo.get('topics', [])
        if 'featured' not in topics:
            continue
            
        print(f"Processing featured repo: {repo['name']}")
        
        repo_url = repo['html_url']
        desc = repo.get('description') or ''
        homepage = repo.get('homepage') or ''
        
        # Tech stack from topics (exclude 'featured')
        tech = [t for t in topics if t != 'featured']
        
        # OpenGraph Image
        cover = f"https://opengraph.githubassets.com/1/{GITHUB_USER}/{repo['name']}"
        
        links = []
        if homepage:
            links.append({'label': 'Live', 'url': homepage})
            
        repo_key = repo_url.strip('/')
        if repo_key in existing_files:
            filepath = existing_files[repo_key]
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
            
            # Update specific fields while preserving user customizations (like body/case study)
            if not post.get('title'):
                post['title'] = repo['name'].replace('-', ' ').title()
            post['summary'] = desc
            post['tech'] = tech
            post['cover'] = cover
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(frontmatter.dumps(post))
            print(f"Updated: {filepath}")
        else:
            # Create new
            filepath = os.path.join(PROJECTS_DIR, f"github-{repo['name']}.md")
            post = frontmatter.Post("")
            post['title'] = repo['name'].replace('-', ' ').title()
            post['summary'] = desc
            post['role'] = "Creator" # Default fallback
            post['timeframe'] = repo['created_at'][:4]
            post['tech'] = tech
            post['repo'] = repo_url
            if homepage:
                post['liveUrl'] = homepage
            post['cover'] = cover
            if links:
                post['links'] = links
            post['order'] = 10
            post['featured'] = True
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(frontmatter.dumps(post))
            print(f"Created: {filepath}")

if __name__ == "__main__":
    main()
