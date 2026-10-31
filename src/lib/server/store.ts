import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";

/** JSON files outside the public folder. */
function filePath(file: string): string {
  return path.join(process.env.DATA_DIR?.trim() || path.join(process.cwd(), ".data"), file);
}

/** The file's records, or null when the file has never been written. */
export async function readExisting<T>(file: string): Promise<T[] | null> {
  try {
    return JSON.parse(await fs.readFile(filePath(file), "utf8")) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function readRecords<T>(file: string): Promise<T[]> {
  return (await readExisting<T>(file)) ?? [];
}

// One Node process serves the app, so running writes in sequence is enough to avoid lost updates.
let writeQueue: Promise<unknown> = Promise.resolve();

export function updateRecords<T>(
  file: string,
  change: (records: T[], fileExisted: boolean) => T[]
): Promise<T[]> {
  const run = async () => {
    const current = await readExisting<T>(file);
    const next = change(current ?? [], current !== null);
    const target = filePath(file);
    await fs.mkdir(path.dirname(target), { recursive: true });
    // Rename into place, so a crash mid-write cannot leave a truncated file.
    const temporary = `${target}.${randomBytes(4).toString("hex")}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(next));
    await fs.rename(temporary, target);
    return next;
  };
  const result = writeQueue.then(run, run);
  writeQueue = result.catch(() => undefined);
  return result;
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now()}_${randomBytes(3).toString("hex")}`;
}
