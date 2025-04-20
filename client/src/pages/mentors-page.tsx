import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Mentor } from "@shared/schema";
import Sidebar from "@/components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Star, Calendar, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MentorsPage() {
  const [search, setSearch] = useState("");
  const { data: mentors, isLoading, error } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
    queryFn: getQueryFn({}),
  });

  const filteredMentors = mentors?.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(search.toLowerCase()) ||
      mentor.title.toLowerCase().includes(search.toLowerCase()) ||
      mentor.company.toLowerCase().includes(search.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(search.toLowerCase()) ||
      mentor.expertise.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mentorship</h1>
              <p className="text-muted-foreground mt-1">
                Connect with experienced mentors in your field of interest
              </p>
            </div>
            <div className="relative mt-4 sm:mt-0 w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search mentors..."
                className="pl-8 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Mentors</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="sessions">My Sessions</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-[380px]">
                      <CardHeader className="pb-3 flex flex-row items-center space-x-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-[150px]" />
                          <Skeleton className="h-4 w-[120px]" />
                        </div>
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
                    <p className="text-muted-foreground">Error loading mentors: {error.message}</p>
                  </CardContent>
                </Card>
              ) : filteredMentors?.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No mentors found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMentors?.map((mentor) => (
                    <Card key={mentor.id} className="flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={mentor.profilePicture || ""} alt={mentor.name} />
                            <AvatarFallback>
                              {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">{mentor.name}</CardTitle>
                            <CardDescription className="flex items-center">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {mentor.title} at {mentor.company}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-0 flex-grow">
                        <p className="text-sm text-muted-foreground mb-4">
                          {mentor.bio}
                        </p>
                        <div className="flex items-center mb-2 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 mr-1 text-amber-500" />
                          <span>{mentor.rating || 'No ratings yet'}</span>
                          <span className="mx-2">•</span>
                          <span>{mentor.yearsOfExperience} years exp.</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {mentor.expertise.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                          {mentor.expertise.length > 3 && (
                            <Badge variant="outline">+{mentor.expertise.length - 3} more</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-3">
                        <Button className="w-full">Schedule Session</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="recommended" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Recommended mentors feature coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sessions" className="mt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Your scheduled mentorship sessions will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}