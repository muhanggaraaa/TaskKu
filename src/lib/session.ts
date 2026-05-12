/**
 * Session utilities — shared between server components and server actions.
 */

export type SessionData = {
  name: string;
  email: string;
};

/**
 * Parse session cookie — support both old (plain name) and new (JSON) format.
 */
export function parseSession(value: string): SessionData {
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed.name === "string" && typeof parsed.email === "string") {
      return parsed;
    }
  } catch {
    // fallback: old format was plain name string
  }
  return { name: value, email: "" };
}
