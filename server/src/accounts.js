const fs = require("fs");
const path = require("path");

let accountsConfig = null;

/**
 * Load accounts configuration from accounts.json.
 * Falls back to single-account mode if file doesn't exist.
 */
function loadAccounts() {
  const filePath = path.resolve(__dirname, "../accounts.json");

  if (!fs.existsSync(filePath)) {
    console.log("[accounts] No accounts.json found — running in single-account mode");
    console.log("[accounts] Copy accounts.example.json to accounts.json for multi-account support");
    accountsConfig = null;
    return;
  }

  accountsConfig = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const count = accountsConfig.accounts.length;
  console.log(`[accounts] Loaded ${count} account(s):`);
  for (const acct of accountsConfig.accounts) {
    console.log(`  - ${acct.name} (${acct.id}) → Slack: ${acct.slackChannel || "any"}`);
  }
}

/**
 * Resolve which ad account to use based on context.
 *
 * Priority:
 * 1. Explicit account mentioned in message ("for Acme" or "act_123")
 * 2. Slack channel → account mapping
 * 3. Default account (first in list, or META_AD_ACCOUNT env var)
 */
function resolveAccount(context = {}) {
  // Single-account mode
  if (!accountsConfig || !accountsConfig.accounts.length) {
    return {
      id: process.env.META_AD_ACCOUNT || null,
      name: "Default",
      benchmarks: accountsConfig?.defaults?.benchmarks || null,
      clickupListId: null,
    };
  }

  const { messageText, slackChannelId } = context;

  // 1. Check for explicit account ID in message (act_XXXXXXX)
  if (messageText) {
    const actMatch = messageText.match(/act_\d+/);
    if (actMatch) {
      const found = accountsConfig.accounts.find((a) => a.id === actMatch[0]);
      if (found) return found;
    }

    // Check for account name mentioned in message
    const normalized = messageText.toLowerCase();
    for (const acct of accountsConfig.accounts) {
      const nameWords = acct.name.toLowerCase().split(/[\s—–\-]+/);
      if (nameWords.some((w) => w.length > 2 && normalized.includes(w))) {
        return acct;
      }
    }
  }

  // 2. Match by Slack channel
  if (slackChannelId) {
    const found = accountsConfig.accounts.find(
      (a) => a.slackChannel === slackChannelId
    );
    if (found) return found;
  }

  // 3. Fall back to first account
  return accountsConfig.accounts[0];
}

/**
 * Get all accounts (for scheduled briefings that run across all clients).
 */
function getAllAccounts() {
  if (!accountsConfig || !accountsConfig.accounts.length) {
    return [
      {
        id: process.env.META_AD_ACCOUNT || null,
        name: "Default",
        benchmarks: null,
        clickupListId: null,
      },
    ];
  }

  return accountsConfig.accounts;
}

/**
 * List account names for display.
 */
function listAccounts() {
  if (!accountsConfig || !accountsConfig.accounts.length) {
    return "Single-account mode (no accounts.json configured)";
  }

  return accountsConfig.accounts
    .map((a, i) => `${i + 1}. *${a.name}* (${a.id})`)
    .join("\n");
}

module.exports = { loadAccounts, resolveAccount, getAllAccounts, listAccounts };
