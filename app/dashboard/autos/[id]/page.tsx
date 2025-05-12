"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/app/components/dashboard/header"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Separator } from "@/app/components/ui/separator"
import { formatCurrency, formatDate } from "@/app/lib/utils"
import mockData from "@/app/data/mockData.json"
import {
  ArrowLeft,
  Edit,
  Trash,
  Heart,
  Calendar,
  Gauge,
  Fuel,
  ArrowRight,
  Car,
  Users,
  Palette,
  Check,
  Zap,
  Contact,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Download,
} from "lucide-react"

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [car, setCar] = useState<any>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // In a real app, we would fetch data from an API
    const foundCar = mockData.cars.find((car) => car.id === params.id)
    if (foundCar) {
      setCar(foundCar)
      setIsFavorite(foundCar.is_favorite)
    }
  }, [params.id])

  if (!car) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Auto details" />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-center h-full">
            <p>Laden...</p>
          </div>
        </div>
      </div>
    )
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % car.images.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length)
  }

  const statusColors: Record<string, string> = {
    "Te Koop": "bg-green-100 text-green-800",
    "Gereserveerd": "bg-yellow-100 text-yellow-800",
    "Verkocht": "bg-blue-100 text-blue-800",
    "In Onderhoud": "bg-red-100 text-red-800",
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title={`${car.brand} ${car.model}`} 
        subtitle={`Auto ID: ${car.id}`} 
      />
      
      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar overzicht
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={toggleFavorite}>
              <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              {isFavorite ? "Verwijderen uit favorieten" : "Toevoegen aan favorieten"}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/autos/${car.id}/bewerken`}>
                <Edit className="mr-2 h-4 w-4" />
                Bewerken
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash className="mr-2 h-4 w-4" />
              Verwijderen
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Auto gegevens</CardTitle>
              <CardDescription>Alle details van de auto</CardDescription>
            </CardHeader>

            <Tabs defaultValue="details" className="mx-6">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Kenmerken</TabsTrigger>
                <TabsTrigger value="description">Beschrijving</TabsTrigger>
                <TabsTrigger value="maintenance">Onderhoud</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Merk</span>
                      <span className="font-medium">{car.brand}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">{car.model}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prijs</span>
                      <span className="font-medium">{formatCurrency(car.price)}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusColors[car.status] || "bg-gray-100 text-gray-800"
                      }`}>
                        {car.status}
                      </span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bouwjaar</span>
                      <span className="font-medium">{car.year}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kilometerstand</span>
                      <span className="font-medium">{car.mileage_km.toLocaleString('nl-NL')} km</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transmissie</span>
                      <span className="font-medium">{car.transmission}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brandstoftype</span>
                      <span className="font-medium">{car.fuel_type}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vermogen</span>
                      <span className="font-medium">{car.power_hp} pk</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Motor</span>
                      <span className="font-medium">{car.engine}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carrosserie</span>
                      <span className="font-medium">{car.body_type}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kleur</span>
                      <span className="font-medium">{car.color}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CO2-uitstoot</span>
                      <span className="font-medium">{car.emissions_g_per_km} g/km</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Energielabel</span>
                      <span className="font-medium">{car.energy_label}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <Card className="p-4 flex flex-col items-center text-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Bouwjaar</span>
                    <span className="font-medium">{car.year}</span>
                  </Card>
                  
                  <Card className="p-4 flex flex-col items-center text-center gap-2">
                    <Gauge className="h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Kilometerstand</span>
                    <span className="font-medium">{car.mileage_km.toLocaleString('nl-NL')} km</span>
                  </Card>
                  
                  <Card className="p-4 flex flex-col items-center text-center gap-2">
                    <Fuel className="h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Brandstof</span>
                    <span className="font-medium">{car.fuel_type}</span>
                  </Card>
                  
                  <Card className="p-4 flex flex-col items-center text-center gap-2">
                    <ArrowRight className="h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Transmissie</span>
                    <span className="font-medium">{car.transmission}</span>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {car.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p>{car.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="maintenance" className="mt-6">
                <div className="prose max-w-none">
                  <p>{car.maintenance_history}</p>
                </div>
              </TabsContent>
            </Tabs>
            <CardFooter className="flex justify-between pt-6">
              <div className="text-sm text-muted-foreground">
                Toegevoegd op: {formatDate(car.created_at)}
              </div>
              <div className="text-sm text-muted-foreground">
                Laatste update: {formatDate(car.updated_at)}
              </div>
            </CardFooter>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Foto's</CardTitle>
                <CardDescription>Bekijk alle foto's van de auto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={car.images[activeImageIndex]}
                    alt={`${car.brand} ${car.model}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-between p-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevImage}
                      className="h-8 w-8 rounded-full bg-background/80"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextImage}
                      className="h-8 w-8 rounded-full bg-background/80"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {car.images.map((image: string, index: number) => (
                    <div
                      key={index}
                      className={`relative aspect-video cursor-pointer overflow-hidden rounded-md ${
                        index === activeImageIndex ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`${car.brand} ${car.model} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Meer foto's toevoegen
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Snelle acties</CardTitle>
                <CardDescription>Beheer de status van de auto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Specificaties downloaden
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Genereer verkoopbrochure
                </Button>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <span className="text-sm font-medium">Status wijzigen naar:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
                      Te Koop
                    </Button>
                    <Button variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900">
                      Gereserveerd
                    </Button>
                    <Button variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900">
                      Verkocht
                    </Button>
                    <Button variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900">
                      In Onderhoud
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}