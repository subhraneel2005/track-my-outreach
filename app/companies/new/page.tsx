import { addCompany } from "@/lib/actions"
import { SOURCES, FUNDING_STAGES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewCompany() {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link href="/companies" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Company</h1>
          <p className="text-sm text-muted-foreground">Log a company you want to track</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>Where did you find this company?</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addCompany} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input id="name" name="name" required placeholder="e.g. Acme Corp" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" placeholder="https://acme.com" type="url" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select name="source">
                <SelectTrigger>
                  <SelectValue placeholder="Where did you find them?" />
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
                  <SelectValue placeholder="Funding stage" />
                </SelectTrigger>
                <SelectContent>
                  {FUNDING_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Any notes about this company..." rows={3} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Company</Button>
              <Button variant="outline" render={<Link href="/companies" />}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
