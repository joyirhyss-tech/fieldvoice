import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  intention: string;
  objective: string;
  agencyContext?: string;
  llmProvider: 'anthropic' | 'openai';
  llmApiKey: string;
}

const SYSTEM_PROMPT = `You are a survey design expert for mission-driven organizations (nonprofits, social services, government agencies). Your job is to generate thoughtful, trauma-informed survey questions that surface real voices from the field.

Given the user's intention (why they're running this survey) and objective (what outcome they need), generate 8-10 survey questions.

Rules:
- Use a MIX of question types: open, scale, reflective, pulse, yes-no, multiple-choice
- Questions should be human-centered, not corporate jargon
- Include at least 1 reflective question (narrative/storytelling prompt)
- Include at least 1 pulse question (quick emotional check-in)
- Include design notes where helpful (short guidance for the survey designer)
- Questions should be appropriate for frontline/direct service staff
- Be culturally responsive and trauma-informed in language

Return ONLY a JSON array with this exact structure (no markdown, no explanation):
[
  {
    "text": "Question text here",
    "type": "open|scale|reflective|pulse|yes-no|multiple-choice",
    "designNote": "Optional guidance note or null"
  }
]`;

async function callAnthropic(apiKey: string, userPrompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        { role: 'user', content: userPrompt },
      ],
      system: SYSTEM_PROMPT,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

async function callOpenAI(apiKey: string, userPrompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 2048,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { intention, objective, agencyContext, llmProvider, llmApiKey } = body;

    if (!intention || !objective) {
      return NextResponse.json(
        { error: 'Intention and objective are required' },
        { status: 400 },
      );
    }

    if (!llmProvider || !llmApiKey) {
      return NextResponse.json(
        { error: 'LLM provider and API key are required' },
        { status: 400 },
      );
    }

    const userPrompt = [
      `Survey Intention: ${intention}`,
      `Survey Objective: ${objective}`,
      agencyContext ? `Agency Context: ${agencyContext}` : '',
      '',
      'Generate 8-10 survey questions based on the above.',
    ].filter(Boolean).join('\n');

    let rawResponse: string;

    if (llmProvider === 'anthropic') {
      rawResponse = await callAnthropic(llmApiKey, userPrompt);
    } else {
      rawResponse = await callOpenAI(llmApiKey, userPrompt);
    }

    // Parse the JSON response — strip any markdown fences if present
    const cleaned = rawResponse
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Map to SurveyQuestion format
    const questions = parsed.map((q: { text: string; type: string; designNote?: string | null }, i: number) => ({
      id: `sq-ai-${Date.now()}-${i}`,
      text: q.text,
      type: q.type || 'open',
      source: 'ai-generated' as const,
      included: true,
      designNote: q.designNote || undefined,
    }));

    return NextResponse.json({ questions });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
