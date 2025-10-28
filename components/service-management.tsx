"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Calendar, DollarSign } from "lucide-react"

interface Service {
  id: string
  vehicleId: string
  vehicleName: string
  serviceType: string
  description: string
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  scheduledDate: string
  completedDate?: string
  cost: number
  technician: string
}

const initialServices: Service[] = [
  {
    id: "1",
    vehicleId: "1",
    vehicleName: "2022 Toyota Camry (ABC-1234)",
    serviceType: "Oil Change",
    description: "Regular oil change and filter replacement",
    status: "completed",
    scheduledDate: "2024-10-15",
    completedDate: "2024-10-15",
    cost: 45.99,
    technician: "Mike Johnson",
  },
  {
    id: "2",
    vehicleId: "2",
    vehicleName: "2021 Honda Civic (XYZ-5678)",
    serviceType: "Brake Inspection",
    description: "Full brake system inspection and pad replacement",
    status: "in-progress",
    scheduledDate: "2024-10-28",
    cost: 250.0,
    technician: "Sarah Williams",
  },
  {
    id: "3",
    vehicleId: "3",
    vehicleName: "2020 Ford F-150 (DEF-9012)",
    serviceType: "Tire Rotation",
    description: "Rotate all four tires and check alignment",
    status: "scheduled",
    scheduledDate: "2024-10-30",
    cost: 65.0,
    technician: "Tom Anderson",
  },
  {
    id: "4",
    vehicleId: "4",
    vehicleName: "2023 Tesla Model 3 (TES-3456)",
    serviceType: "Annual Inspection",
    description: "Complete vehicle inspection and software update",
    status: "scheduled",
    scheduledDate: "2024-11-05",
    cost: 150.0,
    technician: "Lisa Chen",
  },
]

export function ServiceManagement() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    vehicleId: "",
    vehicleName: "",
    serviceType: "",
    description: "",
    status: "scheduled" as "scheduled" | "in-progress" | "completed" | "cancelled",
    scheduledDate: "",
    cost: 0,
    technician: "",
  })

  const filteredServices = services.filter(
    (service) =>
      service.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.technician.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        vehicleId: service.vehicleId,
        vehicleName: service.vehicleName,
        serviceType: service.serviceType,
        description: service.description,
        status: service.status,
        scheduledDate: service.scheduledDate,
        cost: service.cost,
        technician: service.technician,
      })
    } else {
      setEditingService(null)
      setFormData({
        vehicleId: "",
        vehicleName: "",
        serviceType: "",
        description: "",
        status: "scheduled",
        scheduledDate: "",
        cost: 0,
        technician: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSaveService = () => {
    if (editingService) {
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                ...formData,
                completedDate: formData.status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
              }
            : s,
        ),
      )
    } else {
      const newService: Service = {
        id: String(services.length + 1),
        ...formData,
        completedDate: formData.status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
      }
      setServices([...services, newService])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600"
      case "in-progress":
        return "bg-blue-500/10 text-blue-600"
      case "scheduled":
        return "bg-yellow-500/10 text-yellow-600"
      case "cancelled":
        return "bg-red-500/10 text-red-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Services</h2>
          <p className="text-muted-foreground">Track and manage service appointments</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Service
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services by vehicle, type, or technician..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.vehicleName}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.serviceType}</div>
                      <div className="text-sm text-muted-foreground">{service.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{service.technician}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {service.scheduledDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {service.cost.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(service.status)}`}
                    >
                      {service.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(service)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Schedule New Service"}</DialogTitle>
            <DialogDescription>
              {editingService ? "Update service information" : "Enter the details for the new service"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="vehicleName">Vehicle</Label>
              <Input
                id="vehicleName"
                value={formData.vehicleName}
                onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                placeholder="2022 Toyota Camry (ABC-1234)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Input
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  placeholder="Oil Change"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="technician">Technician</Label>
                <Input
                  id="technician"
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                  placeholder="Mike Johnson"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the service work to be performed..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "scheduled" | "in-progress" | "completed" | "cancelled",
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveService}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
