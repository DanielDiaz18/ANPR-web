import z from "zod";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  enabled: boolean;
  created_at?: Date;
}

export type ClientFormData = Omit<Client, "id">;

export const clientSchema: z.ZodType<ClientFormData> = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(1, "Phone number is required"),
  enabled: z.boolean(),
});
