import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Career, Mentor, Assessment, Module } from "@shared/schema";
import { Loader2, PlaneTakeoff, LogOut, Users, Briefcase, User2, BookOpen, School } from "lucide-react";

export default function DashboardPage() {
  const { user, logoutMutation } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const { data: careers, isLoading: careersLoading } = useQuery<Career[]>({
    queryKey: ['/api/careers'],
  });

  const { data: mentors, isLoading: mentorsLoading } = useQuery<Mentor[]>({
    queryKey: ['/api/mentors'],
  });

  const { data: assessments, isLoading: assessmentsLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });

  const { data: modules, isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: ['/api/modules'],
  });

  const isDataLoading = careersLoading || mentorsLoading || assessmentsLoading || modulesLoading;

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white flex flex-col">
        <div className="p-4 flex items-center justify-between md:justify-center border-b border-primary-dark">
          <div className="flex items-center space-x-2">
            <PlaneTakeoff className="h-5 w-5" />
            <h1 className="text-xl font-medium">CareerNest</h1>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
            className="md:hidden"
          >
            <span className="material-icons">menu</span>
          </button>
        </div>
        
        <nav 
          className={`${isMobileSidebarOpen ? 'block' : 'hidden'} md:block py-4 flex-grow`}
        >
          <div className="px-4 pb-2 text-primary-light text-sm font-medium">MAIN MENU</div>
          <a 
            href="#" 
            onClick={() => setCurrentPage("Dashboard")}
            className={`flex items-center px-4 py-3 text-white ${currentPage === "Dashboard" ? "bg-primary-dark" : "hover:bg-primary-dark"}`}
          >
            <span className="material-icons mr-3">dashboard</span>
            Dashboard
          </a>
          <a 
            href="#" 
            onClick={() => setCurrentPage("Users")}
            className={`flex items-center px-4 py-3 text-white ${currentPage === "Users" ? "bg-primary-dark" : "hover:bg-primary-dark"}`}
          >
            <Users className="h-5 w-5 mr-3" />
            Users
          </a>
          <a 
            href="#" 
            onClick={() => setCurrentPage("Career Paths")}
            className={`flex items-center px-4 py-3 text-white ${currentPage === "Career Paths" ? "bg-primary-dark" : "hover:bg-primary-dark"}`}
          >
            <Briefcase className="h-5 w-5 mr-3" />
            Career Paths
          </a>
          <a 
            href="#" 
            onClick={() => setCurrentPage("Mentors")}
            className={`flex items-center px-4 py-3 text-white ${currentPage === "Mentors" ? "bg-primary-dark" : "hover:bg-primary-dark"}`}
          >
            <User2 className="h-5 w-5 mr-3" />
            Mentors
          </a>
          <a 
            href="#" 
            onClick={() => setCurrentPage("Assessments")}
            className={`flex items-center px-4 py-3 text-white ${currentPage === "Assessments" ? "bg-primary-dark" : "hover:bg-primary-dark"}`}
          >
            <BookOpen className="h-5 w-5 mr-3" />
            Assessments
          </a>
          <a 
            href="#" 
            onClick={() => setCurrentPage("Learning Modules")}
            className={`flex items-center px-4 py-3 text-white ${currentPage === "Learning Modules" ? "bg-primary-dark" : "hover:bg-primary-dark"}`}
          >
            <School className="h-5 w-5 mr-3" />
            Learning Modules
          </a>

          <div className="px-4 py-2 mt-6 text-primary-light text-sm font-medium">SETTINGS</div>
          <a href="#" className="flex items-center px-4 py-3 text-white hover:bg-primary-dark">
            <span className="material-icons mr-3">settings</span>
            API Settings
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-white hover:bg-primary-dark">
            <span className="material-icons mr-3">error</span>
            Error Logs
          </a>
        </nav>
        
        <div className="p-4 border-t border-primary-dark">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center mr-2">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-primary-light">Admin</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto text-white"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-xl font-medium">{currentPage}</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name || 'User'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="rounded-full w-10 h-10 bg-gray-100 flex items-center justify-center">
                <span className="material-icons text-gray-600">notifications</span>
              </button>
              <button className="rounded-full w-10 h-10 bg-gray-100 flex items-center justify-center">
                <span className="material-icons text-gray-600">help</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {isDataLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard 
                  title="Total Users" 
                  value={user ? "1" : "0"} 
                  change="+0%" 
                  icon={<Users className="h-5 w-5" />} 
                  iconBgColor="bg-primary-light bg-opacity-20" 
                  iconColor="text-primary" 
                />
                <StatCard 
                  title="Career Paths" 
                  value={careers?.length.toString() || "0"} 
                  change="+0%" 
                  icon={<Briefcase className="h-5 w-5" />} 
                  iconBgColor="bg-blue-100" 
                  iconColor="text-blue-500" 
                />
                <StatCard 
                  title="Active Mentors" 
                  value={mentors?.length.toString() || "0"} 
                  change="+0%" 
                  icon={<User2 className="h-5 w-5" />} 
                  iconBgColor="bg-purple-100" 
                  iconColor="text-purple-500" 
                />
                <StatCard 
                  title="Learning Modules" 
                  value={modules?.length.toString() || "0"} 
                  change="+0%" 
                  icon={<School className="h-5 w-5" />} 
                  iconBgColor="bg-green-100" 
                  iconColor="text-green-500" 
                />
              </div>

              {/* API Endpoints Section */}
              <Card className="mb-6">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium">API Endpoints Status</h2>
                  <p className="text-sm text-gray-500">Overview of your RESTful API endpoints</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Endpoint Group
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Base Path
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Methods
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <ApiEndpointRow 
                        name="User Authentication" 
                        path="/api/auth/*" 
                        status="Operational" 
                        icon={<Users className="h-4 w-4" />}
                        iconBgColor="bg-primary bg-opacity-10"
                        iconColor="text-primary"
                        methods="POST, GET"
                      />
                      <ApiEndpointRow 
                        name="Career Paths" 
                        path="/api/careers/*" 
                        status="Operational" 
                        icon={<Briefcase className="h-4 w-4" />}
                        iconBgColor="bg-blue-100"
                        iconColor="text-blue-500"
                        methods="GET, POST"
                      />
                      <ApiEndpointRow 
                        name="Mentorship" 
                        path="/api/mentors/*" 
                        status="Operational" 
                        icon={<User2 className="h-4 w-4" />}
                        iconBgColor="bg-purple-100"
                        iconColor="text-purple-500"
                        methods="GET, POST"
                      />
                      <ApiEndpointRow 
                        name="Assessments" 
                        path="/api/assessments/*" 
                        status="Operational" 
                        icon={<BookOpen className="h-4 w-4" />}
                        iconBgColor="bg-yellow-100"
                        iconColor="text-yellow-500"
                        methods="GET, POST"
                      />
                      <ApiEndpointRow 
                        name="Learning Modules" 
                        path="/api/modules/*" 
                        status="Operational" 
                        icon={<School className="h-4 w-4" />}
                        iconBgColor="bg-green-100"
                        iconColor="text-green-500"
                        methods="GET, POST"
                      />
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
};

function StatCard({ title, value, change, icon, iconBgColor, iconColor }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-green-500 flex items-center text-sm">
            <span className="material-icons text-sm">arrow_upward</span>
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-2">Since last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

type ApiEndpointRowProps = {
  name: string;
  path: string;
  status: "Operational" | "Degraded" | "Down";
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  methods: string;
};

function ApiEndpointRow({ name, path, status, icon, iconBgColor, iconColor, methods }: ApiEndpointRowProps) {
  let statusClass = "bg-green-100 text-green-800";
  if (status === "Degraded") statusClass = "bg-yellow-100 text-yellow-800";
  if (status === "Down") statusClass = "bg-red-100 text-red-800";
  
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-8 w-8 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
            {icon}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{name}</div>
            <div className="text-xs text-gray-500">{path}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {path}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {methods}
      </td>
    </tr>
  );
}
