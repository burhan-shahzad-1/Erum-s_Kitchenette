import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';

export function Root() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/50 to-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
