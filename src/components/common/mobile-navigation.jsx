'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { navigationItems } from '@/lib/constants'
import { cn } from '@/lib/utils'

function MobileNavItem({ item, onItemClick, level = 0 }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const hasActiveChild = (items) => {
    return items?.some(item => isActive(item.href))
  }

  if (item.items) {
    const hasActive = hasActiveChild(item.items)
    
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between text-left font-normal h-12",
              level > 0 && "pl-8",
              hasActive && "bg-accent text-accent-foreground"
            )}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {item.items.map((subItem) => (
            <MobileNavItem
              key={subItem.href}
              item={subItem}
              onItemClick={onItemClick}
              level={level + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "w-full justify-start text-left font-normal h-12",
        level > 0 && "pl-8",
        isActive(item.href) && "bg-accent text-accent-foreground"
      )}
      onClick={onItemClick}
    >
      <Link href={item.href}>
        <div className="flex items-center space-x-3">
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </div>
      </Link>
    </Button>
  )
}

export function MobileNavigation() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold">AS2 Portal</div>
                <div className="text-xs text-muted-foreground">Pharmacovigilance</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <MobileNavItem
                  key={item.href || item.title}
                  item={item}
                  onItemClick={() => setOpen(false)}
                />
              ))}
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
      </SheetContent>
    </Sheet>
  )
}