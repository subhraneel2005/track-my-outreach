import { redirect } from "next/navigation"

export default async function CompanyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect("/")
}
