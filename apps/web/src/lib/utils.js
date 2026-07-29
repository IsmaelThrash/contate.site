import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isValidColor(color) {
  if (color === null || color === undefined) return false;
  if (typeof color !== 'string') return false;
  const trimmed = color.trim();
  if (trimmed === '') return true;

  // Immediately reject dangerous CSS injection characters
  if (/[;{}<>'"]/.test(trimmed)) return false;

  // Hex format: #rgb, #rgba, #rrggbb, #rrggbbaa
  const hexRegex = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
  // HSL / HSLA / RGB / RGBA function format
  const funcRegex = /^(hsla?|rgba?)\(\s*[0-9\s%.,-]+\s*\)$/i;
  // CSS var HSL format: hsl(var(...))
  const hslVarRegex = /^hsl\(var\(--[a-zA-Z0-9-]+\)\)$/i;
  // Raw HSL channels (e.g., "240 5.9% 10%") or theme IDs (e.g., "zinc")
  const rawHslOrIdRegex = /^([0-9\s%.,-]+|[a-zA-Z0-9_-]+)$/;

  return hexRegex.test(trimmed) || funcRegex.test(trimmed) || hslVarRegex.test(trimmed) || rawHslOrIdRegex.test(trimmed);
}

export function sanitizeColor(color, fallback = '#ffffff') {
  return isValidColor(color) && color ? color.trim() : fallback;
}

