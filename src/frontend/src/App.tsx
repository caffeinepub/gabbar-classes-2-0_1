import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import AboutPage from "@/pages/AboutPage";
import AdminInquiriesPage from "@/pages/AdminInquiriesPage";
import AdminPage from "@/pages/AdminPage";
import BatchesPage from "@/pages/BatchesPage";
import ClassPage from "@/pages/ClassPage";
import ContactPage from "@/pages/ContactPage";
import FacultyPage from "@/pages/FacultyPage";
import GalleryPage from "@/pages/GalleryPage";
import HomePage from "@/pages/HomePage";
import LibraryPage from "@/pages/LibraryPage";
import LoginPage from "@/pages/LoginPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root layout
function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.15 0 0)",
            border: "1px solid oklch(0.862 0.196 91.7 / 0.4)",
            color: "oklch(0.95 0 0)",
          },
        }}
      />
    </div>
  );
}

// Routes
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const facultyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faculty",
  component: FacultyPage,
});

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/library",
  component: LibraryPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: GalleryPage,
});

const batchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/batches",
  component: BatchesPage,
});

const classRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/classes/$classLevel",
  component: ClassPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const adminInquiriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/inquiries",
  component: AdminInquiriesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  facultyRoute,
  libraryRoute,
  galleryRoute,
  batchesRoute,
  classRoute,
  contactRoute,
  loginRoute,
  adminRoute,
  adminInquiriesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
