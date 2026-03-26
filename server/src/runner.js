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
    { match: /daily.?check|morning.?brief|how.?are.?my.?ads|how.?are.?ads|how.?s.?it.?going|5.?questions|give.?me.?a.?rundown|what.?s.?happening/, command: "daily-check" },
    { match: /bleed|losing.?money|underperform|money.?losers|wast|should.?i.?pause|kill|cut|burning.?cash|hemorrhag/, command: "bleeders" },
    { match: /winner|top.?perform|best.?ads|which.?ads.?should.?i.?scale|what.?s.?working|what.?s.?doing.?well|crushing|killing.?it|strong/, command: "winners" },
    { match: /fatigu|tired|stale|ctr.?drop|creative.?health|frequency|worn.?out|getting.?old|refresh/, command: "fatigue" },
    { match: /efficien|budget.?rank|cost.?per|bang.?for|roi|return.?on|spend.?smart|where.?s.?money.?going/, command: "efficiency" },
    { match: /recommend|budget.?shift|reallocat|optimize.?budget|move.?budget|shift.?spend|redistribute/, command: "recommend" },
    { match: /pac(?:e|ing)|spend.?rate|on.?track|underspend|overspend|burn.?rate|how.?much.?spent/, command: "pacing" },
    { match: /overview|summary|account.?status|quick.?look|high.?level|big.?picture|at.?a.?glance/, command: "overview" },
    { match: /campaign|what.?s.?running|active|what.?s.?live|what.?s.?on/, command: "campaigns" },
    { match: /weekly|week.?report/, command: "weekly" },
    { match: /pixel.?audit|pixel.?check|pixel.?setup|tracking.?audit|pixel.?health/, command: "pixel-audit", script: "pixel-capi/scripts/pixel-audit.sh" },
    { match: /emq|match.?quality|signal.?quality|event.?quality/, command: "emq-check", script: "pixel-capi/scripts/emq-check.sh" },
    { match: /performance.?by.?age|performance.?by.?gender|breakdown|by.?age|by.?gender|by.?placement|demographics/, command: "custom" },
  ];

  for (const p of patterns) {
    if (p.match.test(normalized)) {
      return { command: p.command, script: p.script || null, args: [] };
    }
  }

  return null;
}

module.exports = { runCommand, runScript, parseCommand };
