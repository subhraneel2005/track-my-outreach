import { db } from "@/db"
import { companies, jobs } from "@/db/schema"
import { desc, eq, sql, and, lt } from "drizzle-orm"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Send, MessageCircle, Ghost, TrendingUp } from "lucide-react"
import { StatusSelect } from "@/components/status-select"

async function getStats() {
  const allJobs = await db.select().from(jobs)
  const total = allJobs.length
  const applied = allJobs.filter((j) => j.status !== "To Apply").length
  const replied = allJobs.filter((j) => j.status === "Replied" || j.status === "Interview" || j.status === "Offer").length
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

  if (stalled.length === 0) return []

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

export default async function Dashboard() {
  const stats = await getStats()
  const radar = await getFollowUpRadar()

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your outreach pipeline</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Send className="size-4 text-blue-700 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <TrendingUp className="size-4 text-green-700 dark:text-green-300" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">{stats.applied}</p>
            <p className="text-xs text-muted-foreground">Sent</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <MessageCircle className="size-4 text-purple-700 dark:text-purple-300" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">{stats.replied}</p>
            <p className="text-xs text-muted-foreground">Replied</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <Ghost className="size-4 text-red-700 dark:text-red-300" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">{stats.ghosted}</p>
            <p className="text-xs text-muted-foreground">Ghosted</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Needs Follow-up</h2>
        {radar.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Nothing needs follow-up right now.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {radar.map((j) => (
              <Card key={j.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <Link href={`/companies/${j.companyId}/apply?jobId=${j.id}`} className="flex-1 min-w-0">
                    <p className="font-medium text-sm hover:underline">{j.companyName}</p>
                    <p className="text-xs text-muted-foreground">{j.role}</p>
                  </Link>
                  <StatusSelect jobId={j.id} current={j.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
