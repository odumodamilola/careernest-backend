import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Users, 
  BarChart2, 
  MessageSquare, 
  FileText, 
  Book, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

export default function Sidebar() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems: NavItem[] = [
    { title: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
    { title: 'Users', icon: <Users className="w-5 h-5" />, path: '/users' },
    { title: 'Career Paths', icon: <BarChart2 className="w-5 h-5" />, path: '/careers' },
    { title: 'Mentorship', icon: <MessageSquare className="w-5 h-5" />, path: '/mentors' },
    { title: 'Assessments', icon: <FileText className="w-5 h-5" />, path: '/assessments' },
    { title: 'Learning Modules', icon: <Book className="w-5 h-5" />, path: '/modules' },
    { title: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/auth');
  };

  const NavLinks = () => (
    <>
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2 text-foreground/80">Menu</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.title}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
                setMobileNavOpen(false);
              }}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                location === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="pt-4 mt-auto">
        <Button
          variant="ghost"
          className="w-full flex justify-start px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-foreground"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign out
          {logoutMutation.isPending && <span className="animate-pulse ml-2">...</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Nav Trigger */}
      <div className="flex items-center p-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="ml-4">
          <h1 className="text-xl font-bold">CareerNest</h1>
        </div>
      </div>

      {/* Mobile Nav */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-[280px] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">CareerNest</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {user && (
            <div className="flex items-center mb-6">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.profilePicture} alt={user.username} />
                <AvatarFallback>
                  {user.firstName && user.lastName 
                    ? `${user.firstName[0]}${user.lastName[0]}`
                    : user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col justify-between">
            <NavLinks />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col w-64 bg-background border-r p-6 h-screen sticky top-0">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold">CareerNest</h1>
        </div>

        {user && (
          <div className="flex items-center mb-8">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profilePicture} alt={user.username} />
              <AvatarFallback>
                {user.firstName && user.lastName 
                  ? `${user.firstName[0]}${user.lastName[0]}`
                  : user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.username}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between">
          <NavLinks />
        </div>
      </div>
    </>
  );
}
