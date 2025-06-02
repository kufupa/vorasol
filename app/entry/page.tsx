"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function EntryForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const language = searchParams.get("lang") || "english"

  const [emiratesId, setEmiratesId] = useState("")
  const [name, setName] = useState("")

  const translations = {
    english: {
      title: "Entry Form",
      description: "Please enter your details",
      emiratesId: "Emirates ID",
      name: "Name",
      continue: "Continue",
      back: "Back",
    },
    arabic: {
      title: "نموذج الدخول",
      description: "يرجى إدخال بياناتك",
      emiratesId: "الهوية الإماراتية",
      name: "الاسم",
      continue: "متابعة",
      back: "رجوع",
    },
    hindi: {
      title: "प्रवेश फॉर्म",
      description: "कृपया अपना विवरण दर्ज करें",
      emiratesId: "अमीरात आईडी",
      name: "नाम",
      continue: "जारी रखें",
      back: "वापस",
    },
    urdu: {
      title: "اندراج فارم",
      description: "براہ کرم اپنی تفصیلات درج کریں",
      emiratesId: "اماراتی شناختی کارڈ",
      name: "نام",
      continue: "جاری رکھیں",
      back: "پیچھے",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.english

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (emiratesId && name) {
      router.push(`/checkin?lang=${language}&emiratesId=${emiratesId}&name=${encodeURIComponent(name)}`)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-xl">{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="emiratesId">{t.emiratesId}</Label>
              <Input
                id="emiratesId"
                type="number"
                value={emiratesId}
                onChange={(e) => setEmiratesId(e.target.value)}
                placeholder="784-XXXX-XXXXXXX-X"
                required
                className="h-12 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
                required
                className="h-12 text-lg"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg">
              {t.continue}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
