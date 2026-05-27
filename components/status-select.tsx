"use client"

import { updateJobStatus } from "@/lib/actions"
import { useRouter } from "next/navigation"

const STATUS_OPTIONS = [
  "To Apply",
  "Applied",
  "Followed Up",
  "Replied",
  "Interview",
  "Offer",
  "Ghosted",
  "Rejected",
]

const statusStyles: Record<string, string> = {
  "To Apply": "bg-muted text-muted-foreground",
  Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Followed Up": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Replied: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Interview: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Offer: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  Ghosted: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export function StatusSelect({ jobId, current }: { jobId: string; current: string }) {
  const router = useRouter()

  return (
    <select
      defaultValue={current}
      onChange={async (e) => {
        await updateJobStatus(jobId, e.target.value)
        router.refresh()
      }}
      className={`text-xs font-medium rounded-md border-0 px-2 py-1 cursor-pointer appearance-none outline-none ring-1 ring-inset ring-border hover:ring-ring focus:ring-2 ${statusStyles[current] || "bg-muted text-muted-foreground"}`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}
