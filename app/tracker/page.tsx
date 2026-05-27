import { db } from "@/db"
import { jobs, companies } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import Link from "next/link"
import { StatusSelect } from "@/components/status-select"
import { Send } from "lucide-react"

export default async function Pipeline() {
  const allJobs = await db
    .select({
      id: jobs.id,
      role: jobs.role,
      status: jobs.status,
      location: jobs.location,
      appliedDate: jobs.appliedDate,
      lastFollowUp: jobs.lastFollowUp,
      companyId: jobs.companyId,
      companyName: companies.name,
      companySource: companies.source,
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .orderBy(desc(jobs.createdAt))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <p className="text-sm text-muted-foreground mt-1">{allJobs.length} application{allJobs.length !== 1 ? "s" : ""}</p>
      </div>

      {allJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No applications yet. Add a company and job to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 w-[200px]">Company</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Role</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 w-[140px]">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 w-[100px]">Applied</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2.5 w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allJobs.map((j) => (
                <tr key={j.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/companies/${j.companyId}`} className="text-sm font-medium hover:underline">
                      {j.companyName}
                    </Link>
                    {j.location && (
                      <p className="text-xs text-muted-foreground mt-0.5">{j.location}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm">{j.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect jobId={j.id} current={j.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {j.appliedDate
                        ? j.appliedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/companies/${j.companyId}/apply?jobId=${j.id}`}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                    >
                      <Send className="size-3" />
                      {j.status === "To Apply" ? "Apply" : "Re-engage"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
