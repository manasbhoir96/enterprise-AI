import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const GEMINI_MODEL = "gemini-2.5-flash";

export function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "AIzaSyYourGeneratedSecretKeyHere" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export const ai = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "AIzaSyYourGeneratedSecretKeyHere"
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;
