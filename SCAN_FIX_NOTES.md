# Approval Dashboard artwork scan fix

- The Scan button uses each approval card's `FileUrl` as an artwork URL, not as an advertiser website URL. No advertiser website URL field exists in this package.
- The Netlify artwork proxy now validates actual PNG/JPG/GIF/WEBP/BMP file signatures, rather than rejecting an image solely due to a wrong Content-Type header. It reports when the upstream URL actually serves HTML/XML rather than image bytes.
- If an artwork is unavailable, the card still presents a preliminary venue exclusion screen based on advertiser name and industry, explicitly flagging artwork for manual review. It never calls that result approved.
- Both main dashboard and all existing shared HTML pages have the same fallback behavior.
- Redeploy this entire folder through Git-connected Netlify to update the serverless function. This does not change your separate Venue Exclusion Directory.
