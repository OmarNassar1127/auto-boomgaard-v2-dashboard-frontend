"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { cn } from "@/app/lib/utils"

import {
  LayoutDashboard,
  Car,
  FileBarChart,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Separator } from "@/app/components/ui/separator"
import { useState } from "react"

interface SidebarProps {
  className?: string
  onMobileClose?: () => void
}

export function Sidebar({ className, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [carsExpanded, setCarsExpanded] = useState(true)

  const handleLogout = () => {
    logout()
  }

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Auto's",
      icon: Car,
      href: "/dashboard/autos",
      active: pathname.includes("/dashboard/autos"),
      subroutes: [
        {
          label: "Overzicht",
          href: "/dashboard/autos",
          active: pathname === "/dashboard/autos",
        },
        {
          label: "Toevoegen",
          href: "/dashboard/autos/toevoegen",
          active: pathname === "/dashboard/autos/toevoegen",
        },
      ],
    },
    {
      label: "Gebruikers",
      icon: Users,
      href: "/dashboard/gebruikers",
      active: pathname === "/dashboard/gebruikers",
    },
    {
      label: "Instellingen",
      icon: Settings,
      href: "/dashboard/instellingen",
      active: pathname === "/dashboard/instellingen",
    },
  ]

  return (
    <div className={cn("min-h-screen bg-card border-r flex flex-col fixed left-0 top-0 w-64 z-40", className)}>
      {/* Header section with pastel grey background */}
      <div className="bg-gray-100 border-b">
        {/* Mobile header with close button */}
        <div className="lg:hidden flex items-center justify-between px-3 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2 flex-1 justify-center pr-8">
            <div className="bg-primary rounded-md p-1">
              <Car className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="text-base font-bold">Auto Boomgaard</h2>
          </div>
          {onMobileClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="h-8 w-8 hover:bg-gray-200 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Desktop header */}
        <div className="hidden lg:block px-3 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-md p-1">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold">Auto Boomgaard</h2>
          </div>
        </div>
        
        {/* User info section */}
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2">
            <Avatar className="flex-shrink-0">
              <AvatarFallback>
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AB'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.name || 'Admin Gebruiker'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@autoboomgaard.nl'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation menu */}
      <div className="flex-1 py-3 lg:py-4 overflow-y-auto">
        <div className="px-2 lg:px-3">
          <div className="space-y-1">
            {routes.map((route) => (
              <div key={route.href}>
                {route.subroutes ? (
                  <div>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-9 lg:h-10 text-sm lg:text-base",
                        route.active && "text-foreground"
                      )}
                      onClick={() => setCarsExpanded(!carsExpanded)}
                    >
                      {carsExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <route.icon className="h-4 w-4" />
                      {route.label}
                    </Button>
                    {carsExpanded && (
                      <div className="ml-6 lg:ml-8 space-y-1 pt-1">
                        {route.subroutes.map((subroute) => (
                          <Button
                            key={subroute.href}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-sm text-muted-foreground hover:text-foreground h-8 lg:h-9",
                              subroute.active && "text-foreground font-medium"
                            )}
                            asChild
                            onClick={onMobileClose}
                          >
                            <Link href={subroute.href}>{subroute.label}</Link>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-9 lg:h-10 text-sm lg:text-base",
                      route.active && "text-foreground"
                    )}
                    asChild
                    onClick={onMobileClose}
                  >
                    <Link href={route.href}>
                      <route.icon className="h-4 w-4" />
                      {route.label}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Logout button at the very bottom */}
      <div className="border-t bg-gradient-to-r from-red-900 to-red-800">
        <div className="px-2 lg:px-3 py-2 lg:py-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-white hover:text-red-100 hover:bg-red-800/50 transition-all duration-200 h-9 lg:h-10 text-sm lg:text-base"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Uitloggen
          </Button>
        </div>
      </div>
    </div>
  )
}