import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { labsPath } from "@/lib/backend"

export default async function LabDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Try to fetch a single lab resource first; if backend doesn't expose
  // GET /labs/{id}, fall back to GET /labs and find the matching lab.
  let lab: any = null
  try {
    const res = await fetch(labsPath(`/labs/${encodeURIComponent(id)}`))
    if (res.ok) {
      lab = await res.json()
    } else {
      const all = await fetch(labsPath("/labs"))
      if (all.ok) {
        const data = await all.json()
        lab = data.find((l: any) => String(l.labId) === String(id))
      }
    }
  } catch (e) {
    // ignore, we'll handle missing lab below
  }

  if (!lab) {
    return <div>Lab not found</div>
  }

  // fetch equipment list for the lab (controller exposes /labs/{labId}/equipment)
  let equipment: any[] = []
  try {
    const eqRes = await fetch(labsPath(`/labs/${encodeURIComponent(id)}/equipment`))
    if (eqRes.ok) equipment = await eqRes.json()
  } catch (e) {}

  const projects = lab.projects ?? []

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Button>
        </Link>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{lab.name}</h1>
            </div>
            <Badge
              variant={lab.status === "available" ? "default" : lab.status === "occupied" ? "secondary" : "outline"}
              className={lab.status === "available" ? "bg-accent text-accent-foreground" : ""}
            >
              {lab.status}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
              <CardDescription>Available equipment in this lab</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {equipment && equipment.length > 0 ? (
                  equipment.map((item: any, index: number) => (
                    <Badge key={index} variant="outline">
                      {typeof item === "string" ? item : item.name || item.equipmentType || item.type || JSON.stringify(item)}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No equipment information</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Projects in This Lab</h2>
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project: any) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription>Led by {project.leader}</CardDescription>
                        </div>
                        <Badge
                          variant={project.status === "active" ? "default" : "secondary"}
                          className={project.status === "active" ? "bg-accent text-accent-foreground" : ""}
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Start Date: {new Date(project.startDate).toLocaleDateString()}
                        </p>
                        <Link href={`/project/${project.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No projects currently in this lab</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
