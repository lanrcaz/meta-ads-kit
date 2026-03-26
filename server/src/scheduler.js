const cron = require("node-cron");
const config = require("./config");
const { runCommand } = require("./runner");
const { interpretReport, generateTaskBreakdown } = require("./claude");
const { postToChannel } = require("./slack");
const clickup = require("./clickup");

function startScheduler() {
  console.log(`[scheduler] Daily briefing scheduled: ${config.dailyCron}`);

  cron.schedule(config.dailyCron, async () => {
    console.log("[scheduler] Running daily briefing...");

    try {
      // Run daily check
      const rawOutput = await runCommand("daily-check");

      // Interpret with Claude
      const report = await interpretReport("daily-check", rawOutput);

      // Post to Slack
      const slackMessage =
        `:sunrise: *Crimson Meta Agent — Daily Briefing*\n\n${report}`;
      await postToChannel(slackMessage);

      // Create ClickUp tasks for actionable items
      if (config.clickupApiToken && config.clickupListId) {
        const tasks = await generateTaskBreakdown(report);

        if (tasks.length > 0) {
          const created = await clickup.createTasksFromBreakdown(tasks);
          const taskSummary = created
            .map((t) => `• ${t.task.title}`)
            .join("\n");

          await postToChannel(
            `:clipboard: *${created.length} task(s) created in ClickUp:*\n${taskSummary}`
          );
        }
      }

      console.log("[scheduler] Daily briefing complete.");
    } catch (err) {
      console.error("[scheduler] Daily briefing failed:", err.message);
      await postToChannel(
        `:x: *Daily briefing failed:* ${err.message}`
      );
    }
  });
}

module.exports = { startScheduler };
