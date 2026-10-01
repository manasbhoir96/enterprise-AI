import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

function sanitizeKey(key?: string): string | null {
  if (!key) return null;
  const cleaned = key.trim().replace(/\.+$/, "");
  if (!cleaned || cleaned === "AIzaSyYourGeneratedSecretKeyHere") {
    return null;
  }
  return cleaned;
}

export function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const apiKey = sanitizeKey(customApiKey || process.env.GEMINI_API_KEY);
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

const defaultKey = sanitizeKey(process.env.GEMINI_API_KEY);
export const ai = defaultKey ? new GoogleGenAI({ apiKey: defaultKey }) : null;

