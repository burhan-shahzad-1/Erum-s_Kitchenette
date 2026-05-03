import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Menu } from "./components/Menu";
import { About } from "./components/About";
import { Cart } from "./components/Cart";
import { Profile } from "./components/Profile";
import { Checkout } from "./components/Checkout";
import { ProductDetail } from "./components/ProductDetail";
import { FAQs } from "./components/FAQs";
import { DeliveryInfo } from "./components/DeliveryInfo";
import { Terms } from "./components/Terms";
import { Privacy } from "./components/Privacy";
import { OrderTracking } from "./components/OrderTracking";
import { NotFound } from "./components/NotFound";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { ProductsPage } from "./components/admin/ProductsPage";
import { OrdersPage } from "./components/admin/OrdersPage";
import { CustomersPage } from "./components/admin/CustomersPage";
import { ReportsPage } from "./components/admin/ReportsPage";
import { DeliveryPage } from "./components/admin/DeliveryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "menu", Component: Menu },
      { path: "product/:id", Component: ProductDetail },
      { path: "about", Component: About },
      { path: "cart", Component: Cart },
      { path: "profile", Component: Profile },
      { path: "checkout", Component: Checkout },
      { path: "order-tracking/:orderId", Component: OrderTracking },
      { path: "faqs", Component: FAQs },
      { path: "delivery", Component: DeliveryInfo },
      { path: "terms", Component: Terms },
      { path: "privacy", Component: Privacy },
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignupPage },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "products", Component: ProductsPage },
      { path: "orders", Component: OrdersPage },
      { path: "customers", Component: CustomersPage },
      { path: "reports", Component: ReportsPage },
      { path: "delivery", Component: DeliveryPage },
    ],
  },
]);