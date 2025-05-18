"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Header } from "@/app/components/dashboard/header"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { Card } from "@/app/components/ui/card"
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  RefreshCw,
  Car as CarIcon,
  Filter,
  X
} from "lucide-react"
import { carsAPI, type CarListItem, type PaginatedResponse } from "@/app/lib/api"

interface CarsPageState {
  cars: CarListItem[]
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  }
  filters: {
    search: string
    vehicleStatus: string
    postStatus: string
  }
}

const VEHICLE_STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Aankomend' },
  { value: 'listed', label: 'Te Koop' },
  { value: 'reserved', label: 'Gereserveerd' },
  { value: 'sold', label: 'Verkocht' },
]

const POST_STATUS_OPTIONS = [
  { value: 'draft', label: 'Concept' },
  { value: 'published', label: 'Gepubliceerd' },
]

export default function CarsPage() {
  const [state, setState] = useState<CarsPageState>({
    cars: [],
    loading: true,
    error: null,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
      total: 0,
    },
    filters: {
      search: '',
      vehicleStatus: '',
      postStatus: '',
    },
  })

  const [refreshing, setRefreshing] = useState(false)

  const fetchCars = useCallback(async (page: number = 1) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const params: any = {
        page,
        per_page: state.pagination.perPage,
      }

      // Add filters only if they have values
      if (state.filters.search) params.search = state.filters.search
      if (state.filters.vehicleStatus) params.vehicle_status = state.filters.vehicleStatus
      if (state.filters.postStatus) params.post_status = state.filters.postStatus

      const response: PaginatedResponse<CarListItem> = await carsAPI.getAll(params)
      
      setState(prev => ({
        ...prev,
        cars: response.data,
        loading: false,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
        },
      }))
    } catch (error) {
      console.error('Error fetching cars:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch cars',
      }))
    }
  }, [state.pagination.perPage, state.filters])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCars(state.pagination.currentPage)
    setRefreshing(false)
  }

  const handleFilterChange = (filterType: keyof typeof state.filters, value: string) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [filterType]: value },
      pagination: { ...prev.pagination, currentPage: 1 },
    }))
  }

  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      filters: { search: '', vehicleStatus: '', postStatus: '' },
      pagination: { ...prev.pagination, currentPage: 1 },
    }))
  }

  const handlePageChange = (page: number) => {
    fetchCars(page)
  }

  const formatCurrency = (price: string): string => {
    // If already formatted with €, return as is
    if (price.includes('€')) return price
    
    // Try to parse and format
    const numericPrice = parseFloat(price.replace(/[^0-9.-]/g, ''))
    if (isNaN(numericPrice)) return price
    
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice)
  }

  const getVehicleStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: { className: 'bg-gray-100 text-gray-800', label: 'Aankomend' },
      listed: { className: 'bg-green-100 text-green-800', label: 'Te Koop' },
      reserved: { className: 'bg-yellow-100 text-yellow-800', label: 'Gereserveerd' },
      sold: { className: 'bg-blue-100 text-blue-800', label: 'Verkocht' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getPostStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { className: 'bg-orange-100 text-orange-800', label: 'Concept' },
      published: { className: 'bg-emerald-100 text-emerald-800', label: 'Gepubliceerd' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const hasActiveFilters = state.filters.search || state.filters.vehicleStatus || state.filters.postStatus

  // Initial load and when filters change
  useEffect(() => {
    fetchCars(1)
  }, [state.filters])

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Auto's" 
        subtitle="Beheer de auto's in uw inventaris"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoeken op merk, model, jaar..."
                className="pl-9 w-full sm:w-[300px]"
                value={state.filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <Select
            value={state.filters.vehicleStatus || "all"}
            onValueChange={(value) => handleFilterChange('vehicleStatus', value === "all" ? "" : value)}
            >
            <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Voertuig status" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">Alle statussen</SelectItem>
            {VEHICLE_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
            {option.label}
            </SelectItem>
            ))}
            </SelectContent>
            </Select>

            <Select
            value={state.filters.postStatus || "all"}
            onValueChange={(value) => handleFilterChange('postStatus', value === "all" ? "" : value)}
            >
            <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Publicatie status" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">Alle statussen</SelectItem>
            {POST_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
            {option.label}
            </SelectItem>
            ))}
            </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Filters wissen
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Vernieuw
            </Button>
            <Button asChild>
              <Link href="/dashboard/autos/toevoegen">
                <Plus className="mr-2 h-4 w-4" />
                Nieuwe auto
              </Link>
            </Button>
          </div>
        </div>

        {/* Status Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {state.loading ? 'Laden...' : `${state.pagination.total} auto's gevonden`}
            {hasActiveFilters && ' (gefilterd)'}
          </span>
          {state.pagination.total > state.pagination.perPage && (
            <span>
              Pagina {state.pagination.currentPage} van {state.pagination.lastPage}
            </span>
          )}
        </div>

        {/* Error State */}
        {state.error && (
          <Card className="border-red-200 bg-red-50">
            <div className="p-4 flex items-center gap-2 text-red-700">
              <X className="h-4 w-4" />
              <span>{state.error}</span>
              <Button variant="ghost" size="sm" onClick={() => fetchCars()}>
                Probeer opnieuw
              </Button>
            </div>
          </Card>
        )}

        {/* Cars Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Foto</TableHead>
                  <TableHead>Merk & Model</TableHead>
                  <TableHead>Prijs</TableHead>
                  <TableHead>Jaar</TableHead>
                  <TableHead>KM Stand</TableHead>
                  <TableHead>Voertuig Status</TableHead>
                  <TableHead>Publicatie</TableHead>
                  <TableHead className="w-[120px]">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <CarIcon className="h-8 w-8 animate-pulse mx-auto mb-2 text-muted-foreground" />
                      <p>Auto's worden geladen...</p>
                    </TableCell>
                  </TableRow>
                ) : state.cars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <CarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium text-muted-foreground mb-2">
                        {hasActiveFilters ? 'Geen auto\'s gevonden' : 'Nog geen auto\'s toegevoegd'}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {hasActiveFilters 
                          ? 'Probeer de filters aan te passen of wis alle filters.'
                          : 'Begin met het toevoegen van je eerste auto aan de inventaris.'
                        }
                      </p>
                      {!hasActiveFilters && (
                        <Button asChild>
                          <Link href="/dashboard/autos/toevoegen">
                            <Plus className="mr-2 h-4 w-4" />
                            Eerste auto toevoegen
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  state.cars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell className="font-medium">#{car.id}</TableCell>
                      <TableCell>
                        <div className="relative w-16 h-12 rounded-md overflow-hidden bg-muted">
                          {car.main_image ? (
                            <img
                              src={car.main_image}
                              alt={`${car.brand} ${car.model}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <CarIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{car.brand} {car.model}</div>
                        <div className="text-sm text-muted-foreground">
                          {car.fuel} • {car.transmission}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(car.price)}
                      </TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>{car.mileage}</TableCell>
                      <TableCell>
                        {getVehicleStatusBadge(car.vehicle_status)}
                      </TableCell>
                      <TableCell>
                        {getPostStatusBadge(car.post_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/autos/${car.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/autos/${car.id}/bewerken`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              // TODO: Implement delete functionality
                              console.log('Delete car:', car.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {state.pagination.total > state.pagination.perPage && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Weergave {state.pagination.total === 0 ? 0 : ((state.pagination.currentPage - 1) * state.pagination.perPage + 1)} tot{' '}
                {Math.min(state.pagination.currentPage * state.pagination.perPage, state.pagination.total)} van{' '}
                {state.pagination.total} resultaten
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={state.pagination.currentPage <= 1}
                  onClick={() => handlePageChange(state.pagination.currentPage - 1)}
                >
                  Vorige
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={state.pagination.currentPage >= state.pagination.lastPage}
                  onClick={() => handlePageChange(state.pagination.currentPage + 1)}
                >
                  Volgende
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
