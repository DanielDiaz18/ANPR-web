import axiosInstance from "@/lib/axiosInstance";
import type { Stats } from "@/models/stats.model";

export class StatsRepository {
  private static readonly BASE_URL = "/dashboard/stats";

  static async getStats(): Promise<Stats> {
    const response = await axiosInstance.get<Stats>(this.BASE_URL);
    return response.data;
  }
}
