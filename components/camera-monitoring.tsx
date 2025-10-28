"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Maximize2, AlertCircle, CheckCircle, Settings } from "lucide-react"

interface Camera {
  id: string
  name: string
  location: string
  status: "online" | "offline" | "recording"
  streamUrl: string
  lastActive: string
}

const cameras: Camera[] = [
  {
    id: "1",
    name: "Front Entrance",
    location: "Main Building - Entrance",
    status: "online",
    streamUrl: "/security-camera-front-entrance.png",
    lastActive: "Just now",
  },
  {
    id: "2",
    name: "Parking Lot A",
    location: "North Parking Area",
    status: "recording",
    streamUrl: "/security-camera-parking-lot.png",
    lastActive: "Just now",
  },
  {
    id: "3",
    name: "Service Bay 1",
    location: "Workshop - Bay 1",
    status: "online",
    streamUrl: "/security-camera-workshop-bay.jpg",
    lastActive: "Just now",
  },
  {
    id: "4",
    name: "Service Bay 2",
    location: "Workshop - Bay 2",
    status: "online",
    streamUrl: "/security-camera-workshop-interior.jpg",
    lastActive: "Just now",
  },
  {
    id: "5",
    name: "Back Exit",
    location: "Main Building - Rear",
    status: "online",
    streamUrl: "/security-camera-back-exit.jpg",
    lastActive: "Just now",
  },
  {
    id: "6",
    name: "Reception Area",
    location: "Main Building - Lobby",
    status: "recording",
    streamUrl: "/security-camera-reception-lobby.jpg",
    lastActive: "Just now",
  },
  {
    id: "7",
    name: "Parking Lot B",
    location: "South Parking Area",
    status: "offline",
    streamUrl: "/security-camera-offline.jpg",
    lastActive: "2 hours ago",
  },
  {
    id: "8",
    name: "Storage Room",
    location: "Main Building - Storage",
    status: "online",
    streamUrl: "/security-camera-storage-room.jpg",
    lastActive: "Just now",
  },
  {
    id: "9",
    name: "Side Entrance",
    location: "Main Building - Side Door",
    status: "online",
    streamUrl: "/security-camera-side-entrance.jpg",
    lastActive: "Just now",
  },
  {
    id: "10",
    name: "Parts Counter",
    location: "Workshop - Parts Area",
    status: "recording",
    streamUrl: "/security-camera-parts-counter.jpg",
    lastActive: "Just now",
  },
  {
    id: "11",
    name: "Waiting Area",
    location: "Main Building - Customer Lounge",
    status: "online",
    streamUrl: "/security-camera-waiting-area.jpg",
    lastActive: "Just now",
  },
  {
    id: "12",
    name: "Perimeter East",
    location: "Exterior - East Side",
    status: "online",
    streamUrl: "/security-camera-fence.png",
    lastActive: "Just now",
  },
]

export function CameraMonitoring() {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "single">("grid")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "recording":
        return <Video className="h-4 w-4 text-red-600 animate-pulse" />
      case "offline":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 text-green-600"
      case "recording":
        return "bg-red-500/10 text-red-600"
      case "offline":
        return "bg-gray-500/10 text-gray-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  const onlineCount = cameras.filter((c) => c.status === "online" || c.status === "recording").length
  const recordingCount = cameras.filter((c) => c.status === "recording").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Camera Monitoring</h2>
          <p className="text-muted-foreground">
            {onlineCount}/{cameras.length} cameras online • {recordingCount} recording
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} onClick={() => setViewMode("grid")}>
            Grid View
          </Button>
          <Button variant={viewMode === "single" ? "default" : "outline"} onClick={() => setViewMode("single")}>
            Single View
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cameras.map((camera) => (
            <Card key={camera.id} className="overflow-hidden">
              <div className="relative aspect-video bg-black">
                <img
                  src={camera.streamUrl || "/placeholder.svg"}
                  alt={camera.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(camera.status)}`}
                  >
                    {getStatusIcon(camera.status)}
                    {camera.status}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-2 right-2 h-8 w-8"
                  onClick={() => {
                    setSelectedCamera(camera)
                    setViewMode("single")
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{camera.name}</h3>
                <p className="text-sm text-muted-foreground">{camera.location}</p>
                <p className="text-xs text-muted-foreground mt-1">Last active: {camera.lastActive}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black">
              <img
                src={selectedCamera?.streamUrl || cameras[0].streamUrl}
                alt={selectedCamera?.name || cameras[0].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2">
                  <h3 className="text-lg font-semibold text-white">{selectedCamera?.name || cameras[0].name}</h3>
                  <p className="text-sm text-gray-300">{selectedCamera?.location || cameras[0].location}</p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(selectedCamera?.status || cameras[0].status)}`}
                  >
                    {getStatusIcon(selectedCamera?.status || cameras[0].status)}
                    {selectedCamera?.status || cameras[0].status}
                  </span>
                  <Button variant="secondary" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-2 grid-cols-6 lg:grid-cols-8 xl:grid-cols-12">
            {cameras.map((camera) => (
              <button
                key={camera.id}
                onClick={() => setSelectedCamera(camera)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  selectedCamera?.id === camera.id ? "border-primary" : "border-transparent hover:border-border"
                }`}
              >
                <img
                  src={camera.streamUrl || "/placeholder.svg"}
                  alt={camera.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{camera.id}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
