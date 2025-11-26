import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardOverview } from "@/components/dashboard-overview";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    </AuthGuard>
  );
}
