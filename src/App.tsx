import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import { PaintSystem } from "@/components/ui/PaintSystem";
import { BrandSide } from "@/components/layout/BrandSide";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// 即時ロード（軽量・最初に表示されるページ）
import Index from "./pages/Index";
import Works from "./pages/Works";
import Service from "./pages/Service";
import News from "./pages/News";
import Insurance from "./pages/Insurance";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// 遅延ロード（重い機能ページ）
const Estimate     = lazy(() => import("./pages/Estimate"));
const Reservation  = lazy(() => import("./pages/Reservation"));
const LpAiEstimate = lazy(() => import("./pages/LpAiEstimate"));
const Privacy      = lazy(() => import("./pages/Privacy"));
const Terms        = lazy(() => import("./pages/Terms"));
const WorksDetail  = lazy(() => import("./pages/WorksDetail"));
const NewsDetail   = lazy(() => import("./pages/NewsDetail"));

// 管理画面（遅延ロード）
const AdminLogin     = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminList      = lazy(() => import("./pages/admin/AdminList"));
const AdminDetail    = lazy(() => import("./pages/admin/AdminDetail"));
const AdminWorks     = lazy(() => import("./pages/admin/AdminWorks"));
const AdminWorksEdit = lazy(() => import("./pages/admin/AdminWorksEdit"));
const AdminNews      = lazy(() => import("./pages/admin/AdminNews"));
const AdminNewsEdit  = lazy(() => import("./pages/admin/AdminNewsEdit"));
const AdminReservationSettings = lazy(() => import("./pages/admin/AdminReservationSettings"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <ScrollToTopOnRouteChange />
    <PaintSystem />
    <BrandSide />
    <Routes>
      {/* 公開ページ */}
      <Route path="/"               element={<Index />} />
      <Route path="/works"          element={<Works />} />
      <Route path="/works/:id"      element={<WorksDetail />} />
      <Route path="/service"        element={<Service />} />
      <Route path="/news"           element={<News />} />
      <Route path="/news/:id"       element={<NewsDetail />} />
      <Route path="/insurance"      element={<Insurance />} />
      <Route path="/company"        element={<Company />} />
      <Route path="/contact"        element={<Contact />} />
      <Route path="/estimate"       element={<Estimate />} />
      <Route path="/reservation"    element={<Reservation />} />
      <Route path="/lp/ai-estimate" element={<LpAiEstimate />} />
      <Route path="/privacy"        element={<Privacy />} />
      <Route path="/terms"          element={<Terms />} />

      {/* 管理画面 */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/list"      element={<ProtectedRoute><AdminList /></ProtectedRoute>} />
      <Route path="/admin/detail/:id" element={<ProtectedRoute><AdminDetail /></ProtectedRoute>} />
      <Route path="/admin/works"            element={<ProtectedRoute><AdminWorks /></ProtectedRoute>} />
      <Route path="/admin/works/new"        element={<ProtectedRoute><AdminWorksEdit /></ProtectedRoute>} />
      <Route path="/admin/works/edit/:id"   element={<ProtectedRoute><AdminWorksEdit /></ProtectedRoute>} />
      <Route path="/admin/news"             element={<ProtectedRoute><AdminNews /></ProtectedRoute>} />
      <Route path="/admin/news/new"         element={<ProtectedRoute><AdminNewsEdit /></ProtectedRoute>} />
      <Route path="/admin/news/edit/:id"    element={<ProtectedRoute><AdminNewsEdit /></ProtectedRoute>} />
      <Route path="/admin/reservation-settings" element={<ProtectedRoute><AdminReservationSettings /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
