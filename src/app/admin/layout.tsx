import Navigation from '@/components/Navigation';
import Notification from '@/components/Notification';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--fut-bg-dark)]">
      <Navigation isAdmin />
      <main>{children}</main>
      <Notification />
    </div>
  );
}
