"use client"

import { useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { updateJobStatus } from "@/lib/actions"
import { useRouter } from "next/navigation"

type Template = {
  id: string
  name: string
  body: string
  channel: string
}

type Context = Record<string, string>

function fillTemplate(body: string, context: Context) {
  let result = body
  for (const [key, value] of Object.entries(context)) {
    result = result.replaceAll(`{${key}}`, value)
  }
  return result
}

export function ApplyClient({
  templates,
  context,
  companyId,
  jobId,
}: {
  templates: Template[]
  context: Context
  companyId: string
  jobId?: string
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id ?? "")
  const [customContext, setCustomContext] = useState<Context>(context)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)
  const filled = selectedTemplate ? fillTemplate(selectedTemplate.body, customContext) : ""

  const updateField = (key: string, value: string) => {
    setCustomContext((prev) => ({ ...prev, [key]: value }))
  }

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(filled)
    setCopied(true)
    if (jobId) {
      await updateJobStatus(jobId, "Applied")
    }
    router.refresh()
    setTimeout(() => setCopied(false), 2000)
  }, [filled, jobId, router])

  const uniqueKeys = [...new Set(
    templates.flatMap((t) => {
      const matches = t.body.match(/\{[^}]+\}/g)
      return matches ? matches.map((m) => m.slice(1, -1)) : []
    })
  )]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">1. Pick a Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {templates.map((t) => (
              <Badge
                key={t.id}
                variant={selectedTemplateId === t.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTemplateId(t.id)}
              >
                {t.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {uniqueKeys.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">2. Fill Placeholders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {uniqueKeys.map((key) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{key}</Label>
                  <Input
                    value={customContext[key] ?? ""}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">3. Preview & Copy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={filled}
            readOnly
            rows={12}
            className="font-mono text-xs"
          />
          <div className="flex gap-2">
            <Button onClick={handleCopy}>
              {copied ? (
                <><Check className="size-4 mr-1" /> Copied!</>
              ) : (
                <><Copy className="size-4 mr-1" /> Copy to Clipboard</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
