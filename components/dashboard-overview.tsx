"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, Car, Wrench, Activity, AlertCircle } from "lucide-react";
import { StatsRepository } from "@/repositories/stats.repo";
import type { Stats } from "@/models/stats.model";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const getEntityIcon = (entityType: string) => {
  switch (entityType.toLowerCase()) {
    case "client":
      return Users;
    case "vehicle":
      return Car;
    case "service":
      return Wrench;
    default:
      return Activity;
  }
};

const getActionColor = (actionType: string) => {
  switch (actionType.toLowerCase()) {
    case "create":
    case "created":
      return "bg-green-500";
    case "update":
    case "updated":
      return "bg-blue-500";
    case "delete":
    case "deleted":
      return "bg-red-500";
    default:
      return "bg-primary";
  }
};

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await StatsRepository.getStats();
        setStats(data);
      } catch (err: any) {
        console.error("Error fetching stats:", err);
        setError(
          err.response?.data?.message || "Error al cargar las estadísticas"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Visión general de tus operaciones
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-2 w-2 rounded-full mt-2" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Visión general de tus operaciones
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "No se pudieron cargar las estadísticas"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Clientes",
      value: stats.statistics.total_clients.toString(),
      icon: Users,
    },
    {
      name: "Vehículos Activos",
      value: stats.statistics.total_vehicles.toString(),
      icon: Car,
    },
    {
      name: "Servicios Hoy",
      value: stats.statistics.services_today.toString(),
      icon: Wrench,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          Visión general de tus operaciones
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Actividad Reciente
        </h3>
        {stats.recent_logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay actividad reciente
          </p>
        ) : (
          <div className="space-y-4">
            {stats.recent_logs.map((log) => {
              const Icon = getEntityIcon(log.entity_type);
              const colorClass = getActionColor(log.action_type);

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${colorClass} mt-2`}
                    />
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{log.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.created_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground capitalize">
                        {log.action_type}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
