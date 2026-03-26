const { App } = require("@slack/bolt");
const config = require("./config");
const { runCommand, runScript, parseCommand } = require("./runner");
const { interpretReport, generateTaskBreakdown } = require("./claude");
const clickup = require("./clickup");

let app;

function createSlackApp() {
  app = new App({
    token: config.slackBotToken,
    appToken: config.slackAppToken,
    signingSecret: config.slackSigningSecret,
    socketMode: true,
  });

  // Handle @mentions — natural language commands
  app.event("app_mention", async ({ event, say }) => {
    const text = event.text.replace(/<@[A-Z0-9]+>/g, "").trim();
    await handleMessage(text, say);
  });

  // Handle DMs
  app.event("message", async ({ event, say }) => {
    if (event.channel_type !== "im" || event.bot_id) return;
    await handleMessage(event.text, say);
  });

  // Handle approval button clicks
  app.action("approve_action", async ({ body, ack, say }) => {
    await ack();
    const action = JSON.parse(body.actions[0].value);
    const user = body.user.name;
    await say(
      `:white_check_mark: *Approved by @${user}.* Executing: ${action.description}\n_Action will run on next cycle._`
    );
  });

  app.action("reject_action", async ({ body, ack, say }) => {
    await ack();
    const user = body.user.name;
    await say(`:no_entry_sign: *Rejected by @${user}.* No action taken.`);
  });

  return app;
}

async function handleMessage(text, say) {
  const parsed = parseCommand(text);

  if (!parsed) {
    await say(
      "I didn't catch that. Try:\n" +
      "• `daily check` — Morning briefing\n" +
      "• `bleeders` — Ads losing money\n" +
      "• `winners` — Top performers\n" +
      "• `fatigue` — Creative health\n" +
      "• `efficiency` — Budget ranking\n" +
      "• `recommend` — Budget shifts\n" +
      "• `pacing` — Spend rate\n" +
      "• `overview` — Account summary"
    );
    return;
  }

  await say(`Running *${parsed.command}*... :hourglass_flowing_sand:`);

  try {
    // Run the command
    let rawOutput;
    if (parsed.script) {
      rawOutput = await runScript(parsed.script, parsed.args);
    } else {
      rawOutput = await runCommand(parsed.command, parsed.args);
    }

    // Interpret with Claude
    const report = await interpretReport(parsed.command, rawOutput);

    // Post to Slack — include approval buttons for critical findings
    const hasCritical = /CRITICAL/i.test(report);

    if (hasCritical) {
      await say({
        text: report,
        blocks: [
          { type: "section", text: { type: "mrkdwn", text: report } },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Approve Actions" },
                style: "primary",
                action_id: "approve_action",
                value: JSON.stringify({ command: parsed.command, description: `Execute recommendations from ${parsed.command}` }),
              },
              {
                type: "button",
                text: { type: "plain_text", text: "Reject" },
                style: "danger",
                action_id: "reject_action",
                value: "rejected",
              },
            ],
          },
        ],
      });
    } else {
      await say(report);
    }

    // Create ClickUp tasks if there are actionable findings
    if (config.clickupApiToken && config.clickupListId) {
      const tasks = await generateTaskBreakdown(report);

      if (tasks.length > 0) {
        const created = await clickup.createTasksFromBreakdown(tasks);
        const taskList = created
          .map((t) => `• ${t.task.title}`)
          .join("\n");

        await say(
          `:clipboard: *Created ${created.length} ClickUp task(s):*\n${taskList}`
        );
      }
    }
  } catch (err) {
    await say(`:x: Error running ${parsed.command}: ${err.message}`);
  }
}

/**
 * Post a message to the configured Slack channel.
 */
async function postToChannel(text) {
  if (!app || !config.slackChannelId) return;

  await app.client.chat.postMessage({
    channel: config.slackChannelId,
    text,
    mrkdwn: true,
  });
}

module.exports = { createSlackApp, postToChannel };
