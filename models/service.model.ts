import z from "zod";
import { Vehicle } from "./vehicle.model";

export interface Service {
  id: string;
  plate_id: string;
  kind: ServiceKind;
  description?: string;
  created_at: Date;
  closed_at?: Date;
  vehicle?: Vehicle;
}

export enum ServiceKind {
  ENGINE_WASH = "engine_wash",
  EXPRESS_WAX = "express_wax",
  SURFACE_MOISTURIZING = "surface_moisturizing",
  TIRE_SHINE = "tire_shine",
}

export type ServiceStatus = "active" | "inactive";

export type ServiceFormData = Omit<Service, "id" | "vehicle" | "created_at">;

export const serviceSchema: z.ZodType<Partial<ServiceFormData>> = z.object({
  plate_id: z.string().min(1, "Vehicle ID is required"),
  kind: z.nativeEnum(ServiceKind),
  description: z.string().optional(),
});
