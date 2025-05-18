"use client"

import { useState, useEffect } from "react"
import { Header } from "@/app/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Car, DollarSign, Truck, Users, ArrowUp, ArrowDown, LineChart, BarChart, Plus, AlertCircle } from "lucide-react"
import Link from "next/link"
import { carsAPI, type CarListItem, type CarData } from "@/app/lib/api"

interface DashboardStats {
  totalCars: number
  publishedCars: number
  draftCars: number
  soldCars: number
  listedCars: number
  reservedCars: number
  upcomingCars: number
}

export default function DashboardPage() {
  const [cars, setCars] = useState<CarListItem[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    publishedCars: 0,
    draftCars: 0,
    soldCars: 0,
    listedCars: 0,
    reservedCars: 0,
    upcomingCars: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all cars for dashboard overview  
        const response = await carsAPI.getAll({ per_page: 100 })
        console.log('Dashboard API Response:', response) // Debug log
        const fetchedCars: CarListItem[] = response.data || []
        
        setCars(fetchedCars)
        
        // Calculate statistics
        const newStats: DashboardStats = {
          totalCars: fetchedCars.length,
          publishedCars: fetchedCars.filter(car => car.post_status === 'published').length,
          draftCars: fetchedCars.filter(car => car.post_status === 'draft').length,
          soldCars: fetchedCars.filter(car => car.vehicle_status === 'sold').length,
          listedCars: fetchedCars.filter(car => car.vehicle_status === 'listed').length,
          reservedCars: fetchedCars.filter(car => car.vehicle_status === 'reserved').length,
          upcomingCars: fetchedCars.filter(car => car.vehicle_status === 'upcoming').length
        }
        setStats(newStats)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Totaal auto's</p>
                  <p className="text-3xl font-bold">{stats.totalCars}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Car className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <span>{stats.publishedCars} gepubliceerd</span>
                <span className="mx-2">•</span>
                <span>{stats.draftCars} concepten</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Te koop</p>
                  <p className="text-3xl font-bold">{stats.listedCars}</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <span>{stats.reservedCars} gereserveerd</span>
                <span className="mx-2">•</span>
                <span>{stats.upcomingCars} aankomend</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verkocht</p>
                  <p className="text-3xl font-bold">{stats.soldCars}</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <Truck className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">
                  {stats.totalCars > 0 ? Math.round((stats.soldCars / stats.totalCars) * 100) : 0}%
                </span>
                <span className="ml-1">van totaal</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status verdeling</p>
                  <p className="text-xl font-semibold">
                    {stats.totalCars > 0 ? `${Math.round((stats.publishedCars / stats.totalCars) * 100)}%` : '0%'}
                  </p>
                  <p className="text-sm text-muted-foreground">gepubliceerd</p>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-full">
                  <BarChart className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
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
                {cars.slice(0, 6).map((car: CarListItem) => (
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
