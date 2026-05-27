"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteCompany } from "@/lib/actions"

export function DeleteCompanyButton({ id }: { id: string }) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive"
      onClick={async () => {
        if (confirm("Delete this company and all its jobs/contacts?")) {
          await deleteCompany(id)
          router.push("/companies")
        }
      }}
    >
      <Trash2 className="size-4" />
    </Button>
  )
}
