import z from "zod";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate_id: string;
  active: boolean;
}

export type VehicleStatus = "active" | "inactive";

export type VehicleFormData = Omit<Vehicle, "id">;

export const vehicleSchema: z.ZodType<VehicleFormData> = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .min(1886, "Year must be 1886 or later") // First car invented in 1886
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  plate_id: z.string().min(1, "License plate is required"),
  owner: z.string().min(1, "Owner is required"),
  active: z.boolean(),
});
