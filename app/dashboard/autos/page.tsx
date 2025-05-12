"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/app/components/dashboard/header"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { Checkbox } from "@/app/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { formatCurrency, formatDate } from "@/app/lib/utils"
import mockData from "@/app/data/mockData.json"
import { Plus, FileDown, Search, Pencil, Trash, Heart, Edit, Eye } from "lucide-react"

interface Car {
  id: string
  brand: string
  model: string
  price: number
  year: number
  mileage_km: number
  status: string
  is_favorite: boolean
  transmission: string
  fuel_type: string
  images: string[]
  created_at: string
  updated_at: string
  [key: string]: any
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    brand: "all",
    status: "all",
    fuel_type: "all",
    transmission: "all",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    onlyFavorites: false,
  })

  useEffect(() => {
    // In een echte applicatie zouden we hier data ophalen van een API
    setCars(mockData.cars)
    setFilteredCars(mockData.cars)
  }, [])

  useEffect(() => {
    let result = [...cars]

    // Zoeken
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (car) =>
          car.brand.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.id.toLowerCase().includes(query)
      )
    }

    // Filters toepassen
    if (filters.brand && filters.brand !== "all") {
      result = result.filter((car) => car.brand === filters.brand)
    }
    if (filters.status && filters.status !== "all") {
      result = result.filter((car) => car.status === filters.status)
    }
    if (filters.fuel_type && filters.fuel_type !== "all") {
      result = result.filter((car) => car.fuel_type === filters.fuel_type)
    }
    if (filters.transmission && filters.transmission !== "all") {
      result = result.filter((car) => car.transmission === filters.transmission)
    }
    if (filters.minPrice) {
      result = result.filter((car) => car.price >= parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter((car) => car.price <= parseInt(filters.maxPrice))
    }
    if (filters.minYear) {
      result = result.filter((car) => car.year >= parseInt(filters.minYear))
    }
    if (filters.maxYear) {
      result = result.filter((car) => car.year <= parseInt(filters.maxYear))
    }
    if (filters.onlyFavorites) {
      result = result.filter((car) => car.is_favorite)
    }

    setFilteredCars(result)
  }, [cars, searchQuery, filters])

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      brand: "all",
      status: "all",
      fuel_type: "all",
      transmission: "all",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      onlyFavorites: false,
    })
    setSearchQuery("")
  }

  const toggleFavorite = (id: string) => {
    setCars((prev) =>
      prev.map((car) =>
        car.id === id ? { ...car, is_favorite: !car.is_favorite } : car
      )
    )
  }

  // Unieke waarden voor filters
  const uniqueBrands = Array.from(new Set(cars.map((car) => car.brand)))
  const uniqueStatuses = Array.from(new Set(cars.map((car) => car.status)))
  const uniqueFuelTypes = Array.from(new Set(cars.map((car) => car.fuel_type)))
  const uniqueTransmissions = Array.from(new Set(cars.map((car) => car.transmission)))

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Auto's" 
        subtitle="Beheer de auto's in uw inventaris"
      />
      
      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op merk, model of ID..."
              className="pl-9 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button asChild>
              <Link href="/dashboard/autos/toevoegen">
                <Plus className="mr-2 h-4 w-4" />
                Nieuwe auto
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Merk</Label>
                <Select
                  value={filters.brand}
                  onValueChange={(value) => handleFilterChange("brand", value)}
                >
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Alle merken" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle merken</SelectItem>
                    {uniqueBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Alle statussen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle statussen</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel_type">Brandstoftype</Label>
                <Select
                  value={filters.fuel_type}
                  onValueChange={(value) => handleFilterChange("fuel_type", value)}
                >
                  <SelectTrigger id="fuel_type">
                    <SelectValue placeholder="Alle brandstoftypes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle brandstoftypes</SelectItem>
                    {uniqueFuelTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Transmissie</Label>
                <Select
                  value={filters.transmission}
                  onValueChange={(value) => handleFilterChange("transmission", value)}
                >
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Alle transmissies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle transmissies</SelectItem>
                    {uniqueTransmissions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Min. prijs (€)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Max. prijs (€)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minYear">Min. jaar</Label>
                  <Input
                    id="minYear"
                    type="number"
                    placeholder="Van"
                    value={filters.minYear}
                    onChange={(e) => handleFilterChange("minYear", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxYear">Max. jaar</Label>
                  <Input
                    id="maxYear"
                    type="number"
                    placeholder="Tot"
                    value={filters.maxYear}
                    onChange={(e) => handleFilterChange("maxYear", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="onlyFavorites"
                  checked={filters.onlyFavorites}
                  onCheckedChange={(checked) => 
                    handleFilterChange("onlyFavorites", checked === true)
                  }
                />
                <Label htmlFor="onlyFavorites">Alleen favorieten</Label>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={resetFilters}
              >
                Filters resetten
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-lg font-medium">
              {filteredCars.length} auto's gevonden
            </h3>
            
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
                      <TableHead>Status</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCars.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          Geen auto's gevonden die aan de criteria voldoen.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCars.map((car) => (
                        <TableRow key={car.id}>
                          <TableCell className="font-medium">{car.id}</TableCell>
                          <TableCell>
                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                              <img
                                src={car.images[0]}
                                alt={`${car.brand} ${car.model}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{car.brand} {car.model}</div>
                            <div className="text-sm text-muted-foreground">
                              {car.fuel_type} • {car.transmission}
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(car.price)}</TableCell>
                          <TableCell>{car.year}</TableCell>
                          <TableCell>{car.mileage_km.toLocaleString('nl-NL')} km</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              car.status === 'Te Koop'
                                ? 'bg-green-100 text-green-800'
                                : car.status === 'Gereserveerd'
                                ? 'bg-yellow-100 text-yellow-800'
                                : car.status === 'Verkocht'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {car.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
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
                                onClick={() => toggleFavorite(car.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    car.is_favorite ? "fill-red-500 text-red-500" : ""
                                  }`}
                                />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}