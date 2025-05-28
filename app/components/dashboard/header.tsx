"use client"

import { Bell, Search } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="border-b">
      {/* Extra left padding on mobile for hamburger button */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-8 pl-12 lg:pl-4">
        <div className="py-0 hidden md:block">
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        
        {/* Mobile: Only show notification button on the right */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          {/* Search bar - hidden on mobile, visible on desktop */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken..."
              className="w-48 lg:w-64 pl-8"
            />
          </div>
          
          {/* Notification button - always visible, responsive sizing */}
          <Button 
            variant="outline" 
            size="icon" 
            className="relative h-9 w-9 md:h-10 md:w-10 flex-shrink-0"
          >
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
            <span className="absolute -right-1 -top-1 flex h-3 w-3 md:h-4 md:w-4 items-center justify-center rounded-full bg-primary text-[9px] md:text-[10px] text-primary-foreground">
              3
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}