export { ApiError, callApi } from "@/lib/api";

export const selectClass =
  "h-11 w-full rounded-xl border border-input bg-surface px-3.5 text-sm text-foreground shadow-sm transition-all focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
