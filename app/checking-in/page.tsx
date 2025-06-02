"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function CheckingInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const language = searchParams.get("lang") || "english"
  const emiratesId = searchParams.get("emiratesId") || ""
  const name = searchParams.get("name") || ""

  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  const translations = {
    english: {
      title: "Processing Check-In",
      description: "Please wait while we process your check-in.",
      checkingIn: "Checking In...",
      checkedInSuccessTitle: "Check-In Successful!",
      checkedInSuccessMessage: `Thank you, ${name}. Your check-in for Emirates ID ${emiratesId} has been recorded.`,
      goBack: "Go Back to Check-In Page",
      finish: "Finish",
    },
    arabic: {
      title: "جاري معالجة تسجيل الحضور",
      description: "يرجى الانتظار بينما نعالج تسجيل حضورك.",
      checkingIn: "جاري تسجيل الحضور...",
      checkedInSuccessTitle: "تم تسجيل الحضور بنجاح!",
      checkedInSuccessMessage: `شكراً لك، ${name}. تم تسجيل حضورك للهوية الإماراتية ${emiratesId}.`,
      goBack: "العودة إلى صفحة تسجيل الحضور",
      finish: "إنهاء",
    },
    hindi: {
      title: "चेक-इन प्रक्रिया में है",
      description: "कृपया प्रतीक्षा करें जब तक हम आपका चेक-इन संसाधित करते हैं।",
      checkingIn: "चेक-इन हो रहा है...",
      checkedInSuccessTitle: "चेक-इन सफल!",
      checkedInSuccessMessage: `धन्यवाद, ${name}। आपकी अमीरात आईडी ${emiratesId} के लिए आपका चेक-इन रिकॉर्ड कर लिया गया है।`,
      goBack: "चेक-इन पृष्ठ पर वापस जाएं",
      finish: "समाप्त",
    },
    urdu: {
      title: "چیک ان پروسیسنگ",
      description: "براہ کرم انتظار کریں جب تک ہم آپ کا چیک ان پروسیس کرتے ہیں۔",
      checkingIn: "چیک ان کیا جا رہا ہے۔۔۔",
      checkedInSuccessTitle: "چیک ان کامیاب!",
      checkedInSuccessMessage: `شکریہ، ${name}۔ آپ کا اماراتی شناختی کارڈ ${emiratesId} کے لیے چیک ان ریکارڈ کر لیا گیا ہے۔`,
      goBack: "چیک ان صفحہ پر واپس جائیں",
      finish: "ختم",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.english

  useEffect(() => {
    // Simulate API call for check-in
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      // Here you would typically make a real API call
      // For example: fetch('/api/checkin', { method: 'POST', body: JSON.stringify({ emiratesId, name }) })
    }, 2500) // Simulate 2.5 seconds delay

    return () => clearTimeout(timer)
  }, [])

  const handleGoBack = () => {
    router.replace(`/checkin?lang=${language}&emiratesId=${emiratesId}&name=${encodeURIComponent(name)}`)
  }

  const handleFinish = () => {
    router.replace(`/`) // Navigate to the initial language selection page
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex items-center justify-center">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-xl">{isSuccess ? t.checkedInSuccessTitle : t.title}</CardTitle>
          {!isSuccess && <CardDescription>{t.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
          {isLoading && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <p className="text-lg font-medium">{t.checkingIn}</p>
            </>
          )}
          {isSuccess && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600" />
              <p className="text-lg font-medium">{t.checkedInSuccessMessage}</p>
              <Button onClick={handleFinish} className="w-full mt-4">
                {t.finish}
              </Button>
              <Button onClick={handleGoBack} variant="outline" className="w-full mt-2">
                <ArrowLeft className="mr-2 h-4 w-4" /> {t.goBack}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
