import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Plus_Jakarta_Sans } from "next/font/google"
import { GeistPixelSquare } from "geist/font/pixel"
export const metadata: Metadata = {
  title: "track-my-outreach",
  description: "Track and manage your job outreach pipeline",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistPixelSquare.className} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <header className="h-11 shrink-0 border-b border-border/50 flex items-center justify-between px-5">
              <span className="text-sm font-semibold text-primary">track-my-outreach</span>
              <ThemeSwitcher />
            </header>
            <main className="flex-1 p-8 lg:p-10">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
