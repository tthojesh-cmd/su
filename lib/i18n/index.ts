import { cookies } from "next/headers";
import { messages, Lang, Key } from "./messages";
export const getLang = (): Lang => (cookies().get("lang")?.value === "te" ? "te" : "en");
export const tr = (lang: Lang, key: Key) => messages[lang][key] ?? messages.en[key];
