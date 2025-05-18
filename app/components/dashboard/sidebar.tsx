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
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { Separator } from "@/app/components/ui/separator"
import { useState } from "react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
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
    <div className={cn("pb-12 min-h-screen bg-card border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2 flex items-center gap-3">
          <div className="bg-primary rounded-md p-1">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold">Auto Boomgaard</h2>
        </div>
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AB'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || 'Admin Gebruiker'}</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'admin@autoboomgaard.nl'}</p>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <div key={route.href}>
                {route.subroutes ? (
                  <div>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
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
                      <div className="ml-8 space-y-1 pt-1">
                        {route.subroutes.map((subroute) => (
                          <Button
                            key={subroute.href}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-sm text-muted-foreground hover:text-foreground",
                              subroute.active && "text-foreground font-medium"
                            )}
                            asChild
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
                      "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
                      route.active && "text-foreground"
                    )}
                    asChild
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
        <Separator />
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
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