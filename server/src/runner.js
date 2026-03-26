const { execFile } = require("child_process");
const path = require("path");
const config = require("./config");

/**
 * Execute a run.sh command and return the raw output.
 */
function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const allArgs = [command, ...args];

    execFile("bash", [config.runScript, ...allArgs], {
      cwd: config.projectRoot,
      timeout: 60_000,
      maxBuffer: 1024 * 1024,
      env: { ...process.env, PATH: process.env.PATH },
    }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Command "${command}" failed: ${stderr || error.message}`));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

/**
 * Execute a pixel/capi script directly.
 */
function runScript(scriptPath, args = []) {
  const fullPath = path.resolve(config.skillsDir, scriptPath);

  return new Promise((resolve, reject) => {
    execFile("bash", [fullPath, ...args], {
      cwd: config.projectRoot,
      timeout: 60_000,
      maxBuffer: 1024 * 1024,
      env: { ...process.env, PATH: process.env.PATH },
    }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Script "${scriptPath}" failed: ${stderr || error.message}`));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

/**
 * Parse a natural language message into a command.
 * Returns { command, args } or null if no match.
 */
function parseCommand(text) {
  const normalized = text.toLowerCase().trim();

  const patterns = [
    { match: /daily.?check|morning.?brief|how.?are.?my.?ads|5.?questions/, command: "daily-check" },
    { match: /bleed|losing.?money|underperform|money.?losers/, command: "bleeders" },
    { match: /winner|top.?perform|best.?ads|scale/, command: "winners" },
    { match: /fatigu|tired|stale|ctr.?drop|creative.?health/, command: "fatigue" },
    { match: /efficien|budget.?rank|cost.?per/, command: "efficiency" },
    { match: /recommend|budget.?shift|reallocat|optimize.?budget/, command: "recommend" },
    { match: /pac(?:e|ing)|spend.?rate|on.?track/, command: "pacing" },
    { match: /overview|summary|account.?status/, command: "overview" },
    { match: /campaign|what.?s.?running|active/, command: "campaigns" },
    { match: /weekly|week.?report/, command: "weekly" },
    { match: /pixel.?audit|pixel.?check|pixel.?setup/, command: "pixel-audit", script: "pixel-capi/scripts/pixel-audit.sh" },
    { match: /emq|match.?quality|signal.?quality/, command: "emq-check", script: "pixel-capi/scripts/emq-check.sh" },
  ];

  for (const p of patterns) {
    if (p.match.test(normalized)) {
      return { command: p.command, script: p.script || null, args: [] };
    }
  }

  return null;
}

module.exports = { runCommand, runScript, parseCommand };
