import { db } from "@/db"
import { companies, jobs, templates } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { ApplyClient } from "./apply-client"

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ jobId?: string }>
}) {
  const { id } = await params
  const { jobId } = await searchParams

  const company = await db.select().from(companies).where(eq(companies.id, id)).then((r) => r[0])
  if (!company) notFound()

  const job = jobId
    ? await db.select().from(jobs).where(eq(jobs.id, jobId)).then((r) => r[0])
    : null

  const allTemplates = await db.select().from(templates).orderBy(asc(templates.order))
  if (allTemplates.length === 0) {
    redirect("/templates")
  }

  const context = {
    company_name: company.name,
    role: job?.role ?? "{role}",
    job_id: job?.jobId ?? "{job_id}",
    location: job?.location ?? "{location}",
    team_name: "{team name/division}",
    name: "{name}",
    startup_name: company.name,
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link href={`/companies/${id}`} />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Quick Apply</h1>
          <p className="text-sm text-muted-foreground">
            {company.name} — {job?.role ?? "select a job first"}
          </p>
        </div>
      </div>

      <ApplyClient templates={allTemplates} context={context} companyId={id} jobId={job?.id} />
    </div>
  )
}
