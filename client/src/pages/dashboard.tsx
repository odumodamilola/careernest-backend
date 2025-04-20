import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import { ApiStatus } from "@/components/api-status";
import { RequestLogs } from "@/components/request-logs";
import { StatusCard } from "@/components/status-card";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  CheckCircle, 
  MessageSquare, 
  BookOpen 
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Notification button */}
                  <button className="p-1 bg-white text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                  </button>

                  {/* Profile dropdown */}
                  <div className="ml-3 relative">
                    <div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profilePicture} alt={user?.username} />
                        <AvatarFallback>
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName[0]}${user.lastName[0]}`
                            : user?.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatusCard
                title="Total Users"
                value="2,651"
                icon={<Users className="h-6 w-6" />}
                change={{ value: 12, isPositive: true }}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
              
              <StatusCard
                title="Assessment Completions"
                value="897"
                icon={<CheckCircle className="h-6 w-6" />}
                change={{ value: 8, isPositive: true }}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
              />
              
              <StatusCard
                title="Mentorship Sessions"
                value="453"
                icon={<MessageSquare className="h-6 w-6" />}
                change={{ value: 5, isPositive: true }}
                iconBgColor="bg-indigo-100"
                iconColor="text-indigo-600"
              />
              
              <StatusCard
                title="Module Completions"
                value="1,254"
                icon={<BookOpen className="h-6 w-6" />}
                change={{ value: 3, isPositive: false }}
                iconBgColor="bg-amber-100"
                iconColor="text-amber-600"
              />
            </div>

            {/* API Status */}
            <div className="mb-8">
              <ApiStatus />
            </div>

            {/* API Request Logs */}
            <div className="mb-8">
              <RequestLogs />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
