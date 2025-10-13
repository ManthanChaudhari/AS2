"use client"

import { Bell, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  return (
    <header className="border-b border-slate-200/40 sticky top-0 bg-gradient-to-r from-white to-slate-50/30 z-30 shadow-sm backdrop-blur-sm">
      <div className="px-6">
        <div className="flex items-center justify-between">
          {/* Left side - Page title */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-blue-700 rounded-full"></div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
              {/* <p className="text-sm text-slate-500">Welcome back, John Doe</p> */}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-slate-200/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 w-64 bg-white/50 transition-all duration-200"
              />
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs border-2 border-white">
                3
              </Badge>
            </Button>

            {/* User Profile Dropdown */}
            <div className="flex items-center gap-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 rounded-lg px-3 py-2 transition-all duration-200 border border-transparent hover:border-blue-200/40">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                JD
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-slate-700">John Doe</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}