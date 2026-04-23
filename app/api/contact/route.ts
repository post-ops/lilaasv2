import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  topic: z.enum(["levers", "precision", "support", "press", "other"]),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }
    // Demo stub: log. Replace with real email send (Resend / Postmark) before production.
    console.log("[contact]", parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
