import { GoogleGenAI } from "@google/genai";

export interface DraftInput {
  name: string;
  email: string;
  roleType: "candidate" | "employer";
  message: string;
}

/** Drafts the acknowledgement with Gemini when a key is set, otherwise from a template. */
export async function writeDraft({ name, email, roleType, message }: DraftInput): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return `Dear ${name},\n\nThank you for reaching out to The Automation Studio regarding: "${message.slice(0, 80)}${message.length > 80 ? "..." : ""}".\n\nAs a registered ${roleType === "candidate" ? "Candidate seeking active representation" : "Employer scaling vetted engineering & leadership talent"}, our technical practice team has flagged your intake for priority evaluation.\n\nNext Steps:\n1. Dedicated Talent Partner assignment within 24 hours.\n2. Initial screening & architectural alignment discovery call.\n3. Portfolio & pipeline synchronization.\n\nWarm regards,\nThe Automation Studio Operations`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `
You are an expert executive recruitment director at "The Automation Studio", an elite technical recruitment agency.
Analyze the intake submission below and generate an articulate, warm, and highly professional email response.

- User Name: ${name}
- Email: ${email}
- Classification: ${roleType === "candidate" ? "Candidate (Job Seeker)" : "Employer (Hiring Firm)"}
- Inquired Needs / Overview: "${message}"

Guidelines:
1. Greet them personally and introduce The Automation Studio technical talent advisory team.
2. If Candidate: Acknowledge their specialization, detail the immediate next steps (portfolio/resume review timeframe of 24-48 hours, candidate screening portal), and offer transparent expectations.
3. If Employer: Highlight our rapid 14-day technical talent pipeline deployment, dedicated recruitment partner assignment, and propose scheduling an exploratory intake briefing.
4. Conclude with a warm, executive sign-off from The Automation Studio Technical Talent Practice.
5. Do NOT include markdown code blocks like \`\`\`html or \`\`\`. Output clean, structured plain text with standard line breaks.
`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: systemPrompt,
    });

    return response.text || "Draft generated with empty response.";
  } catch (genError: unknown) {
    console.error("API call error:", genError);
    return `Dear ${name},\n\nThank you for reaching out to The Automation Studio. We have received your inquiry as a ${roleType === "candidate" ? "Candidate" : "Corporate Employer"}.\n\nOur specialized technical talent advisory team is reviewing your profile and requirements. We will be in touch within 24 business hours with dedicated next steps.\n\nBest regards,\nThe Automation Studio Advisory Team`;
  }
}
