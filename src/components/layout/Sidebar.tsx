import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BarChart3, 
  Wallet,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <Card className={cn(
      "glass-card h-screen transition-smooth border-r border-card-border",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo & Collapse Button */}
        <div className="p-4 border-b border-card-border">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <Wallet className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">FinanceTracker</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="transition-smooth hover:bg-accent"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-smooth",
                "hover:bg-accent",
                isActive(item.href) 
                  ? "bg-primary text-primary-foreground" 
                  : "text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                !collapsed && "mr-3"
              )} />
              {!collapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-card-border">
            <div className="text-xs text-muted-foreground text-center">
              © 2024 FinanceTracker
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};