import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen container text-center">
      <div className="glass-panel p-6 max-w-3xl w-full">
        <h1 className="text-4xl mb-4" style={{ color: 'var(--primary)' }}>Onsite Teams ERP</h1>
        <p className="text-lg text-muted mb-6">
          Premium Construction Management & ERP Replica. Manage your projects, inventory, and labor with real-time insights.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="/login">
            <Button variant="primary">Login / Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">View Dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
