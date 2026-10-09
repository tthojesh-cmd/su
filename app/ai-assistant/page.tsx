import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getFlags } from "@/lib/features";
import { getLang, tr } from "@/lib/i18n";
import { ChatBox } from "@/components/ChatBox";
export const metadata = { title: "AI Assistant | Organic Farming AI" };
export default async function Page() {
  if (!(await getFlags()).AI_CHAT) notFound();
  if (!(await getSession())) redirect("/login");
  const l = getLang();
  return <ChatBox labels={{ placeholder: tr(l, "ai.askQuestion"), send: tr(l, "ai.send"), new: tr(l, "ai.new"), copy: tr(l, "ai.copy") }} />;
}
