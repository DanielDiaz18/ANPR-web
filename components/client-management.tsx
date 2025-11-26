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
import { Client, ClientFormData, clientSchema } from "@/models/client.model";
import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
  addVehicleToClient,
} from "@/repositories/client.repo";
import { useDebounce } from "@uidotdev/usehooks";
import { Mail, Pencil, Phone, Plus, Search, Trash2, Car } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useWebSocket from 'react-use-websocket';
import { set, z } from "zod";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Spinner } from "./ui/spinner";
import { Switch } from "./ui/switch";
import { useToast } from "./ui/use-toast";
import { WebSocketLike } from "react-use-websocket/dist/lib/types";

export function ClientManagement() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [vehiclePlateId, setVehiclePlateId] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    phone: "",
    enabled: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  const { sendMessage, lastMessage,  readyState } = useWebSocket('ws://localhost:8000/api/v1/ws/clients');

  useEffect(() => {
    if (lastMessage === null) return;
    const payload = JSON.parse(lastMessage.data);

    switch (payload.type) {
      case 'initial_data':
        setClients(payload.data);
        break;
      case 'update':
        const index = clients.findIndex((client) => client.id === payload.data.id);
        if (index === -1) {
          setClients((prevClients) => [...prevClients, payload.data]);
        } else {
          setClients((prevClients) =>
            prevClients.map((client) =>
              client.id === payload.data.id ? payload.data : client
            )
          );
        }
        break;
    }
    console.log(payload);
  }, [lastMessage]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setIsLoading(true);
  //       const data = await getClients(debouncedSearchTerm);
  //       setClients(data);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   })();
  // }, [debouncedSearchTerm]);

  const handleOpenDialog = (client?: Client) => {
    setFormError(null);
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        enabled: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveClient = async () => {
    try {
      if (editingClient) {
        setIsLoading(true);
        const updatedClient = await updateClient(editingClient.id, formData);
        toast({
          title: "✅ Client Updated",
          description: `Client has been updated.`,
        });
        setClients(
          clients.map((c) => (c.id === editingClient.id ? updatedClient : c))
        );
      } else {
        clientSchema.parse(formData);
        const client = await createClient(formData);
        setIsLoading(true);
        setClients([...clients, client]);
      }
    } catch (e) {
      setFormError(
        (e as z.ZodError).errors.map((err) => err.message).join(", ")
      );
      if (!(e instanceof z.ZodError)) {
        toast({
          title: "Invalid input",
          description: (e as z.ZodError).errors
            .map((err) => err.message)
            .join(", "),
          variant: "destructive",
        });
      }
      return;
    } finally {
      setIsLoading(false);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteClient = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteClient(id);
      setClients(clients.filter((c) => c.id !== id));
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddVehicleDialog = (client: Client) => {
    setSelectedClient(client);
    setVehiclePlateId("");
    setIsAddVehicleDialogOpen(true);
  };

  const handleAddVehicle = async () => {
    if (!selectedClient || !vehiclePlateId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid plate ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const updatedClient = await addVehicleToClient(
        selectedClient.id,
        vehiclePlateId.trim()
      );
      
      setClients(
        clients.map((c) => (c.id === updatedClient.id ? updatedClient : c))
      );
      
      toast({
        title: "✅ Vehicle Added",
        description: `Vehicle ${vehiclePlateId} has been added to ${selectedClient.name}`,
      });
      
      setIsAddVehicleDialogOpen(false);
      setVehiclePlateId("");
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.response?.data?.message || "Failed to add vehicle",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Clients
          </h2>
          <p className="text-muted-foreground">Manage your client database</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients by name, or email..."
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
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Vehicles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 flex items-center"
                  >
                    <Spinner></Spinner>
                  </TableCell>
                </TableRow>
              )}
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {client.vehicles?.length || 0} vehicle{client.vehicles?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {client.vehicles && client.vehicles.length > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {client.vehicles.slice(0, 2).map((v) => v.plate_id).join(', ')}
                        {client.vehicles.length > 2 && '...'}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.enabled
                          ? "bg-green-500/10 text-green-600"
                          : "bg-gray-500/10 text-gray-600"
                      }`}
                    >
                      {client.enabled ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenAddVehicleDialog(client)}
                        title="Add Vehicle"
                      >
                        <Car className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(client)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClient(client.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Edit Client" : "Add New Client"}
            </DialogTitle>
            <DialogDescription>
              {editingClient
                ? "Update client information"
                : "Enter the details for the new client"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Smith"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="flex gap-2 ">
              <Label htmlFor="status">Active</Label>
              <Switch
                id="status"
                checked={formData.enabled}
                onCheckedChange={(enabled) =>
                  setFormData({ ...formData, enabled })
                }
              ></Switch>
            </div>
            <div className="text-sm error-text text-red-600">{formError}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClient}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <Label htmlFor="sheet-demo-name">Name</Label>
              <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sheet-demo-username">Username</Label>
              <Input id="sheet-demo-username" defaultValue="@peduarte" />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={isAddVehicleDialogOpen} onOpenChange={setIsAddVehicleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Vehicle to Client</DialogTitle>
            <DialogDescription>
              Add a vehicle to {selectedClient?.name} by entering the license plate ID
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="plate_id">License Plate ID</Label>
              <Input
                id="plate_id"
                value={vehiclePlateId}
                onChange={(e) => setVehiclePlateId(e.target.value)}
                placeholder="ABC-1234"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddVehicle();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Enter the license plate ID of the vehicle to add to this client
              </p>
            </div>
            {selectedClient?.vehicles && selectedClient.vehicles.length > 0 && (
              <div className="grid gap-2">
                <Label>Current Vehicles</Label>
                <div className="rounded-md border border-border p-3">
                  <div className="space-y-2">
                    {selectedClient.vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center gap-2 text-sm">
                        <Car className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{vehicle.plate_id}</span>
                        <span className="text-muted-foreground">
                          - {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVehicleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVehicle} disabled={isLoading || !vehiclePlateId.trim()}>
              {isLoading ? "Adding..." : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
