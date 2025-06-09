import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function RiderProfilesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rider Profiles</CardTitle>
        <CardDescription>Manage and view detailed profiles of all riders.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This page will list all riders. Clicking on a rider would typically open their profile (modal/sheet or a
          dedicated page). For now, rider profiles can be accessed via the "Edit" button on the Dashboard Overview's
          Driver Status table.
        </p>
        {/* Placeholder for rider list and management tools */}
      </CardContent>
    </Card>
  )
}
