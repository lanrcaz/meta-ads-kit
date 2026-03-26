Find ads that are **bleeding money** — high spend with poor performance.

Execute `./run.sh bleeders` and analyze the results.

**Bleeder criteria:**
- CTR below 1.0% (or below threshold in ad-config.json)
- Frequency above 3.5
- CPA above target by >40%
- Spending above average with below-average results

For each bleeder found:
1. Show the ad name, campaign, spend, CTR, CPC, CPA
2. Assign severity: CRITICAL / WARNING / MONITOR
3. Recommend action: pause, reduce budget, refresh creative, or monitor

Present results in a table sorted by severity (worst first).

If CRITICAL bleeders found, ask: "Want me to pause these? I'll need your approval for each one."
