import { db } from "@/db"
import { companies, jobs, templates } from "@/db/schema"
import { desc, eq, asc } from "drizzle-orm"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusSelect } from "@/components/status-select"
import { quickAddCompany } from "@/lib/actions"
import { SOURCES } from "@/lib/constants"
import { Plus, Send, TrendingUp, MessageCircle, Ghost, ArrowRight } from "lucide-react"
import Link from "next/link"
import { TemplateForm } from "@/app/templates/template-form"
import { DeleteTemplateButton } from "@/components/delete-template-button"

async function getDashboard() {
  const allJobs = await db
    .select({
      id: jobs.id,
      role: jobs.role,
      status: jobs.status,
      location: jobs.location,
      appliedDate: jobs.appliedDate,
      updatedAt: jobs.updatedAt,
      companyId: jobs.companyId,
      companyName: companies.name,
    })
    .from(jobs)
    .leftJoin(companies, eq(jobs.companyId, companies.id))
    .orderBy(desc(jobs.updatedAt))

  const allTemplates = await db.select().from(templates).orderBy(asc(templates.order))

  const total = allJobs.length
  const sent = allJobs.filter((j) => j.status !== "To Apply").length
  const replied = allJobs.filter((j) => ["Replied", "Interview", "Offer"].includes(j.status)).length
  const ghosted = allJobs.filter((j) => j.status === "Ghosted").length

  const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  const radar = allJobs.filter(
    (j) =>
      !["Ghosted", "Rejected", "Offer", "To Apply"].includes(j.status) &&
      new Date(j.updatedAt) < fourDaysAgo
  )

  return { stats: { total, sent, replied, ghosted }, allJobs, radar, templates: allTemplates }
}

const channelLabel: Record<string, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  x: "X",
}

export default async function Home() {
  const { stats, allJobs, radar, templates: allTemplates } = await getDashboard()

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Quick-add — like macOS Spotlight bar */}
      <div className="flex items-center gap-3 bg-card shadow-sm rounded-xl border border-border px-5 py-3.5">
        <Plus className="size-4 text-muted-foreground shrink-0" />
        <form action={quickAddCompany} className="flex-1 flex items-center gap-3">
          <Input
            name="name"
            placeholder="Add a company..."
            required
            className="border-0 bg-transparent shadow-none text-sm placeholder:text-muted-foreground/60"
          />
          <Input
            name="role"
            placeholder="Role"
            className="border-0 bg-muted/50 px-3 py-1.5 h-8 text-sm rounded-lg shadow-none w-48"
          />
          <select
            name="source"
            className="h-8 border-0 bg-muted/50 rounded-lg px-3 text-sm text-muted-foreground outline-none w-28"
          >
            <option value="">Source</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Button type="submit" size="icon" className="size-8 rounded-full shrink-0">
            <ArrowRight className="size-3.5" />
          </Button>
        </form>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-x-8 gap-y-3 flex-wrap">
        <div className="flex items-center gap-3 fade-in-up stagger-1">
          <div className="size-10 rounded-2xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
            <Send className="size-4.5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-teal-600 dark:text-teal-400">{stats.total}</p>
            <p className="text-xs text-muted-foreground/70 font-medium tracking-wide uppercase">Total</p>
          </div>
        </div>
        <div className="flex items-center gap-3 fade-in-up stagger-2">
          <div className="size-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <TrendingUp className="size-4.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{stats.sent}</p>
            <p className="text-xs text-muted-foreground/70 font-medium tracking-wide uppercase">Sent</p>
          </div>
        </div>
        <div className="flex items-center gap-3 fade-in-up stagger-3">
          <div className="size-10 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <MessageCircle className="size-4.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{stats.replied}</p>
            <p className="text-xs text-muted-foreground/70 font-medium tracking-wide uppercase">Replied</p>
          </div>
        </div>
        <div className="flex items-center gap-3 fade-in-up stagger-4">
          <div className="size-10 rounded-2xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
            <Ghost className="size-4.5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-pink-600 dark:text-pink-400">{stats.ghosted}</p>
            <p className="text-xs text-muted-foreground/70 font-medium tracking-wide uppercase">Ghosted</p>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold tracking-wide text-muted-foreground/80 uppercase">
          Pipeline &middot; {allJobs.length}
        </h2>
        {allJobs.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-sm text-muted-foreground/60">
              No jobs yet. Add one above.
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left text-xs font-medium text-muted-foreground/60 px-6 py-3.5 w-[180px]">Company</th>
                  <th className="text-left text-xs font-medium text-muted-foreground/60 px-6 py-3.5">Role</th>
                  <th className="text-left text-xs font-medium text-muted-foreground/60 px-6 py-3.5 w-[140px]">Status</th>
                  <th className="text-right text-xs font-medium text-muted-foreground/60 px-6 py-3.5 w-[150px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allJobs.map((j) => (
                  <tr key={j.id} className="border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4.5">
                      <span className="text-sm font-medium">{j.companyName ?? "—"}</span>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="text-sm text-foreground/80">{j.role}</span>
                    </td>
                    <td className="px-6 py-4.5">
                      <StatusSelect jobId={j.id} current={j.status} />
                    </td>
                    <td className="px-6 py-4.5 text-right whitespace-nowrap">
                      <Link
                        href={`/companies/${j.companyId}/apply?jobId=${j.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary/80 hover:text-primary transition-colors"
                      >
                        <Send className="size-3.5" />
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

      {/* Follow-up Radar */}
      {radar.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold tracking-wide text-muted-foreground/80 uppercase">
            Needs follow-up &middot; {radar.length}
          </h2>
          <div className="space-y-3">
            {radar.map((j, i) => (
              <Card key={j.id} className={`card-hover fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-sm font-medium">{j.companyName}</p>
                    <p className="text-xs text-muted-foreground/70">{j.role}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4 whitespace-nowrap">
                    <StatusSelect jobId={j.id} current={j.status} />
                    <Link
                      href={`/companies/${j.companyId}/apply?jobId=${j.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary/80 hover:text-primary transition-colors"
                    >
                      <Send className="size-3.5" />
                      Re-engage
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-wide text-muted-foreground/80 uppercase">
            Templates &middot; {allTemplates.length}
          </h2>
          <TemplateForm />
        </div>
        {allTemplates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground/60">
              No templates yet. Add one to use in Quick Apply.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {allTemplates.map((t) => (
              <Card key={t.id}>
                <CardContent className="flex items-start justify-between py-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{t.name}</span>
                      <span className="text-xs text-muted-foreground/60 bg-muted/50 rounded px-1.5 py-0.5">
                        {channelLabel[t.channel] ?? t.channel}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-2">
                      {t.body.slice(0, 200)}
                    </p>
                  </div>
                  <DeleteTemplateButton id={t.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
