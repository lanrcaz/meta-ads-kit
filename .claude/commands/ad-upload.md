**Upload ads to Meta** via the Graph API (no Ads Manager needed).

Follow the ad-upload skill workflow:

1. Validate copy: headlines <50 chars, bodies 50-500 chars, CTAs present
2. Validate images: format (JPG/PNG), dimensions, aspect ratio
3. Upload image to get image hash
4. Create creative with `asset_feed_spec`
5. Create ad in PAUSED state (always paused for review)

**Supports:**
- Single or batch upload
- Dry-run mode (preview API calls without executing)
- Copy refresh (update existing ads without rebuilding)

**Safety:** All ads are created as PAUSED. The user must manually activate them in Ads Manager or explicitly approve activation here.

Use the scripts in `skills/ad-upload/` and the social-cli token from `~/.social-cli/config.json`.
