import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlaneTakeoff } from "lucide-react";
import { userLoginSchema, userRegisterSchema } from "@shared/schema";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();

  // If the user is already logged in, redirect to the dashboard
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Auth forms */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <PlaneTakeoff className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">CareerNest</h1>
          </div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onSuccess={() => {}} isPending={loginMutation.isPending} onSubmit={loginMutation.mutate} />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm onSuccess={() => setActiveTab("login")} isPending={registerMutation.isPending} onSubmit={registerMutation.mutate} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-primary text-white p-12">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-6">Advance Your Career Journey</h2>
          <p className="text-lg mb-8">
            CareerNest helps you discover career paths, connect with mentors, assess your skills, and learn at your own pace.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
              <span className="material-icons text-3xl mb-2">work</span>
              <h3 className="font-medium">Career Paths</h3>
              <p className="text-sm text-center mt-1">Explore personalized career options</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
              <span className="material-icons text-3xl mb-2">person</span>
              <h3 className="font-medium">Mentorship</h3>
              <p className="text-sm text-center mt-1">Connect with industry professionals</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
              <span className="material-icons text-3xl mb-2">quiz</span>
              <h3 className="font-medium">Assessments</h3>
              <p className="text-sm text-center mt-1">Evaluate your skills and strengths</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
              <span className="material-icons text-3xl mb-2">school</span>
              <h3 className="font-medium">Learning</h3>
              <p className="text-sm text-center mt-1">Access tailored learning modules</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type LoginFormProps = {
  onSubmit: (data: z.infer<typeof userLoginSchema>) => void;
  isPending: boolean;
  onSuccess: () => void;
};

function LoginForm({ onSubmit, isPending }: LoginFormProps) {
  const form = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleSubmit(data: z.infer<typeof userLoginSchema>) {
    onSubmit(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Login to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

type RegisterFormProps = {
  onSubmit: (data: z.infer<typeof userRegisterSchema>) => void;
  isPending: boolean;
  onSuccess: () => void;
};

function RegisterForm({ onSubmit, isPending }: RegisterFormProps) {
  const form = useForm<z.infer<typeof userRegisterSchema>>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function handleSubmit(data: z.infer<typeof userRegisterSchema>) {
    onSubmit(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Register to start your career journey</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
