# Crimson Meta Agent

An AI ad manager that replaces 20 minutes of Ads Manager clicking with a 2-minute summary over coffee.

Powered by [Claude Code](https://claude.ai/code). Talks to you on **Slack**. Tracks actions in **ClickUp**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Powered%20by-Claude%20Code-blueviolet)](https://claude.ai/code)

---

**Monitor → Detect Fatigue → Find Winners → Shift Budget → Generate Copy → Upload to Meta → Repeat**

- **Morning briefing** — Spend pacing, active campaigns, 7-day trends
- **Find bleeders** — Ads with high spend + low CTR bleeding your budget
- **Spot winners** — Top performers ready to scale
- **Detect fatigue** — CTR declining, frequency climbing, CPC rising
- **Generate copy** — AI writes ad copy matched to your actual image creatives
- **Upload to Meta** — Push new ads straight to your account via Graph API
- **Pixel + CAPI audit** — Audit tracking, test server-side events, optimize for 9.3+ EMQ
- **Take action** — Pause, resume, adjust budgets (always with your approval)

All from Slack. All tracked in ClickUp. No Ads Manager required.

---

## How It Works

```
8:00 AM (automatic)
  │
  ├──▶ Crimson runs the 5 Daily Questions
  ├──▶ Claude interprets raw data into insights
  ├──▶ Posts briefing to Slack #ads-alerts
  └──▶ Creates ClickUp tasks for each finding
         ├── "Pause ad X — bleeding $42/day" (Urgent)
         ├── "Refresh creative Y — CTR dropped 25%" (High)
         └── "Scale ad Z — top performer" (Normal)

You (from your phone):
  ├── Read briefing in Slack
  ├── Reply: "pause that bleeder" → Crimson executes
  ├── Or: Move ClickUp task to "Approved" → triggers action
  └── Done in 2 minutes
```

---

## Quick Start

### 1. Install prerequisites

```bash
git clone https://github.com/lanrcaz/meta-ads-kit.git
cd meta-ads-kit

# Install social-cli (Meta API engine)
npm install -g @vishalgojha/social-cli

# Authenticate with Meta
social auth login

# Set your default ad account
social marketing accounts
social marketing set-default-account act_YOUR_ACCOUNT_ID

# Copy config
cp .env.example .env
cp ad-config.example.json ad-config.json
```

### 2. Choose your interface

You can use Crimson three ways — pick one or use all three:

| Interface | Best for | Setup |
|-----------|----------|-------|
| **Slack Bot** | Daily workflow from your phone | [Server setup](#server-mode-slack--clickup) |
| **Claude Code CLI** | Local deep dives and debugging | [CLI setup](#claude-code-cli) |
| **Shell scripts** | Cron jobs and piping to other tools | `./run.sh daily-check` |

---

## Server Mode: Slack + ClickUp

The recommended setup. Run the Crimson server and manage everything from Slack.

### Setup

```bash
cd server
cp .env.example .env
# Add your keys to .env (see below)

npm install
npm start
```

Required environment variables:

```bash
# Claude API (interprets reports)
ANTHROPIC_API_KEY=sk-ant-your-key

# Slack Bot (two-way messaging)
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_CHANNEL_ID=C00000000

# ClickUp (task tracking)
CLICKUP_API_TOKEN=pk_your-token
CLICKUP_LIST_ID=your-list-id
```

### Talking to @crimsonmeta on Slack

Message `@crimsonmeta` in any channel or DM — just talk naturally:

| You say | What happens |
|---------|-------------|
| "How are my ads doing?" | Runs the 5 Daily Questions |
| "Any bleeders I should pause?" | Finds ads losing money |
| "Which ads should I scale?" | Shows top performers |
| "Check for creative fatigue" | CTR decay, frequency, CPC signals |
| "Show me performance by age and gender" | Demographic breakdown |
| "Budget efficiency" | Ranks campaigns by cost efficiency |
| "Recommend budget shifts" | Reallocation suggestions |
| "Am I on track?" | Spend pacing check |
| "Account overview" | Quick high-level summary |
| "Pixel audit" | Meta Pixel health check |

Crimson uses pattern matching first (instant), then falls back to Claude intent classification for anything unusual. You can talk to it like a person.

When Crimson finds **CRITICAL** issues (ads bleeding money), the Slack message includes **Approve / Reject** buttons — tap to take action right from your phone.

### ClickUp Task Tracking

Every report automatically creates ClickUp tasks for actionable findings:

| Finding | ClickUp Task |
|---------|-------------|
| Bleeder detected | Urgent: "Pause [ad] — bleeding $X/day" |
| Creative fatigue | High: "Refresh creative — CTR dropped X%" |
| Budget shift needed | Normal: "Reallocate: [from] → [to]" |
| Winner to scale | Normal: "Scale [ad] — increase budget X%" |
| Pixel/EMQ issue | High: "Fix EMQ for [event] — target 9.3+" |

You can also **comment on any Crimson task** with a command (e.g., "run bleeders") to trigger a new report — results post back as a comment.

Move a task to **"Approved"** status to trigger the action.

### Scheduled Briefings

The server runs a daily briefing automatically (default: 8am weekdays). Configure the schedule in your `.env`:

```bash
DAILY_CRON=0 8 * * 1-5    # Weekdays at 8am
```

The briefing runs → posts to Slack → creates ClickUp tasks. You just read and approve from your phone.

---

## Claude Code CLI

For local deep dives, debugging, and one-off commands. Start Claude Code in the project directory:

```bash
cd meta-ads-kit
claude
```

Then use slash commands:

```
/daily-check          # Morning briefing (5 Daily Questions)
/bleeders             # Find ads bleeding money
/winners              # Top performers to scale
/fatigue              # Creative fatigue check
/efficiency           # Budget efficiency analysis
/recommend            # Budget shift recommendations
/pacing               # Spend pacing vs daily budgets
/overview             # High-level account overview
/copy-gen             # Generate ad copy for image creatives
/ad-upload            # Push ads to Meta via Graph API
/pixel-audit          # Audit Meta Pixel setup
/emq-check            # Event Match Quality scores
/notify-slack         # Send report to Slack
/sync-clickup         # Create ClickUp tasks from findings
```

Or just talk naturally — Claude reads the `CLAUDE.md` and understands the full ad management workflow.

---

## The 5 Daily Questions

The core of the system. Five questions that replace Ads Manager:

| # | Question | What It Tells You |
|---|----------|-------------------|
| 1 | Am I on track? | Today's spend vs. pacing expectations |
| 2 | What's running? | Active campaigns at a glance |
| 3 | How's performance? | 7-day metrics by campaign |
| 4 | Who's winning/losing? | Ad-level performance sorted |
| 5 | Any fatigue? | CTR trends, frequency, CPC movement |

---

## Skills

| Skill | What It Does |
|-------|-------------|
| `meta-ads` | Core reporting — daily checks, campaign insights, bleeders, winners, fatigue detection |
| `ad-creative-monitor` | Track creative performance over time, detect fatigue before it kills your ROAS |
| `budget-optimizer` | Analyze spend efficiency, recommend budget shifts between campaigns/adsets |
| `ad-copy-generator` | Generate ad copy matched to specific image creatives — analyzes the visual, writes copy that reinforces it, outputs `asset_feed_spec`-ready variants |
| `ad-upload` | Push images and copy straight to Meta via Graph API — no Ads Manager copy-paste required |
| `pixel-capi` | Audit Meta Pixel + Conversions API setup, test server-side events, optimize Event Match Quality to 9.3+. Platform guides for Next.js, Shopify, WordPress, Webflow, GHL, ClickFunnels |

### The Full Loop

```
Monitor (meta-ads) → Detect fatigue (ad-creative-monitor) → Shift budget (budget-optimizer)
    → Generate new copy (ad-copy-generator) → Upload to Meta (ad-upload) → Monitor again

Pixel + CAPI (pixel-capi) runs alongside: audit tracking, test server events, optimize EMQ
```

---

## Configuration

Edit `ad-config.json` to set your benchmarks:

```json
{
  "account": {
    "id": "act_123456789",
    "name": "My Brand"
  },
  "benchmarks": {
    "target_cpa": 25.00,
    "target_roas": 3.0,
    "max_frequency": 3.5,
    "min_ctr": 1.0,
    "max_cpc": 2.50
  },
  "alerts": {
    "bleeder_ctr_threshold": 1.0,
    "bleeder_frequency_threshold": 3.5,
    "fatigue_ctr_drop_pct": 20,
    "spend_pace_alert_pct": 15
  },
  "reporting": {
    "default_preset": "last_7d",
    "timezone": "America/New_York"
  }
}
```

---

## Project Structure

```
meta-ads-kit/
├── README.md                  # You're here
├── CLAUDE.md                  # Claude Code agent instructions
├── SETUP.md                   # Detailed setup guide
├── run.sh                     # Shell script router
├── .env.example               # Environment template
├── ad-config.example.json     # Benchmarks template
├── .claude/
│   ├── settings.json          # Claude Code settings + MCP servers
│   ├── hooks.json             # Session start hooks
│   └── commands/              # 14 slash commands
├── server/                    # Slack + ClickUp bridge server
│   ├── src/
│   │   ├── index.js           # Entry point
│   │   ├── slack.js           # Slack bot (NLP + approval buttons)
│   │   ├── clickup.js         # ClickUp API (tasks + webhooks)
│   │   ├── claude.js          # Claude API (interpret + classify)
│   │   ├── runner.js          # Shell script executor + NLP parser
│   │   ├── scheduler.js       # Cron-based daily briefings
│   │   └── webhooks.js        # ClickUp webhook handler
│   └── .env.example           # Server environment template
├── skills/
│   ├── meta-ads/              # Core reporting & actions
│   ├── ad-creative-monitor/   # Creative fatigue tracking
│   ├── budget-optimizer/      # Spend efficiency analysis
│   ├── ad-copy-generator/     # AI copy matched to image creatives
│   ├── ad-upload/             # Push ads to Meta via Graph API
│   └── pixel-capi/            # Pixel + CAPI audit, testing, EMQ
└── SPEC.md                    # Full system spec
```

---

## Cost

| Component | Cost |
|-----------|------|
| social-cli | Free (open source) |
| Meta API | Free (your own ad account) |
| Claude API | Pay per use (interprets reports) |
| Claude Code CLI | Free tier available / Pro plan |
| Slack | Free (your workspace) |
| ClickUp | Free (your account) |

Your Meta ad spend is separate — this kit just helps you manage it smarter.

---

## Contributing

Open source. PRs welcome.

Ideas:
- Google Ads support (when social-cli adds it)
- Creative performance dashboards
- Automated A/B test analysis
- Multi-account agency mode
- Additional integrations (Discord, Notion, Linear)

---

MIT License. Use it, fork it, build on it.

---

Originally built by [Matt Berman](https://twitter.com/themattberman). Forked and extended with Claude Code + Slack + ClickUp integration.

---

Stop babysitting Ads Manager. Let Crimson do the watching.
