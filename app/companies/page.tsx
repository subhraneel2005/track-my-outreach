import { db } from "@/db"
import { companies, jobs } from "@/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ExternalLink } from "lucide-react"

const sourceColors: Record<string, string> = {
  LinkedIn: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Wellfound: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "YC Directory": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Crunchbase: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  inc42: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export default async function Companies() {
  const allCompanies = await db
    .select({
      id: companies.id,
      name: companies.name,
      website: companies.website,
      source: companies.source,
      fundingStage: companies.fundingStage,
      createdAt: companies.createdAt,
      jobCount: sql<number>`(SELECT COUNT(*) FROM ${jobs} WHERE ${jobs.companyId} = ${companies.id})`,
    })
    .from(companies)
    .orderBy(desc(companies.createdAt))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {allCompanies.length} company{allCompanies.length !== 1 ? "ies" : "y"} logged
          </p>
        </div>
        <Button render={<Link href="/companies/new" />}>
          <Plus className="size-4 mr-1" />
          Add Company
        </Button>
      </div>

      {allCompanies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No companies yet. Start by adding one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {allCompanies.map((c) => (
            <Link key={c.id} href={`/companies/${c.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name}</span>
                      {c.website && (
                        <ExternalLink className="size-3 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {c.source && <Badge className={sourceColors[c.source] ?? ""}>{c.source}</Badge>}
                      {c.fundingStage && <span>{c.fundingStage}</span>}
                      <span>{c.jobCount} job{c.jobCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
