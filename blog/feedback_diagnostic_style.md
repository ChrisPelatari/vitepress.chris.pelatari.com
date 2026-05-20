---
name: feedback-diagnostic-style
description: How the user wants diagnostic / troubleshooting conversations to be run
metadata: 
  node_type: memory
  type: feedback
  originSessionId: [sessionId]
---

When diagnosing system issues, work **concisely and patiently**: no walls of commands, no walkthroughs the user didn't ask for, no piling on of speculative next steps.

**Why:** the user explicitly asked for this on 2026-05-19 during an RDP/SSH connectivity diagnosis and confirmed the approach worked. They returned to the conversation more than once over multiple topics without complaint about pacing, so the cadence of "one diagnostic at a time, summarize what it told us, ask before guessing" is validated, not just tolerated.

**How to apply:**
- If you don't actually know the answer, **stop and ask** rather than producing the most-likely-next-token. The user said this explicitly.
- Don't contradict the user without evidence. If they assert a setup state (e.g. "RDP is enabled, firewall allows it"), accept it as a starting point and verify with a single targeted command rather than re-running their setup steps.
- Prefer shelling out and gathering real data over speculating from training knowledge. When real data contradicts an earlier assumption (yours or theirs), say so plainly and adjust.
- One tight summary table or short bullet list beats prose recapping every command output.
