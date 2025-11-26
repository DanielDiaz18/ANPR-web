import { DashboardLayout } from "@/components/dashboard-layout";
import { CameraMonitoring } from "@/components/camera-monitoring";
import { AuthGuard } from "@/components/auth-guard";

export default function CamerasPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CameraMonitoring />
      </DashboardLayout>
    </AuthGuard>
  );
}
