Run the **5 Daily Questions** morning briefing for the Meta ad account.

Execute `./run.sh daily-check` and interpret the results.

For each question, provide:
1. **Am I on track?** — Today's spend vs daily budget pacing (flag if >15% off pace)
2. **What's running?** — Active campaigns count and status
3. **How's performance?** — 7-day trends by campaign (CTR, CPC, CPA, ROAS)
4. **Who's winning/losing?** — Rank ads by performance, flag bleeders
5. **Any fatigue?** — CTR decay, frequency creep, CPC inflation signals

After the report:
- Summarize with a verdict (Good day / Mixed signals / Action needed)
- List 1-3 recommended next steps
- If any CRITICAL issues found, ask if the user wants to take action

If Slack is configured, ask if they want the briefing sent to Slack via `/notify-slack`.
