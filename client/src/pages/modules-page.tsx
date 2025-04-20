import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Module } from "@shared/schema";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Clock, BookOpen, CheckCircle, Video, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ModulesPage() {
  const [search, setSearch] = useState("");
  const { data: modules, isLoading, error } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
    queryFn: getQueryFn({}),
  });

  const filteredModules = modules?.filter(
    (module) =>
      module.title.toLowerCase().includes(search.toLowerCase()) ||
      module.description.toLowerCase().includes(search.toLowerCase()) ||
      (module.category && module.category.toLowerCase().includes(search.toLowerCase()))
  );

  // Function to determine the module icon
  const getModuleIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'reading':
        return <BookOpen className="h-5 w-5" />;
      case 'quiz':
        return <FileText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Learning Modules</h1>
              <p className="text-muted-foreground mt-1">
                Access educational content and track your progress
              </p>
            </div>
            <div className="relative mt-4 sm:mt-0 w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search modules..."
                className="pl-8 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Modules</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-[320px]">
                      <CardHeader className="pb-3">
                        <Skeleton className="h-6 w-[180px] mb-2" />
                        <Skeleton className="h-4 w-[150px]" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Error loading modules: {error.message}</p>
                  </CardContent>
                </Card>
              ) : filteredModules?.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No modules found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredModules?.map((module) => (
                    <Card key={module.id} className="flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getModuleIcon(module.type)}
                            <CardTitle>{module.title}</CardTitle>
                          </div>
                          {module.isCompleted && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <CardDescription className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {module.duration} minutes
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-0 flex-grow">
                        <p className="text-sm text-muted-foreground mb-4">
                          {module.description}
                        </p>
                        <div className="mt-4 space-y-2">
                          {module.category && (
                            <Badge variant="outline">{module.category}</Badge>
                          )}
                          {module.progress !== undefined && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Progress</span>
                                <span>{module.progress}%</span>
                              </div>
                              <Progress value={module.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-3">
                        <Button className="w-full">
                          {module.progress ? 'Continue' : 'Start'} Module
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="in-progress" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Your in-progress modules will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Your completed modules will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}