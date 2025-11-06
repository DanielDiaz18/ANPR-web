import axios from "@/lib/axiosInstance";
import { Vehicle, VehicleFormData } from "@/models/vehicle.model";

export async function getVehicles(q?: string): Promise<Vehicle[]> {
  const params: Record<string, any> = {};
  if (q) {
    params.q = q;
  }
  const { data } = await axios.get("/vehicle", { params });

  console.log(data);
  return data.vehicles as Vehicle[];
}

export async function getVehicleById(id: string): Promise<Vehicle> {
  const { data } = await axios.get(`/vehicle/${id}`);

  return data.vehicle as Vehicle;
}

export async function createVehicle(
  vehicleData: VehicleFormData
): Promise<Vehicle> {
  const { data } = await axios.post("/vehicle", vehicleData);

  return data.vehicle as Vehicle;
}

export async function updateVehicle(
  id: string,
  vehicleData: VehicleFormData
): Promise<Vehicle> {
  const { data } = await axios.put(`/vehicle/${id}`, vehicleData);

  return data.vehicle as Vehicle;
}

export async function deleteVehicle(id: string): Promise<void> {
  await axios.delete(`/vehicle/${id}`);
}
