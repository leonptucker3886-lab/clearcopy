# ClearCopy Logbook

## v0.1 - 2026-10-27
- First draft deployed: page/sitemap checker (spelling list, repeated words, readability, title/meta/H1, affiliate disclosure placement), CSV export, HOWTO.md, PDF guide.
- Code-checked only. Not hand-tested.

## v0.2 - 2026-10-28 (self-review)
Problems I found in v0.1 and fixed:
1. **HTML entities broke words.** `don&#39;t` was split into "don" and "t", and curly quotes/dashes were left as codes. Now common entities are decoded before checking.
2. **Sitemap index files returned nothing useful.** A sitemap of sitemaps is now followed (first 5 children), and duplicate URLs are removed.
3. **Sitemap detection missed URLs with `?query`.** Fixed.
4. **No timeout.** One slow page could hang the whole check. Each fetch now stops after 9 seconds.
5. **It would fetch private/local addresses.** Now refused (safety).
6. **The page broke on a server error** (tried to read an HTML error page as JSON) and showed nothing. Now it shows a clear error message.
7. **"grade null"** showed on pages with no full sentences. Now shows "n/a".
8. **No feedback while checking / double clicks.** Button disables while working; Enter key now submits; `https://` is added if you leave it off.
9. **Space before a period** wasn't flagged. Now it is.
10. **Version labels were inconsistent.** Banner, API, user agent, package.json and HOWTO all say v0.2. Banner no longer says "rough draft".

Testing (honest): the analyzer was run against sample pages in Node (misspellings, entities, disclosure before/after Amazon link, reading grade) and produced the expected issues. Live-site results are recorded in reports/INSPECTIONS.md / the chat report.
