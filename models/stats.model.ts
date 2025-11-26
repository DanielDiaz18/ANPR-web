export interface Stats {
  recent_logs: RecentLog[];
  statistics: Statistics;
  timestamp: Date;
}

export interface RecentLog {
  id: number;
  action_type: string;
  entity_type: string;
  entity_id: number | null;
  description: string;
  created_at: Date;
}

export interface Statistics {
  total_clients: number;
  total_vehicles: number;
  services_today: number;
}
