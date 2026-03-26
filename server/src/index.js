const express = require("express");
const config = require("./config");
const { createSlackApp } = require("./slack");
const { createWebhookRouter } = require("./webhooks");
const { startScheduler } = require("./scheduler");

async function main() {
  console.log("┌─────────────────────────────────────┐");
  console.log("│       Crimson Meta Agent Server      │");
  console.log("└─────────────────────────────────────┘");

  // Validate required config
  if (!config.anthropicApiKey) {
    console.error("[error] ANTHROPIC_API_KEY is required. Set it in .env");
    process.exit(1);
  }

  // Start Express for webhooks
  const expressApp = express();
  expressApp.use("/webhooks", createWebhookRouter());

  expressApp.listen(config.port, () => {
    console.log(`[server] Webhook server listening on port ${config.port}`);
    console.log(`[server] Health check: http://localhost:${config.port}/webhooks/health`);
  });

  // Start Slack bot if configured
  if (config.slackBotToken && config.slackAppToken) {
    const slackApp = createSlackApp();
    await slackApp.start();
    console.log("[slack] Bot connected (Socket Mode)");
    console.log("[slack] Listening for @mentions and DMs");
  } else {
    console.log("[slack] Skipped — SLACK_BOT_TOKEN or SLACK_APP_TOKEN not set");
  }

  // Start scheduler
  startScheduler();

  // Integration status
  console.log("\n[status] Integrations:");
  console.log(`  Slack:   ${config.slackBotToken ? "connected" : "not configured"}`);
  console.log(`  ClickUp: ${config.clickupApiToken ? "connected" : "not configured"}`);
  console.log(`  Claude:  connected (${config.claudeModel})`);
  console.log(`  Cron:    ${config.dailyCron}`);
  console.log("\n[ready] Crimson Meta Agent is live.\n");
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
