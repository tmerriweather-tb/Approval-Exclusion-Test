# Enhanced Artwork Exclusion Scoring

The dashboard and 52 shared pages now include:
- Weighted, explainable 0-100 evidence scoring: exact (35), theme (25), context (20), supporting terminology (10), venue relevance (10).
- A cap for metadata-only matches and a cap when an explicitly permitted exception may apply.
- Three distinct readouts: theme keyword evidence, OCR text reliability, and exclusion evidence score.
- Reviewer selections saved per company/rule/venue in localStorage on that browser.

Important limitations:
- Percentages are heuristic evidence-strength scores, NOT statistically calibrated probabilities of exclusion.
- OCR confidence is supplied by Tesseract when a fresh scan runs. Older cached OCR is estimated from text quality.
- No feedback is sent to a server or used to retrain rules; this requires a shared dataset and measured validation.
- No automated approval or compliance clearance. Confirm venue-specific policies and artwork imagery manually.
- The scoring uses OCR words and rule-based theme matching, not a vision-language model.

Deployment: upload the contents of this ZIP to the Approval Dashboard repository / Netlify deployment. Preserve netlify/functions and all shared pages.
