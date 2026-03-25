import { Outlet, Navigate } from 'react-router';
import { AdminSidebar } from './AdminSidebar';
import { useAdmin } from '../../context/AdminContext';

export function AdminLayout() {
  const { isAdminAuthenticated } = useAdmin();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
