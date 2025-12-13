// Generate dynamic prompts based on user profile
function generatePrompts(profile) {
  const name = profile?.name || 'the user';
  const role = profile?.role || 'someone looking for opportunities';
  const focus = profile?.focus || 'various projects';
  const goals = profile?.goals || 'opportunities and insights';
  const skills = profile?.skills || 'various skills';
  const constraints = profile?.constraints || 'typical constraints';
  const style = profile?.style || 'direct';

  const styleInstructions = {
    direct: 'Be direct and concise. No fluff. Bullet points are good.',
    detailed: 'Be thorough and detailed. Explain your reasoning. Provide context.',
    casual: 'Be conversational and casual. Like talking to a smart friend.',
  };

  const styleNote = styleInstructions[style] || styleInstructions.direct;

  return {
    exploit: `You are an opportunity analyst for ${name}, who is a ${role}.

They are currently focused on: ${focus}
They are looking for: ${goals}
Their strengths: ${skills}
Their constraints: ${constraints}

Analyze this content and identify:
1. **Immediate Opportunities** - What can ${name} act on THIS WEEK given their skills and focus?
2. **Relevant Angles** - How does this connect to what they're building? Could this inspire a feature, pivot, or new direction?
3. **Market Gaps** - What are people clearly wanting that doesn't exist yet? What could ${name} realistically build?
4. **Quick Wins** - Smallest possible action that captures value from this insight
5. **Contrarian Take** - What is everyone missing? What's the non-obvious opportunity?

${styleNote}
Prioritize actionable specifics over abstract advice. Tailor everything to ${name}'s specific situation.`,

    explain: `You are a translator helping ${name} understand complex topics. They are a ${role}.

Their background: ${focus}
Their constraints: ${constraints}

Explain what's being discussed in this content:
1. **The Core Idea** - One sentence a smart 12-year-old would get
2. **How It Actually Works** - Use analogies to physical things (restaurants, cars, mail, etc.)
3. **Why People Care** - What problem does this solve? What does it enable?
4. **The Catch** - What are the limitations, costs, or gotchas nobody mentions?
5. **${name}'s Cheat Code** - How could they use this given their skills (${skills}) without deep expertise?

${styleNote}
No unnecessary jargon. Make it practical and applicable to their situation.`,

    productize: `You are a product strategist for ${name}, who is a ${role}.

They are building: ${focus}
Looking for: ${goals}
Their skills: ${skills}
Their constraints: ${constraints}

Analyze this content for monetization potential:
1. **Product Ideas** - What could ${name} specifically build and sell given their skills?
2. **Audience** - Who would pay? How much? How do you reach them?
3. **MVP Scope** - What's the smallest version that people would pay for?
4. **Competitive Landscape** - Who else is doing this? What's the gap ${name} could fill?
5. **Unfair Advantage** - How do ${name}'s specific skills create an edge?
6. **Revenue Model** - One-time, subscription, freemium, or something else?
7. **First 48 Hours** - Exact steps to validate this idea before building

${styleNote}
Be specific about numbers, platforms, and tactics. No generic advice. Everything should be actionable for ${name}'s specific situation.`
  };
}

const SUMMARIZE_PROMPT = `You are a reply analyst preparing context for a strategic opportunity finder. Extract EVERYTHING useful from these replies/comments.

Output a thorough summary:

1. **Overall Sentiment** - Is the crowd excited, skeptical, frustrated, curious? What's the vibe?

2. **Key Themes** (2-5 themes) - What topics keep coming up? Be specific.

3. **Pain Points & Frustrations** - What problems are people expressing? What's broken or missing for them?

4. **Questions & Confusion** - What do people want to know? What don't they understand?

5. **Ideas & Suggestions** - Any novel insights, feature requests, or "someone should build X" moments?

6. **Skepticism & Counterarguments** - What pushback exists? What are the doubters saying?

7. **Expert Signals** - Any replies from people with clear expertise or credibility? What do they add?

8. **Use Cases Mentioned** - Specific examples of how people would use this or are using similar things?

9. **Notable Quotes** (3-5 direct quotes) - Capture the most insightful, passionate, or representative voices verbatim.

Be thorough. The next step is strategic analysis - give it rich material to work with.`;

async function callClaude(apiKey, model, system, userContent, maxTokens = 1500) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.content[0].text;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mode, tweetContent, topReplies, profile } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Generate prompts based on user profile
  const PROMPTS = generatePrompts(profile);

  if (!mode || !PROMPTS[mode]) {
    return res.status(400).json({ error: 'Invalid mode' });
  }

  if (!tweetContent || !tweetContent.trim()) {
    return res.status(400).json({ error: 'Content required' });
  }

  try {
    let replySummary = '';

    // Stage 1: If there are replies, summarize them with Haiku (fast & cheap)
    if (topReplies && topReplies.trim()) {
      replySummary = await callClaude(
        apiKey,
        'claude-3-5-haiku-20241022',
        SUMMARIZE_PROMPT,
        `Here are the replies/comments to analyze:\n\n${topReplies}`,
        1200
      );
    }

    // Stage 2: Main analysis with Sonnet (smart)
    const analysisInput = `CONTENT:
${tweetContent}

${replySummary ? `COMMUNITY RESPONSE (summarized from ${topReplies.split('\n\n').length} replies):
${replySummary}` : '(No replies/comments provided)'}`;

    const result = await callClaude(
      apiKey,
      'claude-sonnet-4-5-20250929',
      PROMPTS[mode],
      analysisInput,
      2000
    );

    return res.status(200).json({
      result,
      meta: {
        repliesProcessed: topReplies ? topReplies.split('\n\n').length : 0,
        usedHaikuSummary: !!replySummary,
        profileUsed: !!profile?.name
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
