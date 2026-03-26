const path = require("path");

const config = {
  // Paths
  projectRoot: path.resolve(__dirname, "../.."),
  runScript: path.resolve(__dirname, "../../run.sh"),
  skillsDir: path.resolve(__dirname, "../../skills"),

  // Server
  port: parseInt(process.env.PORT || "3000", 10),

  // Anthropic
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  claudeModel: "claude-sonnet-4-20250514",

  // Slack
  slackBotToken: process.env.SLACK_BOT_TOKEN,
  slackAppToken: process.env.SLACK_APP_TOKEN,
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET,
  slackChannelId: process.env.SLACK_CHANNEL_ID,

  // ClickUp
  clickupApiToken: process.env.CLICKUP_API_TOKEN,
  clickupListId: process.env.CLICKUP_LIST_ID,
  clickupWebhookSecret: process.env.CLICKUP_WEBHOOK_SECRET,

  // Schedule
  dailyCron: process.env.DAILY_CRON || "0 8 * * 1-5",

  // Commands recognized by run.sh
  commands: [
    "daily-check",
    "overview",
    "bleeders",
    "winners",
    "fatigue",
    "efficiency",
    "recommend",
    "pacing",
    "campaigns",
    "weekly",
  ],
};

module.exports = config;
