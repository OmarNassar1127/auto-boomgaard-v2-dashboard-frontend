"use client"

import { useState, useEffect } from "react"
import { Header } from "@/app/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Separator } from "@/app/components/ui/separator"
import { Button } from "@/app/components/ui/button"
import { formatCurrency } from "@/app/lib/utils"
import { Car, DollarSign, Truck, Users, ArrowUp, ArrowDown, LineChart, BarChart } from "lucide-react"
import Link from "next/link"
import mockData from "@/app/data/mockData.json"
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts"

export default function DashboardPage() {
  const carStatusData = Object.entries(mockData.statistics.cars_by_status).map(([name, value]) => ({
    name,
    value,
  }))

  const fuelTypeData = Object.entries(mockData.statistics.cars_by_fuel_type).map(([name, value]) => ({
    name,
    value,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const brandData = Object.entries(mockData.statistics.average_price_by_brand)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      bedrag: value,
    }))

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle="Welkom bij het Auto Boomgaard beheerderspaneel"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Statistiek blokken */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Totaal auto's</p>
                  <p className="text-3xl font-bold">
                    {Object.values(mockData.statistics.cars_by_status).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Car className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">12%</span>
                <span className="ml-1">sinds vorige maand</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verkochte auto's</p>
                  <p className="text-3xl font-bold">
                    {mockData.statistics.cars_by_status["Verkocht"] || 0}
                  </p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500 font-medium">5%</span>
                <span className="ml-1">sinds vorige maand</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Omzet dit jaar</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(356780)}
                  </p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <LineChart className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">18%</span>
                <span className="ml-1">sinds vorig jaar</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Actieve gebruikers</p>
                  <p className="text-3xl font-bold">
                    {mockData.users.filter(user => user.status === "active").length}
                  </p>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-full">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">2</span>
                <span className="ml-1">nieuwe deze maand</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grafieken */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Verkopen per maand</CardTitle>
              <CardDescription>Aantal verkochte auto's per maand in het huidige jaar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={mockData.statistics.monthly_sales}
                    margin={{
                      top: 5,
                      right: 20,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="aantal" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Auto's per status</CardTitle>
              <CardDescription>Verdeling van auto's per status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={carStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {carStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} auto's`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Auto's per brandstoftype</CardTitle>
              <CardDescription>Verdeling van auto's per brandstoftype</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fuelTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fuelTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} auto's`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Gemiddelde prijs per merk</CardTitle>
              <CardDescription>Top 5 merken met de hoogste gemiddelde prijs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={brandData}
                    margin={{
                      top: 5,
                      right: 20,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), "Gemiddelde prijs"]} />
                    <Bar dataKey="bedrag" fill="#8884d8">
                      {brandData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recente auto's */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent toegevoegde auto's</CardTitle>
              <CardDescription>De laatste auto's die zijn toegevoegd aan de inventaris</CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/autos">Alle auto's bekijken</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockData.cars.slice(0, 3).map((car) => (
                <Card key={car.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={car.images[0]} 
                      alt={`${car.brand} ${car.model}`} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{car.brand} {car.model}</h3>
                        <p className="text-sm text-muted-foreground">{car.year} • {car.mileage_km.toLocaleString('nl-NL')} km</p>
                      </div>
                      <span className="font-bold text-primary">{formatCurrency(car.price)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
                        {car.fuel_type}
                      </span>
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
                        {car.transmission}
                      </span>
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
                        {car.engine}
                      </span>
                    </div>
                    <div className="mt-4">
                      <Button asChild className="w-full">
                        <Link href={`/dashboard/autos/${car.id}`}>Details bekijken</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}