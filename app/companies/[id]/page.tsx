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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Plus, ExternalLink, Mail, Globe, Send } from "lucide-react"
import { DeleteCompanyButton } from "./delete-button"
import { JOB_STATUSES } from "@/lib/constants"

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
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link href="/companies" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <DeleteCompanyButton id={company.id} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
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
          <CardHeader><CardTitle className="text-sm">Notes</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{company.notes}</p></CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Jobs ({companyJobs.length})</h2>
          <div className="flex gap-2">
            <AddJobForm companyId={id} />
          </div>
        </div>
        {companyJobs.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No jobs added yet.</CardContent></Card>
        ) : (
          <div className="space-y-2">
            {companyJobs.map((j) => (
              <Card key={j.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{j.role}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      {j.location && <span>{j.location}</span>}
                      {j.jobId && <span>ID: {j.jobId}</span>}
                      {j.url && (
                        <a href={j.url} target="_blank" rel="noopener noreferrer" className="hover:underline">View posting</a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[j.status]}>{j.status}</Badge>
                    <Button size="sm" variant="outline" render={<Link href={`/companies/${id}/apply?jobId=${j.id}`} />}>
                      <Send className="size-3 mr-1" />
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Contacts ({companyContacts.length})</h2>
          <AddContactForm companyId={id} />
        </div>
        {companyContacts.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No contacts yet.</CardContent></Card>
        ) : (
          <div className="space-y-2">
            {companyContacts.map((c) => (
              <Card key={c.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="text-muted-foreground hover:text-foreground">
                        <Mail className="size-4" />
                      </a>
                    )}
                    {c.linkedinUrl && (
                      <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
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

function AddJobForm({ companyId }: { companyId: string }) {
  return (
    <form action={async (formData) => {
      "use server"
      const { addJob } = await import("@/lib/actions")
      await addJob(companyId, formData)
    }} className="flex items-center gap-2">
      <div className="flex gap-2">
        <input name="role" placeholder="Role title" required className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" />
        <input name="jobId" placeholder="Job ID" className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" />
        <input name="location" placeholder="Location" className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" />
        <input name="url" placeholder="Job URL" className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" />
        <Button type="submit" size="sm">
          <Plus className="size-4 mr-1" />
          Add Job
        </Button>
      </div>
    </form>
  )
}

function AddContactForm({ companyId }: { companyId: string }) {
  return (
    <form action={async (formData) => {
      "use server"
      const { addContact } = await import("@/lib/actions")
      await addContact(companyId, formData)
    }} className="flex items-center gap-2">
      <input name="name" placeholder="Contact name" required className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" />
      <input name="title" placeholder="Title" className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" />
      <input name="email" placeholder="Email" type="email" className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" />
      <Button type="submit" size="sm">
        <Plus className="size-4 mr-1" />
        Add Contact
      </Button>
    </form>
  )
}
