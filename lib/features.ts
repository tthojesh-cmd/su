import { defaultFlags, FlagKey } from "@/config/featureFlags";
import { query } from "./db";
/** Code defaults merged with DB overrides; falls back to defaults if DB is unreachable. */
export async function getFlags(): Promise<Record<FlagKey, boolean>> {
  const flags: Record<string, boolean> = { ...defaultFlags };
  try { for (const r of (await query("SELECT key, enabled FROM feature_flags")).rows) flags[r.key] = r.enabled; } catch {}
  return flags as Record<FlagKey, boolean>;
}
