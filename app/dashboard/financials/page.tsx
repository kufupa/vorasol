import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function FinancialOverviewPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Track and manage financial data related to riders and operations.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This page will display financial summaries, reports, and tools for managing rider financials. Detailed rider
          financials can be accessed via their profile.
        </p>
        {/* Placeholder for financial charts, tables, and tools */}
      </CardContent>
    </Card>
  )
}
