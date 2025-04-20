import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ApiRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: string;
  responseTime: string;
  timestamp: string;
}

export function RequestLogs() {
  const recentRequests: ApiRequest[] = [
    {
      endpoint: '/api/auth/login',
      method: 'POST',
      status: '200 OK',
      responseTime: '125ms',
      timestamp: '2 minutes ago'
    },
    {
      endpoint: '/api/users/profile',
      method: 'GET',
      status: '200 OK',
      responseTime: '87ms',
      timestamp: '2 minutes ago'
    },
    {
      endpoint: '/api/careers/bookmarks',
      method: 'GET',
      status: '200 OK',
      responseTime: '134ms',
      timestamp: '3 minutes ago'
    },
    {
      endpoint: '/api/assessments/results',
      method: 'GET',
      status: '200 OK',
      responseTime: '212ms',
      timestamp: '5 minutes ago'
    },
    {
      endpoint: '/api/modules',
      method: 'GET',
      status: '500 Error',
      responseTime: '1250ms',
      timestamp: '15 minutes ago'
    }
  ];

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-amber-100 text-amber-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    if (status.startsWith('2')) return 'bg-green-100 text-green-800';
    if (status.startsWith('4')) return 'bg-amber-100 text-amber-800';
    if (status.startsWith('5')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-medium">Recent API Requests</h2>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Endpoint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {recentRequests.map((request, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.endpoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMethodBadgeColor(request.method)}`}>
                      {request.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {request.responseTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {request.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
