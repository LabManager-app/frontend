"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

const projectsData = {
  "1": {
    name: "Protein Analysis Study",
    lab: "Lab A-101",
    leader: "Dr. Sarah Chen",
    status: "active",
    startDate: "2025-10-20",
    description:
      "Comprehensive study analyzing protein structures and their interactions using advanced microscopy techniques. This research aims to understand the fundamental mechanisms of protein folding and stability.",
    equipment: ["Microscope", "Centrifuge", "PCR Machine"],
    employees: [
      { name: "Dr. Sarah Chen", role: "Project Leader" },
      { name: "Alex Martinez", role: "Research Assistant" },
      { name: "Jessica Lee", role: "Lab Technician" },
    ],
  },
  "2": {
    name: "Cell Culture Research",
    lab: "Lab A-105",
    leader: "Dr. Michael Roberts",
    status: "active",
    startDate: "2025-10-22",
    description:
      "Investigation of cell growth patterns and behavior in controlled environments. Focus on optimizing culture conditions for various cell types and understanding cellular responses to environmental changes.",
    equipment: ["Flow Cytometer", "Cell Counter", "Biosafety Cabinet"],
    employees: [
      { name: "Dr. Michael Roberts", role: "Project Leader" },
      { name: "Rachel Kim", role: "Senior Researcher" },
      { name: "David Brown", role: "Research Assistant" },
      { name: "Maria Garcia", role: "Lab Technician" },
    ],
  },
  "3": {
    name: "Chemical Synthesis",
    lab: "Lab A-103",
    leader: "Dr. Emily Johnson",
    status: "completed",
    startDate: "2025-10-15",
    description:
      "Development of novel synthetic pathways for organic compounds using chromatographic separation techniques. This project successfully identified several new compounds with potential pharmaceutical applications.",
    equipment: ["HPLC", "Mass Spectrometer", "Chromatography"],
    employees: [
      { name: "Dr. Emily Johnson", role: "Project Leader" },
      { name: "Thomas Anderson", role: "Chemical Engineer" },
      { name: "Sophie Williams", role: "Research Assistant" },
    ],
  },
  "4": {
    name: "Microbial Growth Analysis",
    lab: "Lab A-102",
    leader: "Dr. James Wilson",
    status: "active",
    startDate: "2025-11-01",
    description:
      "Study of bacterial growth patterns under various environmental conditions using spectrophotometry and incubation techniques.",
    equipment: ["Spectrophotometer", "Incubator", "Autoclave"],
    employees: [
      { name: "Dr. James Wilson", role: "Project Leader" },
      { name: "Emma Thompson", role: "Microbiologist" },
      { name: "Chris Evans", role: "Lab Technician" },
    ],
  },
  "5": {
    name: "Enzyme Kinetics Study",
    lab: "Lab A-102",
    leader: "Dr. Lisa Anderson",
    status: "active",
    startDate: "2025-10-28",
    description: "Research on enzyme activity and reaction rates under different temperature and pH conditions.",
    equipment: ["Spectrophotometer", "Incubator"],
    employees: [
      { name: "Dr. Lisa Anderson", role: "Project Leader" },
      { name: "Kevin Zhang", role: "Research Associate" },
    ],
  },
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projectsData[id as keyof typeof projectsData]

  if (!project) {
    return <div>Project not found</div>
  }

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
              <h1 className="text-3xl font-bold text-foreground mb-2">{project.name}</h1>
              <p className="text-muted-foreground">{project.lab}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={project.status === "active" ? "default" : "secondary"}
                className={
                  project.status === "active"
                    ? "bg-accent text-accent-foreground"
                    : project.status === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                }
              >
                {project.status.toUpperCase()}
              </Badge>
              <StatusChangeDialog projectId={id} currentStatus={project.status} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Leader</p>
                  <p className="text-base">{project.leader}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                  <p className="text-base">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-base">{project.lab}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Equipment Used</CardTitle>
                <CardDescription>Equipment reserved for this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.equipment.map((item, index) => (
                    <Badge key={index} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.employees.map((employee, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function StatusChangeDialog({ projectId, currentStatus }: { projectId: string; currentStatus: string }) {
  const [open, setOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)

  const handleSave = () => {
    // In a real app, this would update the database
    console.log("[v0] Changing project status to:", selectedStatus)
    setOpen(false)
    // Refresh the page to show the new status
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Change Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Project Status</DialogTitle>
          <DialogDescription>Select the new status for this project</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="active" />
              <Label htmlFor="active" className="flex items-center gap-2 cursor-pointer">
                <Badge className="bg-accent text-accent-foreground">ACTIVE</Badge>
                <span className="text-sm text-muted-foreground">Project is currently ongoing</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed" className="flex items-center gap-2 cursor-pointer">
                <Badge className="bg-green-500 text-white">COMPLETED</Badge>
                <span className="text-sm text-muted-foreground">Project has been finished</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="canceled" id="canceled" />
              <Label htmlFor="canceled" className="flex items-center gap-2 cursor-pointer">
                <Badge className="bg-red-500 text-white">CANCELED</Badge>
                <span className="text-sm text-muted-foreground">Project has been canceled</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
