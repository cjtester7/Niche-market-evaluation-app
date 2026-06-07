/*
  FILE:        analyze.js
  VERSIONED:   analyze-v3.js
  DEPLOYED_AS: analyze.js
               NOTE: Netlify resolves functions by filename only. The deployed
               filename must always be "analyze.js" to match the frontend fetch
               path /.netlify/functions/analyze. Version is tracked here in the
               header and in the project changelog. netlify.toml documents this
               convention under [functions] comments.
  VERSION:     3.0
  DATE:        2026-06-06 @ 22:55 EST
  CR:          CR003
  CHANGES:     - Added DEPLOYED_AS note and timestamp to header
               - Added VERSIONED alias to header
               - No logic changes (CR003 is standards/structure only)
  AUTHOR:      Thinkezly / CJ
  PREV VERSION: analyze.js v2.0 (CR002)
*/

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "ANTHROPIC_API_KEY not configured in Netlify environment variables." }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body." }) };
  }

  const { niche, scores } = body;
  if (!niche || !scores) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing niche or scores." }) };
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const criteriaNames = {
    pain:   "Pain Severity",
    pay:    "Ability to Pay",
    reach:  "Reachability",
    repeat: "Process Repetition",
    comp:   "Competition Density",
    expand: "Expansion Potential",
    edge:   "Your Edge",
  };

  const breakdown = Object.entries(scores)
    .map(([k, v]) => `${criteriaNames[k]}: ${v}/10`)
    .join(", ");

  const systemPrompt = `You are an AI agency niche strategist. You help AI automation consultants evaluate whether a niche is worth pursuing using the 7-point scoring framework developed by Luke Pierce of Boom Automations.

The framework scores niches across:
1. Pain Severity — how bad and revenue-impacting is the problem
2. Ability to Pay — critical disqualifier; high pain + no capital = support group, not a market
3. Reachability — can you get in front of decision-makers
4. Process Repetition — standardized workflows = easier AI implementation
5. Competition Density — underserved segments score highest
6. Expansion Potential — deep back-end work vs one-and-done
7. Your Edge — unfair advantage from experience or relationships

Scoring tiers: 55-70 = powerhouse, 40-54 = viable (validate first), below 40 = high risk.

Key principle: "Generalists fight for scraps. Specialists get chosen." The #1 AI opportunity in any niche must (a) cost them real money, (b) be measurable before/after, and (c) be a problem they already know they have.

Respond with clear labeled sections using ALL-CAPS headers followed by a colon (e.g. "VERDICT:"). Be specific and actionable. No fluff.`;

  const userMessage = `Analyze this niche for an AI automation agency:

Niche: "${niche}"
Scores: ${breakdown}
Total: ${total}/70

Provide the following sections:

VERDICT: One sentence on whether this niche is worth pursuing at this score.

TOP STRENGTHS: The 2-3 highest-scoring criteria and what they mean in practice for this niche.

BIGGEST RISKS: The 2-3 weakest criteria and what could kill the deal.

LEAD USE CASE: The single best AI automation to lead with for this niche. Must meet the 3 conditions: costs real money, measurable before/after, problem they already know about.

RESEARCH & OUTREACH STRATEGY: Where to find decision-makers, what pain to open with, and what the "prescription" opener looks like on a sales call.

MARKET SIZE CHECK: Rough estimate of how many businesses fit this niche in the US and whether that's sustainable at a 20-conversation-per-close ratio.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || "Anthropic API error." }),
      };
    }

    const text = data.content?.[0]?.text || "";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysis: text }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Function error: " + err.message }),
    };
  }
};
