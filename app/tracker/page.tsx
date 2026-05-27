import { db } from "@/db"
import { jobs, companies } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { updateJobStatus } from "@/lib/actions"
import Link from "next/link"

const statusColors: Record<string, string> = {
  "To Apply": "bg-muted text-muted-foreground",
  Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Followed Up": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Replied: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Interview: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Ghosted: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Offer: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
}

const STATUS_FLOW = ["To Apply", "Applied", "Followed Up", "Replied", "Interview", "Offer", "Ghosted", "Rejected"]

export default async function Tracker() {
  const allJobs = await db
    .select({
      id: jobs.id,
      role: jobs.role,
      status: jobs.status,
      appliedDate: jobs.appliedDate,
      lastFollowUp: jobs.lastFollowUp,
      companyId: jobs.companyId,
      companyName: companies.name,
      companySource: companies.source,
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .orderBy(desc(jobs.createdAt))

  const statusGroups = STATUS_FLOW.map((status) => ({
    status,
    items: allJobs.filter((j) => j.status === status),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {allJobs.length} total application{allJobs.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {statusGroups.map(({ status, items }) => (
          <Card key={status}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                {status}
                <Badge variant="secondary" className="ml-2">{items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[60vh] overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">Empty</p>
              ) : (
                items.map((j) => (
                  <div key={j.id} className="border rounded-md p-2 text-xs space-y-1">
                    <p className="font-medium truncate">{j.companyName}</p>
                    <p className="text-muted-foreground truncate">{j.role}</p>
                    <div className="flex items-center gap-1 pt-1">
                      {status !== j.status && (
                        <form action={async () => {
                          "use server"
                          await updateJobStatus(j.id, status)
                        }}>
                          <button className="text-[10px] text-blue-600 hover:underline">Move here</button>
                        </form>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
