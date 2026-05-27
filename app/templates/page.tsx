import { db } from "@/db"
import { templates } from "@/db/schema"
import { asc } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { TemplateForm } from "./template-form"
import { deleteTemplate } from "@/lib/actions"

const channelColors: Record<string, string> = {
  email: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  linkedin: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  x: "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200",
}

export default async function Templates() {
  const allTemplates = await db.select().from(templates).orderBy(asc(templates.order))

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {allTemplates.length} template{allTemplates.length !== 1 ? "s" : ""}
          </p>
        </div>
        <TemplateForm />
      </div>

      {allTemplates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No templates yet. Add one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allTemplates.map((t) => (
            <Card key={t.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">{t.name}</CardTitle>
                    <Badge className={channelColors[t.channel] ?? ""}>{t.channel}</Badge>
                  </div>
                  <form action={async () => {
                    "use server"
                    await deleteTemplate(t.id)
                  }}>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-muted/50 rounded-md p-3 max-h-48 overflow-y-auto">
                  {t.body.slice(0, 500)}{t.body.length > 500 ? "..." : ""}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
