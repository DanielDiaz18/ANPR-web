import { DashboardLayout } from "@/components/dashboard-layout"
import { ClientManagement } from "@/components/client-management"

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <ClientManagement />
    </DashboardLayout>
  )
}
