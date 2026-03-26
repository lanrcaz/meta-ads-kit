Check **Event Match Quality (EMQ)** scores and provide optimization recommendations.

Execute `./skills/pixel-capi/scripts/emq-check.sh` and analyze results.

Show:
- Current EMQ score per event type
- Matching parameters being sent (email, phone, name, etc.)
- Missing parameters that would boost EMQ
- Prioritized fixes ranked by EMQ impact

**Matching parameter weights (approximate):**
- Email: highest impact
- Phone: high impact
- First/Last name: medium impact
- City/State/Zip: medium impact
- External ID: medium impact
- IP + User Agent: lower impact
- fbp/fbc cookies: lower impact

Target: EMQ 9.3+ for Purchase, 8.0+ for Lead events.
