"use client"

import { useState } from "react"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { addTemplate } from "@/lib/actions"
import { useRouter } from "next/navigation"

export function TemplateForm() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4 mr-1" />
        Add Template
      </DialogTrigger>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>New Template</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData: FormData) => {
            await addTemplate(formData)
            setOpen(false)
            router.refresh()
          }}
          className="space-y-5"
        >
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input id="name" name="name" required placeholder="e.g. Cold Email - Referral" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select name="channel" defaultValue="email">
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="x">X / Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">
              Template Body
              <span className="text-xs text-muted-foreground ml-2">
                Use {'{placeholders}'} like {'{name}'}, {'{company_name}'}, {'{role}'}
              </span>
            </Label>
            <Textarea
              id="body"
              name="body"
              required
              rows={28}
              className="font-mono text-sm leading-relaxed"
              placeholder="Hi {name},&#10;&#10;Hope you're doing well..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" size="lg">Save Template</Button>
            <Button type="button" variant="outline" size="lg" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
