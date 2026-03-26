# Crimson Meta Agent

An open-source AI ad manager that replaces 20 minutes of Ads Manager clicking with a 2-minute summary over coffee.

Works with [Claude Code](https://claude.ai/code) or [OpenClaw](https://openclaw.ai) as your AI agent layer. Integrates with **Slack** and **ClickUp**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Works%20with-Claude%20Code-blueviolet)](https://claude.ai/code)
[![OpenClaw](https://img.shields.io/badge/Works%20with-OpenClaw-blue)](https://openclaw.ai)

---

**Monitor → Detect Fatigue → Find Winners → Shift Budget → Generate Copy → Upload to Meta → Repeat**

This kit automates your entire Meta Ads workflow:

- **Morning briefing** — Spend pacing, active campaigns, 7-day trends
- **Find bleeders** — Ads with high spend + low CTR bleeding your budget
- **Spot winners** — Top performers ready to scale
- **Detect fatigue** — CTR declining, frequency climbing, CPC rising
- **Generate copy** — AI writes ad copy matched to your actual image creatives
- **Upload to Meta** — Push new ads straight to your account via Graph API
- **Pixel + CAPI audit** — Audit your tracking setup, test server-side events, optimize for 9.3+ Event Match Quality
- **Take action** — Pause, resume, adjust budgets (always with your approval)

The result: A full ad management loop -- from monitoring to creative refresh to tracking optimization -- without opening Ads Manager.

---

## Why This Exists

I've spent 20 years in marketing. Scaled Fireball Whisky from one state to a billion-dollar global brand. Ran campaigns for Heineken, Hennessy, Buffalo Trace. Now I run [Emerald Digital](https://emerald.digital), an AI-first marketing agency.

Here's what I learned: 90% of ad management is pattern recognition. Spend trending up or down. CTR declining (creative fatigue). CPA spiking (audience exhaustion). Winners emerging. Losers bleeding.

You don't need to stare at Ads Manager to spot these patterns. An AI agent can do it and tell you what matters.

I'm open-sourcing this because every founder running Meta ads deserves a copilot.

---

## Quick Start

```bash
git clone https://github.com/themattberman/meta-ads-kit.git
cd meta-ads-kit

# Install social-cli (the engine under the hood)
npm install -g @vishalgojha/social-cli

# Authenticate with Meta
social auth login

# Set your default ad account
social marketing accounts
social marketing set-default-account act_YOUR_ACCOUNT_ID

# Copy config
cp .env.example .env
cp ad-config.example.json ad-config.json

# Edit ad-config.json with your benchmarks
```

See [SETUP.md](SETUP.md) for detailed instructions.

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

```bash
# Run all 5 questions
./run.sh daily-check

# Or with OpenClaw agent
openclaw start
# Then message: "Daily ads check"
```

---

## Skills

| Skill | What It Does |
|-------|-------------|
| `meta-ads` | Core reporting — daily checks, campaign insights, bleeders, winners, fatigue detection |
| `ad-creative-monitor` | Track creative performance over time, detect fatigue before it kills your ROAS |
| `budget-optimizer` | Analyze spend efficiency, recommend budget shifts between campaigns/adsets |
| `ad-copy-generator` | Generate ad copy matched to specific image creatives — analyzes the visual, writes copy that reinforces it, outputs `asset_feed_spec`-ready variants |
| `ad-upload` | Push images and copy straight to Meta via Graph API -- no Ads Manager copy-paste required |
| `pixel-capi` | Audit Meta Pixel + Conversions API setup, test server-side events, optimize Event Match Quality to 9.3+. Platform guides for Next.js, Shopify, WordPress, Webflow, GHL, ClickFunnels |

Each skill can run standalone or as part of the daily routine.

### The Full Loop

The five skills chain together into a closed loop:

```
Monitor (meta-ads) → Detect fatigue (ad-creative-monitor) → Shift budget (budget-optimizer)
    → Generate new copy (ad-copy-generator) → Upload to Meta (ad-upload) → Monitor again

Pixel + CAPI (pixel-capi) runs alongside: audit tracking, test server events, optimize EMQ
```

No Ads Manager required at any step.

---

## How It Works

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Daily Check │───▶│   Patterns   │───▶│    Budget     │───▶│  Copy Gen    │───▶│   Upload     │
│  (5 questions│    │  & Fatigue   │    │  Optimizer    │    │  (per image) │    │  (Graph API) │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼                   ▼
 Spend pacing        Bleeders 🩸         Shift budget       Copy matched to      Push ads live
 Active campaigns    Winners 🏆          Scale winners      each creative        No Ads Manager
 7-day trends        Fatigue 😴          Cap losers         asset_feed_spec      Image + copy
```

**Morning (automated via cron):**
1. Run daily-check — flag bleeders, winners, and fatigue
2. Send strategist-level briefing to Slack/Telegram with recommendations and new creative concepts
3. You approve from your phone

**When you need new creatives:**
1. Generate copy matched to specific image creatives
2. Review the variants
3. Upload directly to Meta — images, copy, and all

**You (2 minutes over coffee):**
1. Read the summary
2. Approve/reject recommendations
3. Done.

---

## Running With OpenClaw

This kit is built for [OpenClaw](https://openclaw.ai), an open-source AI agent framework.

```bash
# Install OpenClaw
npm install -g openclaw

# Set up the agent
cd meta-ads-kit
openclaw start
```

Then just message it naturally:

- "How are my ads doing?"
- "Any bleeders I should pause?"
- "Which ads should I scale?"
- "Check for creative fatigue"
- "Show me performance by age and gender"
- "Pause ad 12345678"

The agent handles the orchestration, interprets the data, and asks before taking any action.

### Automate It

Set up a daily cron in OpenClaw:

```
"Run my daily ads check every morning at 8am and send me the summary"
```

The agent will run the 5 questions, analyze the results, and message you with findings + recommendations. You approve from your phone.

---

## Running With Claude Code

This kit also works with [Claude Code](https://claude.ai/code) — Anthropic's CLI for Claude. It replaces OpenClaw as the agent layer with built-in slash commands, Slack notifications, and ClickUp task sync.

```bash
# Install Claude Code
# See https://claude.ai/code for installation

# Navigate to the project
cd meta-ads-kit

# Start Claude Code
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

### Slack Integration

Send daily briefings and alerts to Slack channels:

```bash
# 1. Create a Slack app at https://api.slack.com/apps
# 2. Add scopes: chat:write, channels:read, channels:history
# 3. Set environment variables:
export SLACK_BOT_TOKEN=xoxb-your-token
export SLACK_TEAM_ID=T00000000
```

Then use `/notify-slack` to push any report to a Slack channel.

### ClickUp Integration

Convert ad findings into ClickUp tasks automatically:

```bash
# 1. Get your API token at https://app.clickup.com/settings/apps
# 2. Set environment variable:
export CLICKUP_API_TOKEN=pk_your-token
```

Then use `/sync-clickup` to create tasks from bleeders, fatigue alerts, budget shifts, and other findings.

### Scheduled Briefings

Use Claude Code's `/schedule` to automate daily briefings:

```
/schedule "Run /daily-check every weekday at 8am and send results to Slack"
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

Or just tell the OpenClaw agent your benchmarks conversationally — it'll figure it out.

---

## Cost

| Tool | Monthly Cost |
|------|-------------|
| social-cli | Free (open source) |
| Meta API | Free (your own ad account) |
| Claude Code | Free tier available / Pro plan |
| OpenClaw | Free (open source, alternative) |
| Slack MCP | Free (uses your Slack workspace) |
| ClickUp MCP | Free (uses your ClickUp account) |

Your Meta ad spend is separate — this kit just helps you manage it smarter.

---

## Project Structure

```
meta-ads-kit/
├── README.md              # You're here
├── CLAUDE.md              # Claude Code agent instructions
├── SETUP.md               # Detailed setup guide
├── run.sh                 # Report runner
├── .env.example           # Environment template
├── ad-config.example.json # Benchmarks template
├── .claude/
│   ├── settings.json      # Claude Code settings + MCP servers (Slack, ClickUp)
│   ├── hooks.json         # Session start hooks
│   └── commands/          # Slash commands (/daily-check, /bleeders, etc.)
├── skills/
│   ├── meta-ads/             # Core reporting & actions
│   ├── ad-creative-monitor/  # Creative fatigue tracking
│   ├── budget-optimizer/     # Spend efficiency analysis
│   ├── ad-copy-generator/    # AI copy matched to image creatives
│   ├── ad-upload/            # Push ads to Meta via Graph API
│   └── pixel-capi/           # Pixel + CAPI audit, testing, EMQ optimization
│       ├── scripts/          # pixel-audit, pixel-setup, capi-test, capi-send, emq-check
│       └── references/       # Complete pixel + CAPI knowledge base
├── SOUL.md                # Agent personality (for OpenClaw)
├── AGENTS.md              # Agent instructions
└── SPEC.md                # Full system spec
```

---

## Contributing

This is open source. PRs welcome.

Ideas for contribution:

- Google Ads support (social-cli may add this)
- Creative performance dashboards
- Automated A/B test analysis
- Multi-account agency mode
- Additional MCP server integrations (Discord, Notion, Linear, etc.)

---

MIT License. Use it, fork it, build on it.

---

Built by [Matt Berman](https://twitter.com/themattberman).

- 🐦 Twitter/X: [@themattberman](https://twitter.com/themattberman)
- 📰 Newsletter: [Big Players](https://bigplayers.co)
- 🏢 Agency: [Emerald Digital](https://emerald.digital)

---

Stop babysitting Ads Manager. Let your AI copilot do the watching.

Star the repo if this helps. It tells me to keep building.
