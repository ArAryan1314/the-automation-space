import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  roleType: z.enum(["candidate", "employer"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export interface SubmissionRecord {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  roleType: "candidate" | "employer";
  message: string;
  aiDraft: string;
}

const globalStorage = global as unknown as {
  inMemorySubmissions?: SubmissionRecord[];
};

if (!globalStorage.inMemorySubmissions) {
  globalStorage.inMemorySubmissions = [];
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: globalStorage.inMemorySubmissions || [],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = ContactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Data Formats",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, email, roleType, message } = validation.data;

    let aiDraftText = "";
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== "") {
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

        aiDraftText = response.text || "Draft generated with empty response.";
      } catch (genError: unknown) {
        console.error("API call error:", genError);
        aiDraftText = `Dear ${name},\n\nThank you for reaching out to The Automation Studio. We have received your inquiry as a ${roleType === "candidate" ? "Candidate" : "Corporate Employer"}.\n\nOur specialized technical talent advisory team is reviewing your profile and requirements. We will be in touch within 24 business hours with dedicated next steps.\n\nBest regards,\nThe Automation Studio Advisory Team`;
      }
    } else {
      // Graceful standard operational protocol draft
      aiDraftText = `Dear ${name},\n\nThank you for reaching out to The Automation Studio regarding: "${message.slice(0, 80)}${message.length > 80 ? "..." : ""}".\n\nAs a registered ${roleType === "candidate" ? "Candidate seeking active representation" : "Employer scaling vetted engineering & leadership talent"}, our technical practice team has flagged your intake for priority evaluation.\n\nNext Steps:\n1. Dedicated Talent Partner assignment within 24 hours.\n2. Initial screening & architectural alignment discovery call.\n3. Portfolio & pipeline synchronization.\n\nWarm regards,\nThe Automation Studio Operations`;
    }

    const newSubmission: SubmissionRecord = {
      id: `idx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      name,
      email,
      roleType,
      message,
      aiDraft: aiDraftText,
    };

    if (!globalStorage.inMemorySubmissions) {
      globalStorage.inMemorySubmissions = [];
    }
    globalStorage.inMemorySubmissions.unshift(newSubmission);

    return NextResponse.json({
      success: true,
      data: newSubmission,
    });
  } catch (error) {
    console.error("API Error in /api/ai-respond:", error);
    return NextResponse.json(
      { success: false, error: "Processing Failures" },
      { status: 500 }
    );
  }
}
