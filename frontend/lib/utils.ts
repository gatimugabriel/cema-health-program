import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {format} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date helper
export const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  return format(new Date(dateString), "MMM d, yyyy");
};

