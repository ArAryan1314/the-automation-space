export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Calls an API route and returns `data`, or throws an ApiError with a message fit to show the user. */
export async function callApi<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  const res = await fetch(path, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  if (res.ok && json?.success) return json.data as T;

  const fieldErrors: Record<string, string[]> | undefined = json?.details?.fieldErrors;
  const firstFieldError = fieldErrors && Object.values(fieldErrors)[0]?.[0];
  throw new ApiError(res.status, firstFieldError || json?.error || "Something went wrong. Please try again.");
}
