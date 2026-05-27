import { db } from "@/db"
import { companies, jobs, followUps } from "@/db/schema"
import { desc, eq, sql, and, lt } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Send, Reply, Ghost, Users } from "lucide-react"

async function getStats() {
  const allJobs = await db.select().from(jobs)
  const total = allJobs.length
  const applied = allJobs.filter((j) => j.status !== "To Apply").length
  const replied = allJobs.filter((j) => j.status === "Replied" || j.status === "Interview").length
  const ghosted = allJobs.filter((j) => j.status === "Ghosted").length
  return { total, applied, replied, ghosted }
}

async function getFollowUpRadar() {
  const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  const stalled = await db
    .select()
    .from(jobs)
    .where(
      and(
        sql`${jobs.status} NOT IN ('Ghosted', 'Rejected', 'Offer')`,
        sql`${jobs.status} != 'To Apply'`,
        lt(jobs.updatedAt, fourDaysAgo)
      )
    )
    .orderBy(desc(jobs.updatedAt))

  const withCompany = await Promise.all(
    stalled.map(async (j) => {
      const company = await db
        .select({ name: companies.name })
        .from(companies)
        .where(eq(companies.id, j.companyId))
        .then((r) => r[0])
      return { ...j, companyName: company?.name ?? "Unknown" }
    })
  )
  return withCompany
}

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

export default async function Dashboard() {
  const stats = await getStats()
  const radar = await getFollowUpRadar()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your outreach pipeline at a glance</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Send className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sent Out</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applied}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Replies / Interviews</CardTitle>
            <Reply className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.replied}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ghosted</CardTitle>
            <Ghost className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ghosted}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Follow-up Radar</CardTitle>
          <p className="text-sm text-muted-foreground">Applications with no update in 4+ days</p>
        </CardHeader>
        <CardContent>
          {radar.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nothing needs follow-up right now.</p>
          ) : (
            <div className="space-y-3">
              {radar.map((j) => (
                <div key={j.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{j.companyName}</p>
                    <p className="text-xs text-muted-foreground">{j.role}</p>
                  </div>
                  <Badge className={statusColors[j.status]}>{j.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
