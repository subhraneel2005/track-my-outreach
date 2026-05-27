"use server"

import { db } from "@/db"
import { companies, jobs, templates, contacts, followUps } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { generateId } from "./constants"

export async function addCompany(formData: FormData) {
  const now = new Date()
  const id = generateId()
  await db.insert(companies).values({
    id,
    name: formData.get("name") as string,
    website: (formData.get("website") as string) || null,
    source: (formData.get("source") as string) || null,
    fundingStage: (formData.get("fundingStage") as string) || null,
    notes: (formData.get("notes") as string) || null,
    createdAt: now,
    updatedAt: now,
  })
  revalidatePath("/companies")
  revalidatePath("/")
}

export async function addJob(companyId: string, formData: FormData) {
  const now = new Date()
  const id = generateId()
  await db.insert(jobs).values({
    id,
    companyId,
    role: formData.get("role") as string,
    jobId: (formData.get("jobId") as string) || null,
    location: (formData.get("location") as string) || null,
    url: (formData.get("url") as string) || null,
    status: "To Apply",
    notes: (formData.get("notes") as string) || null,
    createdAt: now,
    updatedAt: now,
  })
  revalidatePath(`/companies/${companyId}`)
  revalidatePath("/")
}

export async function updateJobStatus(jobId: string, status: string) {
  const now = new Date()
  if (status === "Applied") {
    await db.update(jobs).set({ status, appliedDate: now, updatedAt: now }).where(eq(jobs.id, jobId))
  } else {
    await db.update(jobs).set({ status, updatedAt: now }).where(eq(jobs.id, jobId))
  }
  revalidatePath("/")
  revalidatePath("/tracker")
  revalidatePath("/companies")
}

export async function addFollowUp(jobId: string, formData: FormData) {
  const now = new Date()
  const id = generateId()
  await db.insert(followUps).values({
    id,
    jobId,
    date: now,
    note: (formData.get("note") as string) || null,
    createdAt: now,
  })
  await db.update(jobs).set({ lastFollowUp: now, status: "Followed Up", updatedAt: now }).where(eq(jobs.id, jobId))
  revalidatePath("/")
  revalidatePath("/tracker")
}

export async function addTemplate(formData: FormData) {
  const now = new Date()
  const id = generateId()
  await db.insert(templates).values({
    id,
    name: formData.get("name") as string,
    body: formData.get("body") as string,
    channel: (formData.get("channel") as string) || "email",
    order: Number(formData.get("order")) || 0,
    createdAt: now,
    updatedAt: now,
  })
  revalidatePath("/templates")
}

export async function updateTemplate(id: string, formData: FormData) {
  const now = new Date()
  await db
    .update(templates)
    .set({
      name: formData.get("name") as string,
      body: formData.get("body") as string,
      channel: (formData.get("channel") as string) || "email",
      order: Number(formData.get("order")) || 0,
      updatedAt: now,
    })
    .where(eq(templates.id, id))
  revalidatePath("/templates")
}

export async function deleteTemplate(id: string) {
  await db.delete(templates).where(eq(templates.id, id))
  revalidatePath("/templates")
}

export async function deleteCompany(id: string) {
  await db.delete(companies).where(eq(companies.id, id))
  revalidatePath("/companies")
  revalidatePath("/")
}

export async function deleteJob(id: string) {
  await db.delete(jobs).where(eq(jobs.id, id))
  revalidatePath("/companies")
  revalidatePath("/tracker")
  revalidatePath("/")
}

export async function addContact(companyId: string, formData: FormData) {
  const now = new Date()
  const id = generateId()
  await db.insert(contacts).values({
    id,
    companyId,
    name: formData.get("name") as string,
    title: (formData.get("title") as string) || null,
    email: (formData.get("email") as string) || null,
    linkedinUrl: (formData.get("linkedinUrl") as string) || null,
    notes: (formData.get("notes") as string) || null,
    createdAt: now,
    updatedAt: now,
  })
  revalidatePath(`/companies/${companyId}`)
}
