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
  Vehicle,
  VehicleFormData,
  VehicleStatus,
} from "@/models/vehicle.model";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "@/repositories/vehicle.repo";
import { Switch } from "@radix-ui/react-switch";
import { useDebounce, useObjectState } from "@uidotdev/usehooks";
import { Car, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(
    null
  );
  const [formData, sFormData] = useObjectState<VehicleFormData>({
    year: new Date().getFullYear(),
    brand: "",
    model: "",
    plate_id: "",
    status: "active",
  });
  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  type _Setter =
    | VehicleFormData
    | ((s: VehicleFormData) => Partial<VehicleFormData>);
  const setFormData = sFormData as unknown as (_: _Setter) => void;

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await getVehicles(searchQuery);
        setVehicles(data);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [debouncedSearchTerm]);

  const handleOpenDialog = (vehicle?: Vehicle) => {
    setEditingVehicle(vehicle || {});
    if (vehicle) {
      setFormData(vehicle);
    }
  };

  const handleSaveVehicle = async () => {
    try {
      setIsLoading(true);
      let newVehicle: Vehicle;
      if (editingVehicle?.id) {
        newVehicle = await updateVehicle(editingVehicle.id!, formData!);
      } else {
        newVehicle = await createVehicle(formData!);
      }
      setVehicles([
        ...vehicles.filter((v) => v.id !== newVehicle.id),
        newVehicle,
      ]);
    } finally {
      setIsLoading(false);
      setEditingVehicle(null);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteVehicle(id);
      setVehicles(vehicles.filter((v) => v.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600";
      // case "maintenance":
      //   return "bg-yellow-500/10 text-yellow-600";
      case "inactive":
        return "bg-gray-500/10 text-gray-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Vehicles
          </h2>
          <p className="text-muted-foreground">Manage your vehicle fleet</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles by brand, model, plate, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                    vehicle.status
                  )}`}
                >
                  {vehicle.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {vehicle.year} {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {vehicle.plate_id}
              </p>
              <div className="space-y-2 text-sm mb-4">
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="text-foreground font-medium">
                    {vehicle.owner}
                  </span>
                </div> */}
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Service:</span>
                  <span className="text-foreground font-medium">
                    {vehicle.lastService}
                  </span>
                </div> */}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleOpenDialog(vehicle)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Dialog
        open={editingVehicle !== null}
        onOpenChange={(open) => {
          open ? null : setEditingVehicle(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
            </DialogTitle>
            <DialogDescription>
              {editingVehicle
                ? "Update vehicle information"
                : "Enter the details for the new vehicle"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData((_) => ({
                      brand: e.target.value,
                    }))
                  }
                  placeholder="Toyota"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData((_) => ({
                      model: e.target.value,
                    }))
                  }
                  placeholder="Camry"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData((_) => ({
                      year: Number.parseInt(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plate_id">License Plate</Label>
                <Input
                  id="plate_id"
                  value={formData.plate_id}
                  onChange={(e) =>
                    setFormData((_) => ({
                      plate_id: e.target.value,
                    }))
                  }
                  placeholder="ABC-1234"
                />
              </div>
            </div>
            <div className="flex gap-2 ">
              <Label htmlFor="status">Active</Label>
              <Switch
                id="status"
                checked={formData.active}
                onCheckedChange={(active) =>
                  setFormData({ ...formData, active })
                }
              ></Switch>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingVehicle(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVehicle}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
