import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Career } from "@shared/schema";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, DollarSign, Bookmark, BookmarkPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CareersPage() {
  const [search, setSearch] = useState("");
  const { data: careers, isLoading, error } = useQuery<Career[]>({
    queryKey: ["/api/careers"],
    queryFn: getQueryFn({}),
  });

  const filteredCareers = careers?.filter(
    (career) =>
      career.title.toLowerCase().includes(search.toLowerCase()) ||
      career.description.toLowerCase().includes(search.toLowerCase()) ||
      career.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
  );

  // Format salary range with proper currency
  const formatSalary = (min: number, max: number, currency: string = "USD") => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    });
    
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Career Paths</h1>
              <p className="text-muted-foreground mt-1">
                Explore different career paths in the tech industry
              </p>
            </div>
            <div className="relative mt-4 sm:mt-0 w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search careers..."
                className="pl-8 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Careers</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
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
                          <Skeleton className="h-6 w-14" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Error loading careers: {error.message}</p>
                  </CardContent>
                </Card>
              ) : filteredCareers?.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No careers found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCareers?.map((career) => (
                    <Card key={career.id} className="flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle>{career.title}</CardTitle>
                          <Button variant="ghost" size="icon" title="Bookmark">
                            <BookmarkPlus className="h-5 w-5" />
                          </Button>
                        </div>
                        <CardDescription className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatSalary(career.salaryMin, career.salaryMax, career.salaryCurrency)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-0 flex-grow">
                        <p className="text-sm text-muted-foreground mb-4">
                          {career.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {career.skills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                          {career.skills.length > 5 && (
                            <Badge variant="outline">+{career.skills.length - 5} more</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-3">
                        <div className="w-full flex justify-between text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>Growth: {career.growthRate}%</span>
                          </div>
                          <div className="text-muted-foreground">Demand: {career.demand}</div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="trending" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Trending careers feature coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bookmarked" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Your bookmarked careers will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}