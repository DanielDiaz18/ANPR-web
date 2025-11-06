"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Service,
  ServiceFormData,
  ServiceKind,
  serviceSchema,
} from "@/models/service.model";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "@/repositories/service.repo";
import { useDebounce, useObjectState, useToggle } from "@uidotdev/usehooks";
import { Calendar, Check, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function ServiceManagement() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useToggle(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 300);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(
    null
  );
  const [formData, setFormData] = useObjectState<ServiceFormData>({
    plate_id: "",
    kind: ServiceKind.ENGINE_WASH,
  });

  const serviceKinds = {
    [ServiceKind.ENGINE_WASH]: {
      label: "Engine Wash",
      description: "Thorough cleaning of the engine compartment.",
      style: "bg-green-500/10 text-green-600",
    },
    [ServiceKind.EXPRESS_WAX]: {
      label: "Express Wax",
      description: "Quick application of wax for a shiny finish.",
      style: "bg-blue-500/10 text-blue-600",
    },
    [ServiceKind.SURFACE_MOISTURIZING]: {
      label: "Surface Moisturizing",
      description: "Hydration treatment for vehicle surfaces.",
      style: "bg-purple-500/10 text-purple-600",
    },
    [ServiceKind.TIRE_SHINE]: {
      label: "Tire Shine",
      description: "Enhances the appearance of tires with a glossy finish.",
      style: "bg-yellow-500/10 text-yellow-600",
    },
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await getServices(debouncedSearchTerm);
        setServices(data);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [debouncedSearchTerm]);

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService({});
      setFormData({
        plate_id: "",
        kind: ServiceKind.ENGINE_WASH,
      });
    }
  };

  const handleSaveService = async () => {
    try {
      setIsLoading(true);
      const data = serviceSchema.parse(formData);
      if (editingService?.id) {
        const updated = await updateService(editingService.id, formData);
        setServices([
          ...services.filter((s) => s.id !== editingService.id),
          updated,
        ]);
        toast({
          title: "✅ Service Updated",
          description: `Service ${updated.id} has been updated.`,
        });
      } else {
        const newService = await createService(formData);
        setServices([...services, newService]);
        toast({
          title: "✅ Service Created",
          description: `Service ${newService.id} has been created.`,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error);
        const errorMessage = error.errors.map((err) => err.message).join(", ");
        toast({
          title: "❌ Validation Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      setIsLoading(true);
      const service = services.find((s) => s.id === id);
      await deleteService(id);
      setServices(services.filter((s) => s.id !== id));

      if (service) {
        toast({
          title: "🗑️ Service Deleted",
          description: `Service ${service.id} has been removed.`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoneService = async (id: string) => {
    try {
      setIsLoading(true);
      const updated = await updateService(id, { closed_at: new Date() });
      setServices(services.map((s) => (s.id === id ? updated : s)));
    } finally {
      setIsLoading(false);
    }
  };

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Services
          </h2>
          <p className="text-muted-foreground">
            Track and manage service appointments
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Create Service
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
                <TableHead>Created at</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    {service.vehicle?.brand} {service.vehicle?.model}
                  </TableCell>
                  <TableCell>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          serviceKinds[service.kind]?.style
                        }`}
                      >
                        {serviceKinds[service.kind]?.label}
                      </span>

                      <div className="text-sm text-muted-foreground">
                        {service.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {dateFormatter.format(new Date(service.created_at))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          service.closed_at
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-gray-500/10 text-gray-600"
                        }`}
                      >
                        {service.closed_at ? "Completed" : "in-progress"}
                      </span>

                      <div className="text-sm text-muted-foreground">
                        {service.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!service.closed_at && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDoneService(service.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(service)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteService(service.id)}
                      >
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

      <Dialog
        open={editingService !== null}
        onOpenChange={(open) => {
          if (!open) setEditingService(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Schedule New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Update service information"
                : "Enter the details for the new service"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="plate_id">Vehicle</Label>
              <Input
                id="vehicleName"
                value={formData.plate_id}
                onChange={(e) =>
                  setFormData({ ...formData, plate_id: e.target.value })
                }
                placeholder="ABC-1234"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceKind">Service Type</Label>
                <Select
                  value={formData.kind}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      kind: value as ServiceKind,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ServiceKind).map((kind) => (
                      <SelectItem key={kind} value={kind}>
                        {serviceKinds[kind].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the service work to be performed..."
                rows={3}
              />
            </div>
            {/* <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as
                      | "scheduled"
                      | "in-progress"
                      | "completed"
                      | "cancelled",
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingService(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveService}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
