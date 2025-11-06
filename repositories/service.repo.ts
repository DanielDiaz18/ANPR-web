import axios from "@/lib/axiosInstance";
import { Service, ServiceFormData } from "@/models/service.model";

export async function getServices(q?: string): Promise<Service[]> {
  const params: Record<string, any> = {};
  if (q) {
    params.q = q;
  }
  const { data } = await axios.get("/service", { params });

  console.log(data);
  return data.services as Service[];
}

export async function getServiceById(id: string): Promise<Service> {
  const { data } = await axios.get(`/service/${id}`);

  return data.service as Service;
}

export async function createService(
  serviceData: ServiceFormData
): Promise<Service> {
  const { data } = await axios.post("/service", serviceData);

  return data.service as Service;
}

export async function updateService(
  id: string,
  serviceData: Partial<ServiceFormData>
): Promise<Service> {
  const { data } = await axios.put(`/service/${id}`, serviceData);

  return data.service as Service;
}

export async function deleteService(id: string): Promise<void> {
  await axios.delete(`/service/${id}`);
}
