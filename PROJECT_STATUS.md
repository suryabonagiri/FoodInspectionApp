# Project status — 11 September 2026

## Phase 1: functional demo

React/Vite dashboard, locality/status/date/recurring-concern filters, restaurant detail pages, inspection history, source links, and an editable deterministic text parser are implemented. The local Admin/Admin gate is a prototype only; reviewed records can now be saved in this browser using localStorage. Firebase client integration exists but deployment and live credentials have not been verified. AI extraction and URL fetching are not implemented. The workspace is not currently a Git repository.

### Improvements completed in this review

- Added latest-inspection/name sorting and export of filtered directory records to CSV, with formula-safe cells.
- Added the missing “Not available” status filter and feedback for reversed date ranges.
- Fixed absent/blank/invalid hygiene scores being interpreted as critical, while retaining explicit enforcement findings.
- Accepted ISO and local inspection dates and rejected impossible calendar dates.
- Preserved missing scores when preparing saved records and validated score bounds.
- Waited for both data subscriptions before rendering loaded results; subscription errors end loading.
- Displayed the demo-data notice in production as well as development.
- Renamed the timeline to “Inspection history,” since it displays all records rather than a 24-month window.

Validation: `node --test` passes three regression tests; `npm run build` passes. Browser interaction and live Firebase behavior have not been tested. Build warnings flag the large Firebase bundle and mixed static/dynamic Firestore imports.

## Phase 2: Firebase and AI restaurant imports

1. Configure a Firebase project, Firestore, and administrator authentication. Replace the current any-authenticated-user write rules with server-enforced administrator authorization, validate document shapes, and test rules with the emulator before deployment.
2. Save restaurant and inspection updates atomically. Enforce source deduplication under concurrent writes, use collision-resistant IDs, and ensure importing an older inspection cannot replace the current restaurant summary. Require an explicit decision for ambiguous restaurant/branch matches; the existing UI warning does not enforce this yet.
3. Add “Paste text” and “Import link” input modes. Fetch allowed public pages on the server with URL validation, private-network blocking, response size limits, timeouts, and redirect checks. Offer paste-text fallback when a site cannot be retrieved.
4. Perform AI extraction through an authenticated server endpoint with server-held secrets, quotas, and rate limits. Return a validated draft containing restaurant, locality, inspection date, findings, action, optional score, and source evidence. Treat imported content as data, preserve unknown fields, and never infer an official score from general restaurant information.
5. Present an editable review with evidence and branch-match decisions before publishing. Keep general restaurant information separate from inspection findings. Record provenance, reviewer, and timestamps, and report extraction/save errors with retry options.
6. Test authentication/authorization, concurrent duplicates, historical imports, ambiguous branches, missing facts, hostile source text, blocked URLs, and failures. Configure SPA route fallback and measure the production bundle before launch.

Phase 2 remains planned; no cloud resources were created and no AI keys were added.


## 17 September 2026 — sourced directory additions

Added nine sourced establishments to the local public catalogue, including four establishment-specific records from the 10 September TG SAFE inspection. Source reports and recovered X URLs appear alongside historical-data notes. Stable draft keys prevent duplicate historical imports; saved edits and trash markers survive merging. Missing scores remain unknown, and explicit stop-operation actions map to the existing Critical status. Six other older research drafts remain in the fresh local admin queue.

Validation: all 10 Node tests and production build passed; browser search and the Girl Friend Mandi detail/history view were checked. Firebase cloud data and deployment were not changed.


### Additional requested news records

Six more government-inspection news records are bundled locally, bringing the fresh catalogue to 18 restaurants. Report dates remain separate from unconfirmed inspection dates; unsupported establishment-level findings stay empty. Three further leads and reusable search keywords are recorded in RESTAURANT_NEWS_RESEARCH.md. Validation: 11 tests, production build, directory count, search and a new detail page passed.
