import Navigation from '@/components/Navigation';
import CartSidebar from '@/components/CartSidebar';
import Notification from '@/components/Notification';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--fut-bg-dark)]">
      <Navigation />
      <main>{children}</main>
      <CartSidebar />
      <Notification />
    </div>
  );
}
