"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function LanguageSelection() {
  const router = useRouter()

  const handleLanguageSelect = (language: string) => {
    router.push(`/entry?lang=${language}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Select Language</CardTitle>
          <CardDescription>Choose your preferred language</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleLanguageSelect("english")}
            className="w-full h-16 text-xl flex items-center justify-center gap-3" // Increased h-16, text-xl, justify-center
            variant="outline"
          >
            <span className="text-3xl">🇬🇧</span> English
          </Button>
          <Button
            onClick={() => handleLanguageSelect("arabic")}
            className="w-full h-16 text-xl flex items-center justify-center gap-3" // Increased h-16, text-xl, justify-center
            variant="outline"
          >
            <span className="text-3xl">🇸🇦</span> العربية
          </Button>
          <Button
            onClick={() => handleLanguageSelect("hindi")}
            className="w-full h-16 text-xl flex items-center justify-center gap-3" // Increased h-16, text-xl, justify-center
            variant="outline"
          >
            <span className="text-3xl">🇮🇳</span> हिंदी
          </Button>
          <Button
            onClick={() => handleLanguageSelect("urdu")}
            className="w-full h-16 text-xl flex items-center justify-center gap-3" // Increased h-16, text-xl, justify-center
            variant="outline"
          >
            <span className="text-3xl">🇵🇰</span> اردو
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
