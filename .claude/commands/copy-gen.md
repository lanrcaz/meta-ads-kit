Generate **ad copy** matched to image creatives.

Follow the ad-copy-generator skill workflow:

1. If the user provided image files, analyze them (format, style, on-image text, psychology angle)
2. Load brand voice from `workspace/brand/voice-profile.md` if available
3. Check account top performers for copy patterns (run `./run.sh winners` if needed)
4. Generate 3-5 headline + body variants per creative using the Four Horsemen psychology framework:
   - **Money** — Save, ROI, value
   - **Time** — Speed, efficiency, convenience
   - **Status** — Exclusive, premium, ahead of peers
   - **Fear** — Miss out, fall behind, risk

**Copy specs:**
- Headlines: 25-40 chars (max 50)
- Body: 50-120 words
- At least 1 number/stat per variant
- 3-5 variants per creative
- Include a clear CTA

**Forbidden words:** revolutionary, game-changer, cutting-edge, unlock, unleash, skyrocket, supercharge

Output both:
1. A readable copy document (for review)
2. `asset_feed_spec` JSON (ready for Meta API upload)

Save to `workspace/campaigns/{campaign-name}/ads/` if campaign name provided.
