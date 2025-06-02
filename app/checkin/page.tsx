"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function CheckInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const language = searchParams.get("lang") || "english"
  const emiratesId = searchParams.get("emiratesId") || ""
  const name = searchParams.get("name") || ""

  const [absentDays, setAbsentDays] = useState("")
  const [absentReason, setAbsentReason] = useState("")
  const [isAbsentDialogOpen, setIsAbsentDialogOpen] = useState(false)

  const translations = {
    english: {
      title: "Check In",
      welcome: "Welcome",
      checkIn: "Check In", // Button text remains
      absent: "Absent",
      back: "Back",
      absentTitle: "Mark as Absent",
      absentDescription: "Please provide absence details",
      days: "Number of Days",
      reason: "Reason",
      reasonPlaceholder: "Please enter the reason for absence...",
      submit: "Submit",
      cancel: "Cancel",
      // checkInSuccess: "Checked in successfully!", // Removed, will be on new page
      absentSuccess: "Absence recorded successfully!",
    },
    arabic: {
      title: "تسجيل الحضور",
      welcome: "مرحباً",
      checkIn: "تسجيل حضور",
      absent: "غائب",
      back: "رجوع",
      absentTitle: "تسجيل غياب",
      absentDescription: "يرجى تقديم تفاصيل الغياب",
      days: "عدد الأيام",
      reason: "السبب",
      reasonPlaceholder: "يرجى إدخال سبب الغياب...",
      submit: "إرسال",
      cancel: "إلغاء",
      // checkInSuccess: "تم تسجيل الحضور بنجاح!", // Removed
      absentSuccess: "تم تسجيل الغياب بنجاح!",
    },
    hindi: {
      title: "चेक इन",
      welcome: "स्वागत",
      checkIn: "चेक इन",
      absent: "अनुपस्थित",
      back: "वापस",
      absentTitle: "अनुपस्थित के रूप में चिह्नित करें",
      absentDescription: "कृपया अनुपस्थिति का विवरण प्रदान करें",
      days: "दिनों की संख्या",
      reason: "कारण",
      reasonPlaceholder: "कृपया अनुपस्थिति का कारण दर्ज करें...",
      submit: "जमा करें",
      cancel: "रद्द करें",
      // checkInSuccess: "सफलतापूर्वक चेक इन हो गया!", // Removed
      absentSuccess: "अनुपस्थिति सफलतापूर्वक दर्ज की गई!",
    },
    urdu: {
      title: "چیک ان",
      welcome: "خوش آمدید",
      checkIn: "چیک ان کریں",
      absent: "غیر حاضر",
      back: "پیچھے",
      absentTitle: "غیر حاضر کے طور پر نشان زد کریں",
      absentDescription: "براہ کرم غیر حاضری کی تفصیلات فراہم کریں",
      days: "دنوں کی تعداد",
      reason: "وجہ",
      reasonPlaceholder: "براہ کرم غیر حاضری کی وجہ درج کریں...",
      submit: "جمع کرائیں",
      cancel: "منسوخ کریں",
      // checkInSuccess: "کامیابی سے چیک ان ہوگیا!", // Removed
      absentSuccess: "غیر حاضری کامیابی سے ریکارڈ ہوگئی!",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.english

  const handleNavigateToCheckInProcess = () => {
    router.push(`/checking-in?lang=${language}&emiratesId=${emiratesId}&name=${encodeURIComponent(name)}`)
  }

  const handleAbsentSubmit = () => {
    if (absentDays && absentReason) {
      // Handle absent submission logic here
      alert(t.absentSuccess)
      setIsAbsentDialogOpen(false)
      setAbsentDays("")
      setAbsentReason("")
    }
  }

  const handleBack = () => {
    router.push(`/entry?lang=${language}`)
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
              <CardDescription>
                {t.welcome}, {name}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Emirates ID: {emiratesId}</p>
          </div>

          <Button
            onClick={handleNavigateToCheckInProcess} // Updated onClick handler
            className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2 h-5 w-5" />
            {t.checkIn}
          </Button>

          <Dialog open={isAbsentDialogOpen} onOpenChange={setIsAbsentDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full h-16 text-lg">
                <X className="mr-2 h-5 w-5" />
                {t.absent}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-sm">
              <DialogHeader>
                <DialogTitle>{t.absentTitle}</DialogTitle>
                <DialogDescription>{t.absentDescription}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="days">{t.days}</Label>
                  <Select value={absentDays} onValueChange={setAbsentDays}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="more">More than 7</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">{t.reason}</Label>
                  <Textarea
                    id="reason"
                    value={absentReason}
                    onChange={(e) => setAbsentReason(e.target.value)}
                    placeholder={t.reasonPlaceholder}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsAbsentDialogOpen(false)} className="flex-1">
                    {t.cancel}
                  </Button>
                  <Button onClick={handleAbsentSubmit} className="flex-1" disabled={!absentDays || !absentReason}>
                    {t.submit}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
