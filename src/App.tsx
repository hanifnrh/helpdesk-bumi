// App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { PrivateRoute } from "./components/PrivateRoute";
import './index.css';
import { EditProfilePage } from "./pages/EditProfile";
import FAQ from "./pages/FAQ";
import { Index } from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Page";
import { EnterToken } from "./pages/auth/EnterToken";
import { EnterTokenSignUp } from "./pages/auth/EnterTokenSignUp";
import { HandleReset } from "./pages/auth/HandleReset";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { ResetPasswordSignUp } from "./pages/auth/ResetPasswordSignUp";
import UserDashboard from "./pages/user/Page";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/FAQ" element={<FAQ />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/editprofile" element={<EditProfilePage />} />
            </Route>

            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/enter-token" element={<EnterToken />} />
            <Route path="/auth/reset-password-sign-up" element={<ResetPasswordSignUp />} />
            <Route path="/auth/enter-token-sign-up" element={<EnterTokenSignUp />} />
            <Route path="/auth/handle-reset" element={<HandleReset />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
