import { DashboardLayout } from "@/components/dashboard-layout";
import { ClientManagement } from "@/components/client-management";
import { AuthGuard } from "@/components/auth-guard";

export default function ClientsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ClientManagement />
      </DashboardLayout>
    </AuthGuard>
  );
}
