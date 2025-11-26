import { DashboardLayout } from "@/components/dashboard-layout";
import { VehicleManagement } from "@/components/vehicle-management";
import { AuthGuard } from "@/components/auth-guard";

export default function VehiclesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <VehicleManagement />
      </DashboardLayout>
    </AuthGuard>
  );
}
