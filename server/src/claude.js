const Anthropic = require("@anthropic-ai/sdk");
const config = require("./config");

const client = new Anthropic({ apiKey: config.anthropicApiKey });

const SYSTEM_PROMPT = `You are Crimson Meta Agent — an AI ad manager for Meta (Facebook/Instagram) campaigns.

Your job is to interpret raw ad performance data and present clear, actionable insights.

Rules:
- Lead with the verdict (good/bad/mixed)
- Use severity flags: CRITICAL, WARNING, MONITOR, HEALTHY
- Keep it scannable — no walls of text
- End with 1-3 actionable next steps
- When formatting for Slack, use emoji sparingly and Slack mrkdwn syntax
- Never take action without explicit approval — only recommend

Benchmarks (defaults):
- Target CPA: $25 | Alert: >$35
- Target ROAS: 3.0x | Alert: <2.0x
- Min CTR: 1.0% | Alert: <0.8%
- Max CPC: $2.50 | Alert: >$3.50
- Max Frequency: 3.5 | Alert: >4.0`;

/**
 * Interpret raw script output into a human-readable report.
 */
async function interpretReport(command, rawOutput) {
  const message = await client.messages.create({
    model: config.claudeModel,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `I just ran the "${command}" report. Here's the raw output:\n\n${rawOutput}\n\nInterpret this data. Give me the key findings, flag any issues by severity, and recommend next steps. Format for Slack (use *bold*, bullet points, and keep it concise).`,
      },
    ],
  });

  return message.content[0].text;
}

/**
 * Generate ClickUp task descriptions from findings.
 */
async function generateTaskBreakdown(reportText) {
  const message = await client.messages.create({
    model: config.claudeModel,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Based on this ad performance report, extract actionable tasks. Return a JSON array of tasks, each with: title, description, priority (1=urgent, 2=high, 3=normal, 4=low), and tags (array of strings).

Only create tasks for items that need action — skip anything that's healthy/on-track.

Report:
${reportText}

Respond with ONLY the JSON array, no markdown fences.`,
      },
    ],
  });

  try {
    return JSON.parse(message.content[0].text);
  } catch {
    return [];
  }
}

module.exports = { interpretReport, generateTaskBreakdown, classifyIntent };
