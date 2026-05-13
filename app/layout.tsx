import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Header } from "@/components/layout/Header"
import { HotTopics } from "@/components/layout/HotTopics"
import { CategoryBar } from "@/components/layout/CategoryBar"
import { Footer } from "@/components/layout/Footer"
import { YandexMetrika } from "@/components/analytics/YandexMetrika"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
})

export const metadata: Metadata = {
  title: {
    default: "nazranka.ru — Новости Ингушетии",
    template: "%s | nazranka.ru",
  },
  description:
    "Новостной портал Ингушетии. Актуальные новости, культура, история и ингушский язык.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  openGraph: {
    siteName: "nazranka.ru",
    locale: "ru_RU",
    type: "website",
    title: "nazranka.ru — Новости Ингушетии",
    description: "Новостной портал Ингушетии. Актуальные новости, культура, история и ингушский язык.",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": "https://nazranka.ru/api/rss",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col bg-white text-gray-900">
        <YandexMetrika />
        <Header />
        <CategoryBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
