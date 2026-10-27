# ClearCopy v0.1 - How To

ClearCopy is an editing desk for websites. It proofreads pages and lists each problem with a fix.

1. Open the live ClearCopy site (link in the repo description).
2. Paste a page URL, or a sitemap.xml URL to check up to 30 pages.
3. Click **Check**.
4. Read each page card: a score out of 100, word count, reading grade, and issues ranked high / med / low.
5. Click **Export CSV** to download every issue.
6. Fix the high items first. Disclosure issues mean the affiliate disclosure is missing or comes after the first Amazon link.

API: `GET /api/check?url=...` or `GET /api/check?sitemap=...&limit=20` (max 40).

What it checks: common misspellings, repeated words, space before punctuation, long sentences, reading grade, title/meta description length, H1 count, affiliate disclosure placement.

Limits (v0.1): a small misspelling list, not a full grammar engine. It doesn't open pull requests yet; that's planned for v0.2.
