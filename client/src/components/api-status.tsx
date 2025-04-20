import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Shield, 
  BarChart, 
  MessageSquare, 
  FileText,
  Book,
  XCircle
} from "lucide-react";

type StatusType = "Operational" | "Degraded" | "Down";
type EndpointCategory = "Authentication" | "Career Paths" | "Mentorship" | "Assessments" | "Learning Modules";

interface ApiEndpoint {
  name: string;
  status: StatusType;
  isActive: boolean;
  category: EndpointCategory;
  lastUpdated: string;
}

export function ApiStatus() {
  const endpoints: ApiEndpoint[] = [
    {
      name: "POST /api/auth/register",
      status: "Operational",
      isActive: true,
      category: "Authentication",
      lastUpdated: "4h ago"
    },
    {
      name: "POST /api/auth/login",
      status: "Operational",
      isActive: true,
      category: "Authentication",
      lastUpdated: "2h ago"
    },
    {
      name: "GET /api/careers",
      status: "Operational",
      isActive: true,
      category: "Career Paths",
      lastUpdated: "1h ago"
    },
    {
      name: "GET /api/mentors",
      status: "Degraded",
      isActive: true,
      category: "Mentorship",
      lastUpdated: "30min ago"
    },
    {
      name: "GET /api/assessments",
      status: "Operational",
      isActive: true,
      category: "Assessments",
      lastUpdated: "45min ago"
    },
    {
      name: "GET /api/modules",
      status: "Down",
      isActive: true,
      category: "Learning Modules",
      lastUpdated: "15min ago"
    }
  ];

  const getStatusBadgeVariant = (status: StatusType) => {
    switch (status) {
      case "Operational": return "outline";
      case "Degraded": return "warning";
      case "Down": return "destructive";
      default: return "outline";
    }
  };

  const getStatusBadgeText = (status: StatusType) => {
    return status;
  };

  const getActiveBadgeVariant = (isActive: boolean) => {
    return isActive ? "success" : "secondary";
  };

  const getActiveBadgeText = (isActive: boolean) => {
    return isActive ? "Active" : "Inactive";
  };

  const getCategoryIcon = (category: EndpointCategory) => {
    switch (category) {
      case "Authentication": return <Shield className="flex-shrink-0 mr-1.5 h-5 w-5 text-muted-foreground" />;
      case "Career Paths": return <BarChart className="flex-shrink-0 mr-1.5 h-5 w-5 text-muted-foreground" />;
      case "Mentorship": return <MessageSquare className="flex-shrink-0 mr-1.5 h-5 w-5 text-muted-foreground" />;
      case "Assessments": return <FileText className="flex-shrink-0 mr-1.5 h-5 w-5 text-muted-foreground" />;
      case "Learning Modules": return <Book className="flex-shrink-0 mr-1.5 h-5 w-5 text-muted-foreground" />;
      default: return null;
    }
  };

  const operationalCount = endpoints.filter(e => e.status === "Operational").length;
  const degradedCount = endpoints.filter(e => e.status === "Degraded").length;
  const downCount = endpoints.filter(e => e.status === "Down").length;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">API Endpoints Status</h2>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {endpoints.map((endpoint, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-primary truncate">{endpoint.name}</p>
                    <Badge variant={getActiveBadgeVariant(endpoint.isActive)}>
                      {getActiveBadgeText(endpoint.isActive)}
                    </Badge>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <Badge variant={getStatusBadgeVariant(endpoint.status)}>
                      {getStatusBadgeText(endpoint.status)}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-muted-foreground">
                      {getCategoryIcon(endpoint.category)}
                      {endpoint.category}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground sm:mt-0">
                    <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-muted-foreground" />
                    <p>Last updated {endpoint.lastUpdated}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">API Status Summary</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Operational Services</p>
                <p className="text-3xl font-bold">{operationalCount}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-amber-100 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Degraded Services</p>
                <p className="text-3xl font-bold">{degradedCount}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-red-100 rounded-full p-3">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Services Down</p>
                <p className="text-3xl font-bold">{downCount}</p>
              </div>
            </div>
          </div>

          {(degradedCount > 0 || downCount > 0) && (
            <div className="mt-6 bg-muted rounded-md p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-foreground">Ongoing Issue</h3>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>We're currently experiencing issues with the Learning Modules API. Our team is working to resolve this as quickly as possible.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
