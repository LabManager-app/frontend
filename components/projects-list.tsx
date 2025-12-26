import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const projects = [
  {
    id: 1,
    name: "Protein Analysis Study",
    lab: "Lab A-101",
    leader: "Dr. Sarah Chen",
    status: "active",
    startDate: "2025-10-20",
    equipment: ["Microscope", "Centrifuge"],
  },
  {
    id: 2,
    name: "Cell Culture Research",
    lab: "Lab A-105",
    leader: "Dr. Michael Roberts",
    status: "active",
    startDate: "2025-10-22",
    equipment: ["Flow Cytometer", "Biosafety Cabinet"],
  },
  {
    id: 3,
    name: "Chemical Synthesis",
    lab: "Lab A-103",
    leader: "Dr. Emily Johnson",
    status: "completed",
    startDate: "2025-10-15",
    equipment: ["HPLC", "Chromatography"],
  },
]

export function ProjectsList() {
  const activeProjects = projects.filter((project) => project.status === "active")
  const pastProjects = projects.filter((project) => project.status === "completed" || project.status === "canceled")

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Active Projects</h3>
        {activeProjects.length > 0 ? (
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>
                        Led by {project.leader} • {project.lab} • Started{" "}
                        {new Date(project.startDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">ACTIVE</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {project.equipment.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
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
            <CardContent className="py-8 text-center text-muted-foreground">No active projects</CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Past Projects</h3>
        {pastProjects.length > 0 ? (
          <div className="space-y-4">
            {pastProjects.map((project) => (
              <Card key={project.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>
                        Led by {project.leader} • {project.lab} • Started{" "}
                        {new Date(project.startDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        project.status === "completed"
                          ? "bg-green-500 text-white"
                          : project.status === "canceled"
                            ? "bg-red-500 text-white"
                            : ""
                      }
                    >
                      {project.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {project.equipment.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
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
            <CardContent className="py-8 text-center text-muted-foreground">No past projects</CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
