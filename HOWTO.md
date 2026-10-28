# ClearCopy v0.2 - How To

ClearCopy is an editing desk for websites. It proofreads pages and lists each problem with a fix.

1. Open https://clearcopy-goodbyedawg-7221s-projects.vercel.app
2. Paste a page URL or a sitemap.xml URL (up to 30 pages). You can leave off `https://`; ClearCopy adds it.
3. Click **Check** or press Enter. The button greys out while it works.
4. Read each page card: a score out of 100, word count, reading grade, and issues ranked high / med / low.
5. Click **Export CSV** to download every issue.
6. Fix the high items first. Disclosure issues mean the affiliate disclosure is missing or comes after the first Amazon link.

API: `GET /api/check?url=...` or `GET /api/check?sitemap=...&limit=20` (max 40). Sitemap index files are followed (first 5 child sitemaps).

What it checks: common misspellings, repeated words, space before punctuation, long sentences, reading grade, title/meta description length, H1 count, affiliate disclosure placement.

Limits (v0.2): a small misspelling list, not a full grammar engine. Each page fetch times out after 9 seconds. Private/local addresses are refused. It doesn't open pull requests.
