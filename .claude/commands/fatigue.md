Check for **creative fatigue** signals across active ads.

Execute `./run.sh fatigue` and the creative monitor script at `./skills/ad-creative-monitor/scripts/creative-monitor.sh`.

**Fatigue signals to check:**
- CTR dropping >20% over 3+ consecutive days
- Frequency climbing above 3.5
- CPC rising >15% over 3+ days
- Impressions declining while spend holds

For each fatigued creative:
1. Show the ad, campaign, and trend data (day-over-day)
2. Severity: CRITICAL (action now) / WARNING (24h) / MONITOR (48h watch)
3. Recommend: pause, refresh copy, swap creative, or rotate

If fatigued creatives found, suggest: "Want me to generate fresh copy for these? Use `/copy-gen` with the image files."
