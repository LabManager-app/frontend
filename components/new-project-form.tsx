"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// available equipment will be loaded from backend
// GET /labs/equipment -> returns List<String>
const initialAvailableEquipment: string[] = []

const availableEmployees = [
  { id: 1, name: "Alex Martinez", role: "Research Assistant" },
  { id: 2, name: "Jessica Lee", role: "Lab Technician" },
  { id: 3, name: "Rachel Kim", role: "Senior Researcher" },
  { id: 4, name: "David Brown", role: "Research Assistant" },
  { id: 5, name: "Maria Garcia", role: "Lab Technician" },
  { id: 6, name: "Thomas Anderson", role: "Chemical Engineer" },
  { id: 7, name: "Sophie Williams", role: "Research Assistant" },
  { id: 8, name: "Emma Thompson", role: "Microbiologist" },
  { id: 9, name: "Chris Evans", role: "Lab Technician" },
  { id: 10, name: "Kevin Zhang", role: "Research Associate" },
]

export function NewProjectForm() {
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedEquipment, setSelectedEquipment] = useState<Record<string, number>>({})
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
  const [matchedLabs, setMatchedLabs] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [availableEquipment, setAvailableEquipment] = useState<string[]>(initialAvailableEquipment)

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment((prev) => {
      const copy = { ...prev }
      if (copy[equipment] !== undefined) {
        delete copy[equipment]
      } else {
        copy[equipment] = 1
      }
      return copy
    })
  }

  const setEquipmentQuantity = (equipment: string, qty: number) => {
    setSelectedEquipment((prev) => {
      if (!prev[equipment]) return prev
      const copy = { ...prev }
      copy[equipment] = Math.max(1, qty)
      return copy
    })
  }

  const toggleEmployee = (employeeId: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId],
    )
  }

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch("http://localhost:8080/labs/equipment")
        if (!res.ok) return
        const data: string[] = await res.json()
        setAvailableEquipment(data)
      } catch (e) {
        // ignore for now
      }
    }
    fetchEquipment()
  }, [])

  const findAvailableLabs = () => {
    setIsSearching(true)

    const payload = Object.entries(selectedEquipment).map(([name, qty]) => ({ name, stock: qty }))

    fetch("http://localhost:8080/labs/reservation", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("network")
        return res.json()
      })
      .then((data) => setMatchedLabs(data))
      .catch(() => setMatchedLabs([]))
      .finally(() => setIsSearching(false))
  }

  const handleReserve = (labId: string) => {
    // For now just navigate after reserving; backend reservation can be added later
    setTimeout(() => {
      router.push("/dashboard")
    }, 500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Provide information about your research project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="e.g., Protein Analysis Study"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your research project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required Equipment</CardTitle>
          <CardDescription>Select all equipment needed for your project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableEquipment.map((equipment) => (
              <div key={equipment} className="flex items-center space-x-2">
                <Checkbox
                  id={equipment}
                  checked={selectedEquipment[equipment] !== undefined}
                  onCheckedChange={() => toggleEquipment(equipment)}
                />
                <Label htmlFor={equipment} className="text-sm font-normal cursor-pointer">
                  {equipment}
                </Label>
                {selectedEquipment[equipment] !== undefined && (
                  <div className="ml-2">
                    <Input
                      type="number"
                      min={1}
                      value={selectedEquipment[equipment]}
                      onChange={(e) => setEquipmentQuantity(equipment, parseInt(e.target.value || "1", 10))}
                      className="w-20"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {Object.keys(selectedEquipment).length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm font-medium mb-3">Selected Equipment ({Object.keys(selectedEquipment).length}):</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedEquipment).map(([name, qty]) => (
                  <Badge key={name} variant="secondary">
                    {name} x{qty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Select employees to work on this project. You will be added as project leader.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/5 transition-colors"
              >
                <Checkbox
                  id={`employee-${employee.id}`}
                  checked={selectedEmployees.includes(employee.id)}
                  onCheckedChange={() => toggleEmployee(employee.id)}
                />
                <Label htmlFor={`employee-${employee.id}`} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>

          {selectedEmployees.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm font-medium mb-3">Selected Team Members ({selectedEmployees.length + 1}):</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="bg-primary">
                  You (Project Leader)
                </Badge>
                {selectedEmployees.map((employeeId) => {
                  const employee = availableEmployees.find((e) => e.id === employeeId)
                  return (
                    <Badge key={employeeId} variant="secondary">
                      {employee?.name}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={findAvailableLabs}
        disabled={!projectName || Object.keys(selectedEquipment).length === 0 || isSearching}
      >
        {isSearching ? "Finding Available Labs..." : "Find Available Labs"}
      </Button>

      {matchedLabs.length > 0 && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle>Available Labs</CardTitle>
            <CardDescription>We found {matchedLabs.length} labs that match your requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {matchedLabs.map((lab: any) => (
              <div
                key={lab.labId}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{lab.labId}</h3>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground">{lab.location}</p>
                  </div>
                </div>
                <Button onClick={() => handleReserve(lab.labId)}>Reserve Lab</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
