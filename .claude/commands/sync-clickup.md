Create or update **ClickUp tasks** from ad management findings.

This command converts ad recommendations into actionable ClickUp tasks.

**Task creation rules:**

| Finding | ClickUp Task |
|---------|-------------|
| CRITICAL bleeder | Urgent task: "Pause [ad name] — bleeding $X/day" |
| Creative fatigue | Task: "Refresh creative for [ad name] — CTR dropped X%" |
| Budget shift recommendation | Task: "Reallocate budget: [from] -> [to]" |
| Copy refresh needed | Task: "Generate new copy for [campaign]" |
| Pixel/EMQ issue | Task: "Fix EMQ for [event] — currently X, target Y" |
| Winner to scale | Task: "Scale [ad name] — increase budget by X%" |

**Workflow:**
1. If no recent report exists, ask which report to run first
2. Parse findings and recommendations from the report
3. For each actionable item, create a ClickUp task with:
   - Title: Clear action description
   - Description: Data/metrics supporting the action
   - Priority: Urgent (critical) / High (warning) / Normal (monitor)
   - Tags: meta-ads, the finding type (bleeder, fatigue, budget, etc.)
4. Show the user a summary of tasks created with links

Ask the user which ClickUp list/space to use if not previously configured.

Uses the `clickup` MCP server — requires `CLICKUP_API_TOKEN` environment variable.
