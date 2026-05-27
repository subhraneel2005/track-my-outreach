import { db } from "@/db"
import { companies, jobs, contacts } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { ArrowLeft, ExternalLink, Mail, Globe, Send, Briefcase, Users } from "lucide-react"
import { DeleteCompanyButton } from "./delete-button"
import { AddJobDialog } from "./add-job-dialog"
import { AddContactDialog } from "./add-contact-dialog"
import { StatusSelect } from "@/components/status-select"

export default async function CompanyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const company = await db.select().from(companies).where(eq(companies.id, id)).then((r) => r[0])
  if (!company) notFound()

  const companyJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.companyId, id))
    .orderBy(desc(jobs.createdAt))

  const companyContacts = await db
    .select()
    .from(contacts)
    .where(eq(contacts.companyId, id))
    .orderBy(desc(contacts.createdAt))

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/companies" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{company.name}</h1>
            <DeleteCompanyButton id={company.id} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
            {company.source && <Badge variant="secondary">{company.source}</Badge>}
            {company.fundingStage && <span>{company.fundingStage}</span>}
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                <ExternalLink className="size-3" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {company.notes && (
        <Card>
          <CardContent className="py-3 px-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{company.notes}</p>
          </CardContent>
        </Card>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Briefcase className="size-4" />
            Jobs
            <span className="text-sm text-muted-foreground font-normal">{companyJobs.length}</span>
          </h2>
          <AddJobDialog companyId={id} />
        </div>
        {companyJobs.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No jobs yet.</CardContent></Card>
        ) : (
          <div className="space-y-1.5">
            {companyJobs.map((j) => (
              <Card key={j.id}>
                <CardContent className="flex items-center justify-between py-2.5 px-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{j.role}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      {j.location && <span>{j.location}</span>}
                      {j.jobId && <span className="font-mono">{j.jobId}</span>}
                      {j.url && (
                        <a href={j.url} target="_blank" rel="noopener noreferrer" className="hover:underline">View</a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <StatusSelect jobId={j.id} current={j.status} />
                    <Button size="sm" variant="outline" render={<Link href={`/companies/${id}/apply?jobId=${j.id}`} />}>
                      <Send className="size-3 mr-1" />
                      {j.status === "To Apply" ? "Apply" : "Re-engage"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Users className="size-4" />
            Contacts
            <span className="text-sm text-muted-foreground font-normal">{companyContacts.length}</span>
          </h2>
          <AddContactDialog companyId={id} />
        </div>
        {companyContacts.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No contacts yet.</CardContent></Card>
        ) : (
          <div className="space-y-1.5">
            {companyContacts.map((c) => (
              <Card key={c.id}>
                <CardContent className="flex items-center justify-between py-2.5 px-4">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    {c.title && <p className="text-xs text-muted-foreground">{c.title}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="text-muted-foreground hover:text-foreground transition-colors" title={c.email}>
                        <Mail className="size-4" />
                      </a>
                    )}
                    {c.linkedinUrl && (
                      <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Globe className="size-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
