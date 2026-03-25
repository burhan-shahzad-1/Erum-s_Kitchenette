import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <FavoritesProvider>
              <RouterProvider router={router} />
              <Toaster />
            </FavoritesProvider>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;