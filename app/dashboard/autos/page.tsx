"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/app/components/dashboard/header"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { Card } from "@/app/components/ui/card"
import { formatCurrency } from "@/app/lib/utils"
import mockData from "@/app/data/mockData.json"
import { Plus, Search, Heart, Edit, Eye } from "lucide-react"

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

    setFilteredCars(result)
  }, [cars, searchQuery])



  const toggleFavorite = (id: string) => {
    setCars((prev) =>
      prev.map((car) =>
        car.id === id ? { ...car, is_favorite: !car.is_favorite } : car
      )
    )
  }



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

        <div className="space-y-4">
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
  )
}