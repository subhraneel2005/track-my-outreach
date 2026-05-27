"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteTemplate } from "@/lib/actions"

export function DeleteTemplateButton({ id }: { id: string }) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground/50 hover:text-destructive"
      onClick={async () => {
        if (confirm("Delete this template?")) {
          await deleteTemplate(id)
          router.refresh()
        }
      }}
    >
      <Trash2 className="size-3.5" />
    </Button>
  )
}
