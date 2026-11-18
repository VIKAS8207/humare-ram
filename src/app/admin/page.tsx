import AdminGate from "@/components/admin/admin-gate";
import Dashboard from "@/components/admin/dashboard";
import { getAdminName } from "@/lib/admin-auth";

export default function AdminPage() {
  return (
    <AdminGate>
      <Dashboard adminName={getAdminName()} />
    </AdminGate>
  );
}
