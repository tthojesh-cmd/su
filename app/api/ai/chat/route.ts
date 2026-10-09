import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { getAIProvider, buildSystem } from "@/lib/ai";
import { getFlags } from "@/lib/features";
const Body = z.object({ conversationId: z.string().uuid().optional(), message: z.string().min(1).max(2000), language: z.enum(["en", "te", "both"]).default("en") });

export async function POST(req: Request) {
  if (!(await getFlags()).AI_CHAT) return NextResponse.json({ error: "This feature is currently disabled." }, { status: 404 });
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Please log in to continue." }, { status: 401 });
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Please enter a valid question." }, { status: 400 });
  const { message, language } = p.data;
  let cid = p.data.conversationId;
  if (cid) { // ownership check
    if (!(await query("SELECT 1 FROM conversations WHERE id=$1 AND user_id=$2", [cid, s.id])).rowCount) return NextResponse.json({ error: "Not found." }, { status: 404 });
  } else cid = (await query("INSERT INTO conversations(user_id, title) VALUES($1,$2) RETURNING id", [s.id, message.slice(0, 60)])).rows[0].id;
  await query("INSERT INTO messages(conversation_id, role, content) VALUES($1,'user',$2)", [cid, message]);
  const history = (await query("SELECT role, content FROM messages WHERE conversation_id=$1 ORDER BY created_at DESC LIMIT 20", [cid])).rows.reverse();
  try {
    const reply = await getAIProvider().chat(buildSystem(language), history);
    const m = (await query("INSERT INTO messages(conversation_id, role, content) VALUES($1,'assistant',$2) RETURNING id", [cid, reply])).rows[0];
    await query("UPDATE conversations SET updated_at=now() WHERE id=$1", [cid]);
    return NextResponse.json({ conversationId: cid, messageId: m.id, reply });
  } catch { return NextResponse.json({ error: "The AI service is temporarily unavailable. Please try again later." }, { status: 503 }); }
}
