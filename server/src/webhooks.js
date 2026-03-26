const express = require("express");
const config = require("./config");
const { runCommand, parseCommand } = require("./runner");
const { interpretReport } = require("./claude");
const clickup = require("./clickup");
const { postToChannel } = require("./slack");

function createWebhookRouter() {
  const router = express.Router();

  // ClickUp webhook endpoint
  router.post("/clickup", express.json(), async (req, res) => {
    // Handle ClickUp webhook verification challenge
    if (req.body.event === "verificationRequest") {
      return res.json({ challenge: req.body.challenge });
    }

    // Verify webhook secret if configured
    if (config.clickupWebhookSecret) {
      const signature = req.headers["x-signature"];
      if (signature !== config.clickupWebhookSecret) {
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    const event = clickup.parseWebhookEvent(req.body);

    try {
      // Handle comment-based commands on Crimson tasks
      if (event.type === "comment" && event.text) {
        const parsed = parseCommand(event.text);
        if (parsed) {
          const rawOutput = await runCommand(parsed.command, parsed.args);
          const report = await interpretReport(parsed.command, rawOutput);

          // Post result back as a task comment
          await clickup.addComment(event.taskId, report);

          // Also notify Slack
          await postToChannel(
            `:clickup: *ClickUp triggered "${parsed.command}":*\n\n${report}`
          );
        }
      }

      // Handle status changes — e.g., "approved" status triggers action
      if (event.type === "status_change" && event.newStatus === "approved") {
        await clickup.addComment(
          event.taskId,
          "Action approved. Crimson Meta Agent will execute this on the next run."
        );
        await postToChannel(
          `:white_check_mark: Task approved in ClickUp (${event.taskId}). Action queued.`
        );
      }

      res.json({ ok: true });
    } catch (err) {
      console.error("[webhook] ClickUp handler error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // Health check
  router.get("/health", (req, res) => {
    res.json({
      status: "ok",
      agent: "Crimson Meta Agent",
      integrations: {
        slack: !!config.slackBotToken,
        clickup: !!config.clickupApiToken,
        claude: !!config.anthropicApiKey,
      },
    });
  });

  return router;
}

module.exports = { createWebhookRouter };
