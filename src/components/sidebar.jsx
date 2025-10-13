"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  Ticket,
  MessageCircle,
  History,
  HelpCircle,
  Settings,
  Users,
  BarChart3,
  Sparkles,
  Shield,
  List,
  Activity,
  CreditCard,
  Server,
  ChevronDown,
  ChevronRight,
  Palette,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Theme configurations
const themes = {
  blue: {
    name: "Ocean Blue",
    sidebar: "bg-gradient-to-b from-blue-50 to-blue-100/20",
    border: "border-blue-200/40",
    active: "bg-gradient-to-r from-blue-600/15 to-blue-500/10 text-blue-700 border-blue-200",
    activeIcon: "bg-gradient-to-br from-blue-600 to-blue-700",
    hover: "hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 hover:text-blue-700",
    iconBg: "bg-blue-50 group-hover:bg-blue-100 text-blue-600",
    badge: "from-blue-100 to-blue-200 text-blue-800 border-blue-300",
    accent: "from-blue-600 to-blue-700",
    subMenuBg: "bg-blue-50/50",
  },
  purple: {
    name: "Royal Purple",
    sidebar: "bg-gradient-to-b from-purple-50 to-purple-100/20",
    border: "border-purple-200/40",
    active: "bg-gradient-to-r from-purple-600/15 to-purple-500/10 text-purple-700 border-purple-200",
    activeIcon: "bg-gradient-to-br from-purple-600 to-purple-700",
    hover: "hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 hover:text-purple-700",
    iconBg: "bg-purple-50 group-hover:bg-purple-100 text-purple-600",
    badge: "from-purple-100 to-purple-200 text-purple-800 border-purple-300",
    accent: "from-purple-600 to-purple-700",
    subMenuBg: "bg-purple-50/50",
  },
  emerald: {
    name: "Forest Emerald",
    sidebar: "bg-gradient-to-b from-emerald-50 to-emerald-100/20",
    border: "border-emerald-200/40",
    active: "bg-gradient-to-r from-emerald-600/15 to-emerald-500/10 text-emerald-700 border-emerald-200",
    activeIcon: "bg-gradient-to-br from-emerald-600 to-emerald-700",
    hover: "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100/50 hover:text-emerald-700",
    iconBg: "bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600",
    badge: "from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300",
    accent: "from-emerald-600 to-emerald-700",
    subMenuBg: "bg-emerald-50/50",
  },
  slate: {
    name: "Modern Slate",
    sidebar: "bg-gradient-to-b from-slate-50 to-slate-100/20",
    border: "border-slate-200/40",
    active: "bg-gradient-to-r from-slate-600/15 to-slate-500/10 text-slate-700 border-slate-200",
    activeIcon: "bg-gradient-to-br from-slate-600 to-slate-700",
    hover: "hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100/50 hover:text-slate-700",
    iconBg: "bg-slate-50 group-hover:bg-slate-100 text-slate-600",
    badge: "from-slate-100 to-slate-200 text-slate-800 border-slate-300",
    accent: "from-slate-600 to-slate-700",
    subMenuBg: "bg-slate-50/50",
  },
  rose: {
    name: "Sunset Rose",
    sidebar: "bg-gradient-to-b from-rose-50 to-rose-100/20",
    border: "border-rose-200/40",
    active: "bg-gradient-to-r from-rose-600/15 to-rose-500/10 text-rose-700 border-rose-200",
    activeIcon: "bg-gradient-to-br from-rose-600 to-rose-700",
    hover: "hover:bg-gradient-to-r hover:from-rose-50 hover:to-rose-100/50 hover:text-rose-700",
    iconBg: "bg-rose-50 group-hover:bg-rose-100 text-rose-600",
    badge: "from-rose-100 to-rose-200 text-rose-800 border-rose-300",
    accent: "from-rose-600 to-rose-700",
    subMenuBg: "bg-rose-50/50",
  },
};

export default function AppSidebar() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [currentTheme, setCurrentTheme] = useState("blue");
  const [expandedMenus, setExpandedMenus] = useState({});
  const pathname = usePathname();
  const theme = themes[currentTheme];

  const toggleMenu = (title) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const userMenuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      description: "Overview & stats",
    },
    {
      title: "Tickets",
      url: "/dashboard/tickets/",
      icon: Ticket,
      description: "Manage tickets",
      subItems: [
        {
          title: "Create Ticket",
          url: "/dashboard/tickets/create/",
          description: "Report new issue",
        },
        {
          title: "My Tickets",
          url: "/dashboard/tickets/",
          description: "Track your requests",
        },
      ],
    },
    {
      title: "My Billing",
      url: "/dashboard/user-billing/",
      icon: CreditCard,
      description: "View billing & usage",
    },
    {
      title: "Help Center",
      url: "/dashboard/help/",
      icon: HelpCircle,
      description: "Get assistance",
    },
    {
      title: "AS2 Management",
      url: "/dashboard/as2/",
      icon: Activity,
      description: "Get assistance",
    },
  ];

  const adminMenuItems = [
    {
      title: "Admin Dashboard",
      url: "/dashboard/",
      icon: BarChart3,
      description: "Analytics & insights",
    },
    {
      title: "User Management",
      url: "/user-management/",
      icon: Users,
      description: "Analytics & insights",
    },
    {
      title: "React Form",
      url: "/form/",
      icon: BarChart3,
      description: "Analytics & insights",
    },
    {
      title: "Tickets",
      url: "/dashboard/admin/tickets/",
      icon: Ticket,
      description: "Manage all requests",
      subItems: [
        {
          title: "All Tickets",
          url: "/dashboard/admin/tickets/",
          badge: "12",
        },
        {
          title: "Open Tickets",
          url: "/dashboard/admin/tickets/open/",
        },
        {
          title: "Closed Tickets",
          url: "/dashboard/admin/tickets/closed/",
        },
      ],
    },
    {
      title: "Billing",
      url: "/dashboard/admin/billing-management/",
      icon: CreditCard,
      description: "Manage billing",
      subItems: [
        {
          title: "Billing Management",
          url: "/dashboard/admin/billing-management/",
        },
        {
          title: "Bill-Server Management",
          url: "/dashboard/admin/bill-server/",
        },
      ],
    },
    {
      title: "Companies",
      url: "/dashboard/admin/view-companies/",
      icon: Users,
      description: "Manage clients",
      subItems: [
        {
          title: "Configure Company",
          url: "/dashboard/admin/add-company/",
        },
        {
          title: "View Companies",
          url: "/dashboard/admin/view-companies/",
        },
      ],
    },
     {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
      description: "Analytics & insights",
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const isActiveRoute = (itemUrl, index) => {
    if (itemUrl === "/" && pathname === "/") {
      return true;
    }
    if (pathname === itemUrl) {
      return true;
    }
    const routesThatMatchSubRoutes = [
      "/dashboard/tickets",
      "/dashboard/admin/tickets",
    ];
    if (
      routesThatMatchSubRoutes.includes(itemUrl) &&
      pathname.startsWith(itemUrl + "/")
    ) {
      return true;
    }
    if (itemUrl === "/" && pathname === "/dashboard" && index === 0) {
      return true;
    }
    return false;
  };

  const isSubItemActive = (subItemUrl) => {
    return pathname === subItemUrl;
  };

  const hasActiveSubItem = (item) => {
    return item.subItems?.some((subItem) => isSubItemActive(subItem.url));
  };

  return (
    <Sidebar className={`border-r ${theme.border} ${theme.sidebar}`}>
      <SidebarHeader className={`border-b ${theme.border}`}>
        <div className="flex items-center justify-between px-4 py-[2px]">
          <div className="ms-2">
            {/* <Image alt="logo" src="/haromLogo.png" width={150} height={150} /> */}
            <span className="font-semibold text-lg">Logo</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-white/50"
              >
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {Object.entries(themes).map(([key, themeConfig]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setCurrentTheme(key)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={`h-4 w-4 rounded-full bg-gradient-to-br ${themeConfig.accent}`}
                    />
                    <span className="flex-1">{themeConfig.name}</span>
                    {currentTheme === key && (
                      <span className="text-xs">✓</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item, index) => {
                const isActive = isActiveRoute(item.url, index);
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedMenus[item.title];
                const hasActiveSub = hasActiveSubItem(item);

                return (
                  <SidebarMenuItem key={item.title}>
                    {hasSubItems ? (
                      <div>
                        <button
                          onClick={() => toggleMenu(item.title)}
                          className={`group relative flex items-center gap-3 rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200 hover:scale-[1.02] w-full ${
                            isActive || hasActiveSub
                              ? `${theme.active} shadow-sm`
                              : `text-slate-600 ${theme.hover}`
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                              isActive || hasActiveSub
                                ? `${theme.activeIcon} text-white shadow-md`
                                : `${theme.iconBg} group-hover:scale-110`
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">
                                {item.title}
                              </span>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className={`bg-gradient-to-r ${theme.badge} text-xs px-2 py-0.5 animate-pulse`}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 transition-transform" />
                          ) : (
                            <ChevronRight className="h-4 w-4 transition-transform" />
                          )}

                          {(isActive || hasActiveSub) && (
                            <div
                              className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${theme.accent} rounded-full`}
                            ></div>
                          )}
                        </button>

                        {isExpanded && (
                          <div className={`mt-1 ml-11 space-y-1 ${theme.subMenuBg} rounded-lg p-1`}>
                            {item.subItems.map((subItem) => {
                              const isSubActive = isSubItemActive(subItem.url);
                              return (
                                <Link
                                  key={subItem.title}
                                  href={subItem.url}
                                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200 ${
                                    isSubActive
                                      ? `${theme.active} shadow-sm`
                                      : `text-slate-600 ${theme.hover}`
                                  }`}
                                >
                                  <span className="truncate">
                                    {subItem.title}
                                  </span>
                                  {subItem.badge && (
                                    <Badge
                                      variant="secondary"
                                      className={`bg-gradient-to-r ${theme.badge} text-xs px-2 py-0.5`}
                                    >
                                      {subItem.badge}
                                    </Badge>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`group relative flex items-center gap-3 rounded-lg px-3 py-[1.27rem] text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                            isActive
                              ? `${theme.active} shadow-sm`
                              : `text-slate-600 ${theme.hover}`
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${
                              isActive
                                ? `${theme.activeIcon} text-white shadow-md`
                                : `${theme.iconBg} group-hover:scale-110`
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">
                                {item.title}
                              </span>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className={`bg-gradient-to-r ${theme.badge} text-xs px-2 py-0.5 animate-pulse`}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {isActive && (
                            <div
                              className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${theme.accent} rounded-full`}
                            ></div>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}