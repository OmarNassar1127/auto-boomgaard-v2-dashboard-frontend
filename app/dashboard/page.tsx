"use client"

import { useState, useEffect } from "react"
import { Header } from "@/app/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { 
  Car, 
  DollarSign, 
  Truck, 
  Package,
  Trophy,
  Euro,
  Plus, 
  AlertCircle,
  ArrowUp
} from "lucide-react"
import Link from "next/link"
import { carsAPI, statisticsAPI, type CarListItem, type Statistic } from "@/app/lib/api"

interface StatisticsData {
  total_cars: Statistic
  current_portfolio: Statistic
  cars_sold_this_year: Statistic
  average_price: Statistic
}

export default function DashboardPage() {
  const [cars, setCars] = useState<CarListItem[]>([])
  const [statistics, setStatistics] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch statistics and recent cars in parallel
        const [statsResponse, carsResponse] = await Promise.all([
          statisticsAPI.getStatistics(),
          carsAPI.getAll({ per_page: 6 })
        ])
        
        setStatistics(statsResponse.data)
        setCars(carsResponse.data || [])
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'car':
        return Car
      case 'package':
        return Package
      case 'trophy':
        return Trophy
      case 'euro':
        return Euro
      default:
        return Car
    }
  }

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/10 text-blue-500'
      case 'green':
        return 'bg-green-500/10 text-green-500'
      case 'purple':
        return 'bg-purple-500/10 text-purple-500'
      case 'orange':
        return 'bg-orange-500/10 text-orange-500'
      default:
        return 'bg-primary/10 text-primary'
    }
  }

  const formatCurrency = (amount: string | number): string => {
    if (typeof amount === 'string') {
      // If it's already formatted (e.g., "€54.990,00"), return as is
      if (amount.includes('€')) return amount
      // Try to parse as number if it's a string
      const parsed = parseFloat(amount.replace(/[^0-9.-]/g, ''))
      if (isNaN(parsed)) return amount
      amount = parsed
    }
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header 
          title="Dashboard" 
          subtitle="Welkom bij het Auto Boomgaard beheerderspaneel"
        />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <Car className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Dashboard wordt geladen...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header 
          title="Dashboard" 
          subtitle="Welkom bij het Auto Boomgaard beheerderspaneel"
        />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-2">Error loading dashboard</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Opnieuw proberen
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle="Welkom bij het Auto Boomgaard beheerderspaneel"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Overzicht</h2>
          <Button asChild>
            <Link href="/dashboard/autos/toevoegen">
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe auto toevoegen
            </Link>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statistics && Object.entries(statistics).map(([key, stat]) => {
            const IconComponent = getIconComponent(stat.icon)
            const colorClass = getColorClass(stat.color)
            
            return (
              <Card key={key}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${colorClass}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Cars */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent toegevoegde auto's</CardTitle>
              <CardDescription>
                De laatste {Math.min(6, cars.length)} auto's die zijn toegevoegd aan de inventaris
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard/autos">Alle auto's bekijken</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {cars.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  Nog geen auto's toegevoegd
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Begin met het toevoegen van je eerste auto aan de inventaris
                </p>
                <Button asChild>
                  <Link href="/dashboard/autos/toevoegen">
                    <Plus className="mr-2 h-4 w-4" />
                    Eerste auto toevoegen
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cars.map((car: CarListItem) => (
                  <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      {car.main_image ? (
                        <img 
                          src={car.main_image} 
                          alt={`${car.brand} ${car.model}`} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Car className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{car.brand} {car.model}</h3>
                          <p className="text-sm text-muted-foreground">
                            {car.year} • {car.mileage}
                          </p>
                        </div>
                        <span className="font-bold text-primary">
                          {formatCurrency(car.price)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
                          {car.fuel}
                        </span>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
                          {car.transmission}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-md ${
                          car.vehicle_status === 'listed' ? 'bg-green-100 text-green-700' :
                          car.vehicle_status === 'sold' ? 'bg-blue-100 text-blue-700' :
                          car.vehicle_status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {car.vehicle_status === 'listed' ? 'Te koop' :
                           car.vehicle_status === 'sold' ? 'Verkocht' :
                           car.vehicle_status === 'reserved' ? 'Gereserveerd' :
                           'Aankomend'}
                        </span>
                      </div>
                      
                      <Button asChild className="w-full" size="sm">
                        <Link href={`/dashboard/autos/${car.id}`}>Details bekijken</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
