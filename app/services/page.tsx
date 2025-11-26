import { DashboardLayout } from "@/components/dashboard-layout";
import { ServiceManagement } from "@/components/service-management";
import { AuthGuard } from "@/components/auth-guard";

export default function ServicesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ServiceManagement />
      </DashboardLayout>
    </AuthGuard>
  );
}
