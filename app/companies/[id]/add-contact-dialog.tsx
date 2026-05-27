"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { addContact } from "@/lib/actions"

export function AddContactDialog({ companyId }: { companyId: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Plus className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData: FormData) => {
            await addContact(companyId, formData)
            setOpen(false)
            router.refresh()
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required placeholder="e.g. John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="e.g. CTO / Senior Engineer" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input id="linkedinUrl" name="linkedinUrl" placeholder="https://linkedin.com/in/..." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit">Add Contact</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
