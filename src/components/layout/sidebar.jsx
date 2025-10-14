"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Menu, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { navigationItems } from "@/lib/constants"
import { cn } from "@/lib/utils"

function SidebarContent({ onItemClick }) {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState(new Set())

  const toggleItem = (title) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(title)) {
      newOpenItems.delete(title)
    } else {
      newOpenItems.add(title)
    }
    setOpenItems(newOpenItems)
  }

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  const hasActiveChild = (items) => {
    return items?.some((item) => isActive(item.href))
  }

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
            <span className="text-xs text-muted-foreground">Pharmacovigilance</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2.5">
          {navigationItems.map((item) => {
            if (item.items) {
              // Collapsible menu item
              const isOpen = openItems.has(item.title)
              const hasActive = hasActiveChild(item.items)

              return (
                <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "group relative w-full justify-between px-3 py-5 text-left font-medium rounded-xl",
                        isOpen || hasActive
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                          : "text-muted-foreground hover:bg-muted/50",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                            isOpen || hasActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className={cn("text-sm", isOpen || hasActive ? "text-primary" : "text-foreground")}>
                          {item.title}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronDown
                          className={cn("h-4 w-4", isOpen || hasActive ? "text-primary" : "text-muted-foreground")}
                        />
                      ) : (
                        <ChevronRight
                          className={cn("h-4 w-4", isOpen || hasActive ? "text-primary" : "text-muted-foreground")}
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
                          "group relative w-full justify-start px-3 py-5 font-medium rounded-xl",
                          isActive(subItem.href)
                            ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                            : "text-muted-foreground hover:bg-muted/50",
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
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-primary/10 text-primary",
                                )}
                              >
                                <subItem.icon className="h-4 w-4" />
                              </span>
                            )}
                            <span
                              className={cn("text-sm", isActive(subItem.href) ? "text-primary" : "text-foreground")}
                            >
                              {subItem.title}
                            </span>
                          </div>
                        </Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )
            } else {
              // Simple menu item
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild
                  className={cn(
                    "group relative w-full justify-start px-3 py-2 font-medium rounded-xl",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50",
                  )}
                  onClick={onItemClick}
                >
                  <Link href={item.href}>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                          isActive(item.href) ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className={cn("text-sm", isActive(item.href) ? "text-primary" : "text-foreground")}>
                        {item.title}
                      </span>
                    </div>
                    {isActive(item.href) && (
                      <span aria-hidden className="absolute right-1 top-1 bottom-1 w-1 rounded-full bg-primary" />
                    )}
                  </Link>
                </Button>
              )
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
  )
}

export function Sidebar() {
  return (
    <div className="hidden border-r bg-background lg:block lg:w-64">
      <SidebarContent />
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

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
  )
}
