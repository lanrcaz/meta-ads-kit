**Audit the Meta Pixel** setup and signal quality.

Execute `./skills/pixel-capi/scripts/pixel-audit.sh` and analyze results.

Check:
- Pixel installation status (firing correctly?)
- Auto-advanced matching fields enabled
- Event types being tracked
- Inferred Event Match Quality (EMQ) score
- Deduplication setup (browser pixel + CAPI sharing event_id)

**EMQ Targets:**
- Purchase events: 9.3+
- Lead events: 8.0+

If EMQ is below target, provide prioritized recommendations to improve signal quality.

For platform-specific setup guidance, reference `skills/pixel-capi/references/pixel-capi-reference.md`.
