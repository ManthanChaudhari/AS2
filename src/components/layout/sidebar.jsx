"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { navigationItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

function SidebarContent({ onItemClick }) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (title) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(title)) {
      newOpenItems.delete(title);
    } else {
      newOpenItems.add(title);
    }
    setOpenItems(newOpenItems);
  };

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const hasActiveChild = (items) => {
    return items?.some((item) => isActive(item.href));
  };

  return (
    <div className="flex h-[100vh] flex-col sticky top-0">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">AS2 Portal</span>
            <span className="text-xs text-muted-foreground">
              Pharmacovigilance
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2.5">
          {navigationItems.map((item) => {
            if (item.items) {
              // Collapsible menu item
              const isOpen = openItems.has(item.title);
              const hasActive = hasActiveChild(item.items);

              return (
                <Collapsible
                  key={item.title}
                  open={isOpen}
                  onOpenChange={() => toggleItem(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "group relative w-full justify-between px-3 py-5 text-left font-medium",
                        isOpen || hasActive
                          ? "bg-gradient-to-r from-blue-600/15 to-blue-500/10 text-blue-700 border border-blue-200"
                          : "text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 hover:text-blue-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                            isOpen || hasActive
                              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
                              : "bg-blue-50 group-hover:bg-blue-100 group-hover:scale-110 text-blue-600"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="font-medium truncate">
                          {item.title}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4",
                            isOpen || hasActive
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                      ) : (
                        <ChevronRight
                          className={cn(
                            "h-4 w-4",
                            isOpen || hasActive
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-6 pt-1">
                    {item.items.map((subItem) => (
                      <Button
                        key={subItem.href}
                        variant="ghost"
                        size="sm"
                        asChild
                        className={cn(
                          "group relative w-full justify-start gap-3 px-3 py-[1.27rem] font-medium text-sm transition-all duration-200 hover:scale-[1.02]",
                          isActive(subItem.href)
                            ? "bg-gradient-to-r from-blue-600/15 to-blue-500/10 text-blue-700 border border-blue-200"
                            : "text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 hover:text-blue-700"
                        )}
                        onClick={onItemClick}
                      >
                        <Link href={subItem.href}>
                          <div className="flex items-center gap-3">
                            {subItem.icon && (
                              <span
                                className={cn(
                                  "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                                  isActive(subItem.href)
                                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
                                    : "bg-blue-50 group-hover:bg-blue-100 group-hover:scale-110 text-blue-600"
                                )}
                              >
                                <subItem.icon className="h-4 w-4" />
                              </span>
                            )}
                            <span className="font-medium truncate">
                              {subItem.title}
                            </span>
                            {isActive(subItem.href) && (
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-700 rounded-full"></div>
                            )}
                          </div>
                        </Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            } else {
              // Simple menu item
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild
                  className={cn(
                    "group relative w-full justify-start gap-3 px-3 py-[1.27rem] font-medium text-sm transition-all duration-200 hover:scale-[1.02]",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-600/15 to-blue-500/10 text-blue-700 border border-blue-200"
                      : "text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 hover:text-blue-700"
                  )}
                  onClick={onItemClick}
                >
                  <Link href={item.href}>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
                          isActive(item.href)
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
                            : "bg-blue-50 group-hover:bg-blue-100 group-hover:scale-110 text-blue-600"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className="font-medium truncate">{item.title}</span>
                    </div>
                    {isActive(item.href) && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-700 rounded-full"></div>
                    )}
                  </Link>
                </Button>
              );
            }
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          <div>AS2 Portal v1.0.0</div>
          <div>© 2024 Your Company</div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="hidden border-r bg-background lg:block lg:w-64">
      <SidebarContent className=" py-4" />
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarContent onItemClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
