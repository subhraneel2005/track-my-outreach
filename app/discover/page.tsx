import { db } from "@/db"
import { companies } from "@/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, ExternalLink, Compass } from "lucide-react"
import { addCompany } from "@/lib/actions"
import { SOURCES, FUNDING_STAGES } from "@/lib/constants"

export default async function Discover() {
  const recentCompanies = await db
    .select()
    .from(companies)
    .orderBy(desc(companies.createdAt))
    .limit(10)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Compass className="size-6" />
          Discover
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Found a startup from an article or post? Log it here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Log a Startup You Found</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addCompany} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Startup Name *</Label>
              <Input id="name" name="name" required placeholder="e.g. CoolAI" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" placeholder="https://coolai.dev" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Found via</Label>
              <Select name="source">
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fundingStage">Funding Stage</Label>
              <Select name="fundingStage">
                <SelectTrigger>
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  {FUNDING_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Why are they interesting?</Label>
              <Textarea id="notes" name="notes" rows={2} placeholder="What stood out..." />
            </div>
            <div className="col-span-2">
              <Button type="submit">
                <Plus className="size-4 mr-1" />
                Log Startup
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-semibold">Recently Logged</h2>
        {recentCompanies.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No startups logged yet.</CardContent></Card>
        ) : (
          <div className="grid gap-3">
            {recentCompanies.map((c) => (
              <Link key={c.id} href={`/companies/${c.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {c.source && <Badge variant="secondary">{c.source}</Badge>}
                        {c.fundingStage && <span>{c.fundingStage}</span>}
                      </div>
                    </div>
                    {c.website && <ExternalLink className="size-4 text-muted-foreground" />}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
