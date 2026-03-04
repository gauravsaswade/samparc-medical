import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Medicines from './pages/Medicines';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerSignup from './pages/customer/CustomerSignup';
import SellerLogin from './pages/seller/SellerLogin';
import SellerSignup from './pages/seller/SellerSignup';
import SellerDashboard from './pages/seller/SellerDashboard';
import { useSeedAdminSeller } from './hooks/useSeedAdminSeller';

function RootComponent() {
  useSeedAdminSeller();
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public-layout',
  component: Layout,
});

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: Home,
});

const aboutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/about',
  component: About,
});

const servicesRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/services',
  component: Services,
});

const medicinesRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/medicines',
  component: Medicines,
});

const contactRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/contact',
  component: Contact,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLogin,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  beforeLoad: () => {
    const isAuth = localStorage.getItem('samparc_admin_auth') === 'true';
    if (!isAuth) {
      throw redirect({ to: '/admin' });
    }
  },
  component: Dashboard,
});

// Customer auth routes (standalone, no layout)
const customerLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/login',
  component: CustomerLogin,
});

const customerSignupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer/signup',
  component: CustomerSignup,
});

// Seller auth routes (standalone, no layout)
const sellerLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller/login',
  component: SellerLogin,
});

const sellerSignupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller/signup',
  component: SellerSignup,
});

const sellerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller/dashboard',
  beforeLoad: () => {
    const sellerRaw = localStorage.getItem('samparc_seller');
    if (!sellerRaw) {
      throw redirect({ to: '/seller/login' });
    }
  },
  component: SellerDashboard,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    homeRoute,
    aboutRoute,
    servicesRoute,
    medicinesRoute,
    contactRoute,
  ]),
  adminLoginRoute,
  adminDashboardRoute,
  customerLoginRoute,
  customerSignupRoute,
  sellerLoginRoute,
  sellerSignupRoute,
  sellerDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
