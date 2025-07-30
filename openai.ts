import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-default-key"
});

export interface ScenarioStep {
  id: number;
  title: string;
  situation: string;
  characters: Array<{
    name: string;
    role: string;
    personality: string;
    avatar: string;
  }>;
  decisions: Array<{
    id: number;
    text: string;
    description: string;
    points: number;
    feedback: string;
  }>;
}

export interface AIFeedback {
  type: 'insight' | 'strength' | 'improvement' | 'recommendation';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface GeneratedScenario {
  title: string;
  description: string;
  framework: string;
  difficulty: string;
  duration: number;
  learningObjectives: string[];
  content: {
    steps: ScenarioStep[];
  };
}

export async function generateScenario(
  framework: string,
  difficulty: string,
  topic?: string
): Promise<GeneratedScenario> {
  const prompt = `Generate a realistic Agile project management scenario for ${framework} framework at ${difficulty} level${topic ? ` focused on ${topic}` : ''}.

The scenario should address real-world challenges that project managers face, including:
- Stakeholder conflicts and competing priorities
- Time pressure and decision-making under uncertainty
- Team dynamics and communication challenges
- Technical constraints and resource limitations

Include:
1. A compelling title and description
2. Estimated duration (10-30 minutes)
3. 2-3 learning objectives
4. At least one detailed step with:
   - Realistic situation description
   - 2-3 key characters with names, roles, and personality traits
   - 4 decision options with different point values (10-25 points)
   - Specific feedback for each decision explaining why it's effective or not

Make characters diverse and realistic. Decisions should reflect different approaches to Agile leadership and project management.

Respond with valid JSON in this exact format:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert Agile coach and project management trainer. Generate realistic, educational scenarios that help project managers develop practical skills."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as GeneratedScenario;
  } catch (error) {
    throw new Error(`Failed to generate scenario: ${error}`);
  }
}

export async function generateAIFeedback(
  scenarioId: number,
  userDecisions: Array<{ stepId: number; decisionId: number; points: number }>,
  userProfile: { completedScenarios: number; successRate: number; strengths?: string[]; weaknesses?: string[] }
): Promise<AIFeedback[]> {
  const prompt = `Analyze the user's performance in an Agile scenario and provide personalized coaching feedback.

User Profile:
- Completed scenarios: ${userProfile.completedScenarios}
- Success rate: ${userProfile.successRate}%
- Known strengths: ${userProfile.strengths?.join(', ') || 'None identified'}
- Areas for improvement: ${userProfile.weaknesses?.join(', ') || 'None identified'}

User Decisions:
${userDecisions.map(d => `Step ${d.stepId}: Decision ${d.decisionId} (${d.points} points)`).join('\n')}

Provide 2-3 specific, actionable insights focusing on:
1. What they did well (strengths to reinforce)
2. Areas for improvement with specific suggestions
3. Personalized recommendations based on their profile

Each insight should be 1-2 sentences and directly applicable to real project management situations.

Respond with valid JSON array of feedback objects:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an experienced Agile coach providing personalized feedback to help project managers improve their skills. Be specific, constructive, and encouraging."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"feedback": []}');
    return result.feedback as AIFeedback[];
  } catch (error) {
    throw new Error(`Failed to generate AI feedback: ${error}`);
  }
}

export async function generateNextScenarioStep(
  currentStep: ScenarioStep,
  userDecision: { decisionId: number; points: number },
  scenarioContext: { framework: string; difficulty: string; title: string }
): Promise<ScenarioStep> {
  const prompt = `Continue an Agile scenario based on the user's decision.

Current Scenario: ${scenarioContext.title} (${scenarioContext.framework}, ${scenarioContext.difficulty})

Previous Step:
- Situation: ${currentStep.situation}
- User chose decision ${userDecision.decisionId} (${userDecision.points} points)

Generate the next logical step that:
1. Builds on the consequences of their decision
2. Introduces new challenges or complications
3. Maintains realistic project management dynamics
4. Provides 4 new decision options with varying effectiveness

The step should feel like a natural continuation of the story while presenting new learning opportunities.

Respond with valid JSON:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are creating an educational Agile simulation. Make the scenario progression feel realistic and challenging while maintaining educational value."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as ScenarioStep;
  } catch (error) {
    throw new Error(`Failed to generate next scenario step: ${error}`);
  }
}
