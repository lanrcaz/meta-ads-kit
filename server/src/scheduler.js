const cron = require("node-cron");
const config = require("./config");
const { runCommand } = require("./runner");
const { interpretReport, generateTaskBreakdown } = require("./claude");
const { postToChannel, postToSpecificChannel } = require("./slack");
const clickup = require("./clickup");
const { getAllAccounts } = require("./accounts");

function startScheduler() {
  console.log(`[scheduler] Daily briefing scheduled: ${config.dailyCron}`);

  cron.schedule(config.dailyCron, async () => {
    const accounts = getAllAccounts();
    console.log(`[scheduler] Running daily briefing for ${accounts.length} account(s)...`);

    for (const account of accounts) {
      try {
        console.log(`[scheduler] Briefing: ${account.name} (${account.id})`);

        // Run daily check for this account
        const rawOutput = await runCommand("daily-check", [], account.id);

        // Interpret with Claude
        const report = await interpretReport("daily-check", rawOutput);

        // Post to the account's Slack channel (or default channel)
        const slackMessage =
          `:sunrise: *Crimson Meta Agent — Daily Briefing*\n*Account: ${account.name}*\n\n${report}`;

        if (account.slackChannel) {
          await postToSpecificChannel(account.slackChannel, slackMessage);
        } else {
          await postToChannel(slackMessage);
        }

        // Create ClickUp tasks for actionable items
        const clickupList = account.clickupListId || config.clickupListId;
        if (config.clickupApiToken && clickupList) {
          const tasks = await generateTaskBreakdown(report);

          if (tasks.length > 0) {
            const created = await clickup.createTasksFromBreakdown(
              tasks.map((t) => ({
                ...t,
                tags: [...(t.tags || []), account.name.toLowerCase().replace(/\s+/g, "-")],
              })),
              clickupList
            );

            const taskSummary = created
              .map((t) => `• ${t.task.title}`)
              .join("\n");

            const taskMessage =
              `:clipboard: *${created.length} task(s) for ${account.name}:*\n${taskSummary}`;

            if (account.slackChannel) {
              await postToSpecificChannel(account.slackChannel, taskMessage);
            } else {
              await postToChannel(taskMessage);
            }
          }
        }

        console.log(`[scheduler] Done: ${account.name}`);
      } catch (err) {
        console.error(`[scheduler] Failed for ${account.name}:`, err.message);
        const errorMsg = `:x: *Daily briefing failed for ${account.name}:* ${err.message}`;
        if (account.slackChannel) {
          await postToSpecificChannel(account.slackChannel, errorMsg);
        } else {
          await postToChannel(errorMsg);
        }
      }
    }

    console.log("[scheduler] All briefings complete.");
  });
}

module.exports = { startScheduler };
