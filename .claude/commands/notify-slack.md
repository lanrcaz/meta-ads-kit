Send a **report summary to Slack** using the Slack MCP server.

This command takes the most recent report output and formats it for Slack.

**Workflow:**
1. If no recent report exists, ask which report to run first (daily-check, bleeders, winners, etc.)
2. Format the report for Slack (use blocks for clean formatting):
   - Header with report type and date
   - Key metrics in a summary section
   - Severity flags as colored indicators
   - Action items as a bulleted list
3. Send to the configured Slack channel

**Slack formatting:**
- Use `:red_circle:` for CRITICAL
- Use `:warning:` for WARNING
- Use `:eyes:` for MONITOR
- Use `:white_check_mark:` for HEALTHY

Ask the user which channel to post to if not previously configured.

Uses the `slack` MCP server — requires `SLACK_BOT_TOKEN` and `SLACK_TEAM_ID` environment variables.
