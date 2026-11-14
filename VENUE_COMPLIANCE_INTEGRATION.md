# Venue Exclusion Checker — Option 2

Each approval card now includes an expandable **Check venue exclusions** section, populated from the uploaded Venue Exclusion Directory ZIP. General restrictions and venue-specific restrictions are displayed for exact venue/subsidiary matches. Potential exact title matches against company name and industry are highlighted, but **no match does not mean approved**. Artwork images and advertiser URLs are not analyzed. Unknown venues are flagged.

The directory data is a **static snapshot** of the ZIP's `const DATA` base rules, embedded in each HTML page so existing shared views work without CORS or external services. Custom additions saved only in the exclusion directory browser's localStorage are not included. To refresh rules, update the source ZIP and regenerate these embedded snapshots.

The Approve/Reject workflow, Netlify Blobs storage, Netlify Forms, and branded HTML/PDF report endpoint were not changed.

Deploy this package to the **existing Netlify approvals site** and test a previously reviewed deck, a newly generated shared deck, and the report button. This does not modify the separately hosted venueexclusions.netlify.app website.
