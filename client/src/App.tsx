import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import UsersPage from "@/pages/users-page";
import CareersPage from "@/pages/careers-page";
import MentorsPage from "@/pages/mentors-page";
import AssessmentsPage from "@/pages/assessments-page";
import ModulesPage from "@/pages/modules-page";
import SettingsPage from "@/pages/settings-page";

function Router() {
  return (
    <Switch>
      {/* Protected Routes */}
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/users" component={UsersPage} />
      <ProtectedRoute path="/careers" component={CareersPage} />
      <ProtectedRoute path="/mentors" component={MentorsPage} />
      <ProtectedRoute path="/assessments" component={AssessmentsPage} />
      <ProtectedRoute path="/modules" component={ModulesPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      
      {/* Public Routes */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
