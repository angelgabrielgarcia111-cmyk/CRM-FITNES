import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import RoleRoute from "@/components/RoleRoute";
import AuthRedirect from "@/components/AuthRedirect";
import AdminGuard from "@/components/AdminGuard";
import StudentGate from "@/components/StudentGate";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import CompleteSignup from "./pages/CompleteSignup";
import StudentComplete from "./pages/StudentComplete";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/" element={<AuthRedirect />} />
            <Route path="/dashboard" element={<RoleRoute allowedRole="trainer"><Index /></RoleRoute>} />
            <Route path="/student" element={<StudentGate><StudentDashboard /></StudentGate>} />
            <Route path="/student/complete-signup" element={<CompleteSignup />} />
            <Route path="/student/complete" element={<StudentComplete />} />
            <Route path="/admin" element={<AdminGuard><AdminPanel /></AdminGuard>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
