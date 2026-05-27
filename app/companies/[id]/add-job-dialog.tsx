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
import { addJob } from "@/lib/actions"

export function AddJobDialog({ companyId }: { companyId: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Job</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData: FormData) => {
            await addJob(companyId, formData)
            setOpen(false)
            router.refresh()
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input id="role" name="role" required placeholder="e.g. Full Stack Developer" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="jobId">Job ID</Label>
              <Input id="jobId" name="jobId" placeholder="e.g. 12345" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="e.g. Remote / Bangalore" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Job URL</Label>
            <Input id="url" name="url" placeholder="https://company.com/careers/..." />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit">Add Job</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
