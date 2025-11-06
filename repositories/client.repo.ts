import axios from "@/lib/axiosInstance";
import { Client, ClientFormData } from "@/models/client.model";

export async function getClients(q: string): Promise<Client[]> {
  const params: Record<string, any> = {};
  if (q) {
    params.q = q;
  }
  const { data } = await axios.get("/client", {
    params,
  });

  return data.clients as Client[];
}

export async function getClientById(id: string): Promise<Client> {
  const { data } = await axios.get(`/client/${id}`);

  return data.client as Client;
}

export async function createClient(
  clientData: ClientFormData
): Promise<Client> {
  const { data } = await axios.post("/client", clientData);

  return data.client as Client;
}

export async function updateClient(
  id: string,
  clientData: ClientFormData
): Promise<Client> {
  const { data } = await axios.put(`/client/${id}`, clientData);

  return data.client as Client;
}

export async function deleteClient(id: string): Promise<void> {
  await axios.delete(`/client/${id}`);
}
