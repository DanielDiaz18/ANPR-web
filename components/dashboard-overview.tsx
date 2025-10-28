"use client"

import { Card } from "@/components/ui/card"
import { Users, Car, Wrench, Video } from "lucide-react"

const stats = [
  { name: "Total Clients", value: "248", icon: Users, change: "+12%" },
  { name: "Active Vehicles", value: "156", icon: Car, change: "+8%" },
  { name: "Services Today", value: "23", icon: Wrench, change: "+15%" },
  { name: "Cameras Online", value: "12/12", icon: Video, change: "100%" },
]

const recentActivity = [
  { id: 1, type: "client", message: "New client registered: John Smith", time: "5 min ago" },
  { id: 2, type: "service", message: "Service completed for Vehicle #1234", time: "12 min ago" },
  { id: 3, type: "vehicle", message: "Vehicle inspection due: Toyota Camry", time: "1 hour ago" },
  { id: 4, type: "camera", message: "Camera 3 reconnected", time: "2 hours ago" },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your business operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
