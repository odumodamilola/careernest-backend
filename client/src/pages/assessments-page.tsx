import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Assessment } from "@shared/schema";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Clock, BarChart, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function AssessmentsPage() {
  const [search, setSearch] = useState("");
  const { data: assessments, isLoading, error } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
    queryFn: getQueryFn({}),
  });

  const filteredAssessments = assessments?.filter(
    (assessment) =>
      assessment.title.toLowerCase().includes(search.toLowerCase()) ||
      assessment.description.toLowerCase().includes(search.toLowerCase()) ||
      (assessment.category && assessment.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
              <p className="text-muted-foreground mt-1">
                Take assessments to evaluate your skills and knowledge
              </p>
            </div>
            <div className="relative mt-4 sm:mt-0 w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assessments..."
                className="pl-8 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="available">
            <TabsList>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            </TabsList>
            <TabsContent value="available" className="mt-6">
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
                    <p className="text-muted-foreground">Error loading assessments: {error.message}</p>
                  </CardContent>
                </Card>
              ) : filteredAssessments?.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No assessments found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAssessments?.map((assessment) => (
                    <Card key={assessment.id} className="flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-1">
                          <CardTitle>{assessment.title}</CardTitle>
                          <Badge variant={
                            assessment.difficulty === 'beginner' ? 'secondary' : 
                            assessment.difficulty === 'intermediate' ? 'outline' : 'destructive'
                          }>
                            {assessment.difficulty}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {assessment.questions.length} questions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-0 flex-grow">
                        <p className="text-sm text-muted-foreground mb-4">
                          {assessment.description}
                        </p>
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{assessment.timeLimit} mins</span>
                          </div>
                          {assessment.category && (
                            <Badge variant="outline">{assessment.category}</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-3">
                        <Button className="w-full">Start Assessment</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Your completed assessments will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="in-progress" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Your in-progress assessments will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}