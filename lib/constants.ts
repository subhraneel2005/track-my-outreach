export const JOB_STATUSES = [
  "To Apply",
  "Applied",
  "Followed Up",
  "Replied",
  "Interview",
  "Ghosted",
  "Rejected",
  "Offer",
] as const

export type JobStatus = (typeof JOB_STATUSES)[number]

export const SOURCES = [
  "LinkedIn",
  "Wellfound",
  "YC Directory",
  "Crunchbase",
  "inc42",
  "TechCrunch",
  "X/Twitter",
  "Manual",
  "Other",
] as const

export const FUNDING_STAGES = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
  "Public",
  "Bootstrapped",
  "Unknown",
] as const

export const CHANNELS = ["email", "linkedin", "x"] as const

export function generateId() {
  return crypto.randomUUID()
}
