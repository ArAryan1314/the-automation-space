import { z } from "zod";
import { EXPERIENCE_LEVELS, JOB_TYPES, type JobListing } from "@/data/agencyData";
import seedJobs from "@/data/seed-jobs.json";
import { readExisting, updateRecords } from "./store";

const FILE = "jobs.json";

export const JobSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  department: z.string().trim().min(2, "Department is required").max(80),
  location: z.string().trim().min(2, "Location is required").max(150),
  type: z.enum(JOB_TYPES),
  salaryRange: z.string().trim().min(2, "Salary range is required").max(100),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  overview: z.string().trim().min(10, "Overview must be at least 10 characters").max(2000),
  skills: z.array(z.string().trim().min(1).max(50)).min(1, "Add at least one skill").max(20),
});

function withSeed(records: JobListing[], fileExisted: boolean): JobListing[] {
  if (fileExisted) return records;
  const postedAt = new Date().toISOString();
  return (seedJobs as Omit<JobListing, "postedAt">[]).map((job) => ({ ...job, postedAt }));
}

/** The sample roles are written once, on first use, and can then be edited or deleted like any other. */
export async function readJobs(): Promise<JobListing[]> {
  return (await readExisting<JobListing>(FILE)) ?? updateRecords<JobListing>(FILE, withSeed);
}

export function updateJobs(change: (jobs: JobListing[]) => JobListing[]): Promise<JobListing[]> {
  return updateRecords<JobListing>(FILE, (records, fileExisted) => change(withSeed(records, fileExisted)));
}
