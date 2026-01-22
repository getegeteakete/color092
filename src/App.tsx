import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import Index from "./pages/Index";
import Works from "./pages/Works";
import Service from "./pages/Service";
import News from "./pages/News";
import Insurance from "./pages/Insurance";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import Estimate from "./pages/Estimate";
import Reservation from "./pages/Reservation";
import LpAiEstimate from "./pages/LpAiEstimate";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ページ遷移時にトップにスクロール
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => (
  <>
    <ScrollToTopOnRouteChange />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/works" element={<Works />} />
      <Route path="/service" element={<Service />} />
      <Route path="/news" element={<News />} />
      <Route path="/insurance" element={<Insurance />} />
      <Route path="/company" element={<Company />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/estimate" element={<Estimate />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/lp/ai-estimate" element={<LpAiEstimate />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    <ScrollToTop />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
