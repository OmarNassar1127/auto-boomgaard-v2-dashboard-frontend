"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/app/components/dashboard/header"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Gauge,
  Fuel,
  ArrowRight,
  Car as CarIcon,
  Palette,
  CheckCircle2,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Star,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { carsAPI, type CarData } from "@/app/lib/api"

interface CarDetailState {
  car: CarData | null
  loading: boolean
  error: string | null
}

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [state, setState] = useState<CarDetailState>({
    car: null,
    loading: true,
    error: null,
  })
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const carId = params.id as string

  const fetchCarData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const response = await carsAPI.getById(carId)
      setState({
        car: response.data,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error('Error fetching car:', error)
      setState({
        car: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch car data',
      })
    }
  }, [carId])

  useEffect(() => {
    fetchCarData()
  }, [fetchCarData])

  const updateVehicleStatus = async (newStatus: 'sold' | 'listed' | 'reserved' | 'upcoming') => {
    if (!state.car) return
    
    try {
      setUpdatingStatus(true)
      await carsAPI.updateVehicleStatus(state.car.id!, newStatus)
      setState(prev => ({
        ...prev,
        car: prev.car ? { ...prev.car, vehicle_status: newStatus } : null
      }))
    } catch (error) {
      console.error('Error updating vehicle status:', error)
      alert('Failed to update vehicle status. Please try again.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const togglePublishStatus = async () => {
    if (!state.car) return
    
    try {
      setUpdatingStatus(true)
      const newStatus = state.car.post_status === 'published' ? 'draft' : 'published'
      await carsAPI.togglePublishStatus(state.car.id!, newStatus)
      setState(prev => ({
        ...prev,
        car: prev.car ? { ...prev.car, post_status: newStatus } : null
      }))
    } catch (error) {
      console.error('Error updating post status:', error)
      alert('Failed to update publication status. Please try again.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const deleteCar = async () => {
    if (!state.car) return
    
    const confirmed = window.confirm(`Are you sure you want to delete ${state.car.brand} ${state.car.model}? This action cannot be undone.`)
    if (!confirmed) return
    
    try {
      await carsAPI.delete(state.car.id!)
      router.push('/dashboard/autos')
    } catch (error) {
      console.error('Error deleting car:', error)
      alert('Failed to delete car. Please try again.')
    }
  }

  const formatNumber = (num: number | string): string => {
    const number = typeof num === 'string' ? parseInt(num) : num
    if (isNaN(number)) return num.toString()
    return number.toLocaleString('nl-NL')
  }

  const formatCurrency = (price: string | number): string => {
    if (typeof price === 'string' && price.includes('€')) return price
    const numericPrice = typeof price === 'number' ? price : parseFloat(price.toString().replace(/[^0-9.-]/g, ''))
    if (isNaN(numericPrice)) return price.toString()
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getVehicleStatusConfig = (status: string) => {
    const configs = {
      upcoming: { className: 'bg-gray-100 text-gray-800', label: 'Aankomend' },
      listed: { className: 'bg-green-100 text-green-800', label: 'Te Koop' },
      reserved: { className: 'bg-yellow-100 text-yellow-800', label: 'Gereserveerd' },
      sold: { className: 'bg-blue-100 text-blue-800', label: 'Verkocht' },
    }
    return configs[status as keyof typeof configs] || configs.upcoming
  }

  const getPostStatusConfig = (status: string) => {
    const configs = {
      draft: { className: 'bg-orange-100 text-orange-800', label: 'Concept' },
      published: { className: 'bg-emerald-100 text-emerald-800', label: 'Gepubliceerd' },
    }
    return configs[status as keyof typeof configs] || configs.draft
  }

  const images = state.car?.images?.all || []
  
  // Sort images so that the main image comes first
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_main && !b.is_main) return -1
    if (!a.is_main && b.is_main) return 1
    return 0
  })
  
  const hasImages = sortedImages.length > 0

  const nextImage = () => {
    if (hasImages) {
      setActiveImageIndex((prev) => (prev + 1) % sortedImages.length)
    }
  }

  const prevImage = () => {
    if (hasImages) {
      setActiveImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
    }
  }

  // Loading state
  if (state.loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Auto details" subtitle="Gegevens worden geladen..." />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <CarIcon className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Auto gegevens worden geladen...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (state.error || !state.car) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Auto details" subtitle="Er is een fout opgetreden" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-2">Kon auto gegevens niet laden</p>
            <p className="text-sm text-muted-foreground mb-4">{state.error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={fetchCarData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Opnieuw proberen
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { car } = state

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title={`${car.brand} ${car.model}`} 
        subtitle={`Auto ID: #${car.id} • ${car.year}`} 
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar overzicht
          </Button>
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getVehicleStatusConfig(car.vehicle_status).className}>
              {getVehicleStatusConfig(car.vehicle_status).label}
            </Badge>
            <Badge variant="outline" className={getPostStatusConfig(car.post_status).className}>
              {getPostStatusConfig(car.post_status).label}
            </Badge>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/autos/${car.id}/bewerken`}>
                <Edit className="mr-2 h-4 w-4" />
                Bewerken
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Verwijderen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Auto verwijderen</DialogTitle>
                  <DialogDescription>
                    Weet je zeker dat je {car.brand} {car.model} wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Annuleren</Button>
                  <Button variant="destructive" onClick={deleteCar}>
                    Verwijderen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{car.brand} {car.model}</CardTitle>
                  <CardDescription>{formatCurrency(car.price)} {car.tax_info}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{formatCurrency(car.price)}</p>
                  <p className="text-sm text-muted-foreground">{car.tax_info}</p>
                </div>
              </div>
            </CardHeader>

            <Tabs defaultValue="details" className="mx-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Basisgegevens</TabsTrigger>
                <TabsTrigger value="specifications">Specificaties</TabsTrigger>
                <TabsTrigger value="options">Opties</TabsTrigger>
                <TabsTrigger value="highlights">Highlights</TabsTrigger>
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
                      <span className="text-muted-foreground">Bouwjaar</span>
                      <span className="font-medium">{car.year}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kilometerstand</span>
                      <span className="font-medium">{formatNumber(car.mileage)} km</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kleur</span>
                      <span className="font-medium">{car.color}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transmissie</span>
                      <span className="font-medium">{car.transmission}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brandstoftype</span>
                      <span className="font-medium">{car.fuel}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vermogen</span>
                      <span className="font-medium">{formatNumber(car.power)} pk</span>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Voertuig Status</span>
                      <Badge className={getVehicleStatusConfig(car.vehicle_status).className}>
                        {getVehicleStatusConfig(car.vehicle_status).label}
                      </Badge>
                    </div>
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Publicatie Status</span>
                      <Badge variant="outline" className={getPostStatusConfig(car.post_status).className}>
                        {getPostStatusConfig(car.post_status).label}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <Card className="p-4 flex flex-col items-center text-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Bouwjaar</span>
                    <span className="font-medium">{car.year}</span>
                  </Card>
                  
                  <Card className="p-4 flex flex-col items-center text-center gap-2">
                    <Gauge className="h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Kilometerstand</span>
                    <span className="font-medium">{formatNumber(car.mileage)}</span>
                  </Card>
                  
                  <Card className="p-4 flex flex-col items-center text-center gap-2">
                    <Fuel className="h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Brandstof</span>
                    <span className="font-medium">{car.fuel}</span>
                  </Card>
                  
                  <Card className="p-4 flex flex-col items-center text-center gap-2">
                    <ArrowRight className="h-6 w-6 text-primary" />
                    <span className="text-sm text-muted-foreground">Transmissie</span>
                    <span className="font-medium">{car.transmission}</span>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="space-y-6 mt-6">
                {car.specifications && Object.keys(car.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(car.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Geen specificaties beschikbaar</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="options" className="space-y-6 mt-6">
                {car.options_accessories?.data ? (
                  <div className="space-y-6">
                    {Object.entries(car.options_accessories.data).map(([category, items]) => (
                      items && items.length > 0 && (
                        <div key={category} className="space-y-3">
                          <h4 className="font-medium capitalize">
                            {category.replace(/_/g, ' ')}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {items.map((item, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Geen opties en accessoires beschikbaar</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="highlights" className="mt-6">
                {car.highlights?.content ? (
                  <div className="prose max-w-none text-sm">
                    <div dangerouslySetInnerHTML={{ 
                      __html: car.highlights.content.replace(/\n/g, '<br>') 
                    }} />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Geen highlights beschikbaar</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="p-6 pt-0">
              <Separator className="mb-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Toegevoegd: {car.created_at ? formatDate(car.created_at) : 'Onbekend'}</span>
                <span>Gewijzigd: {car.updated_at ? formatDate(car.updated_at) : 'Onbekend'}</span>
              </div>
            </div>
          </Card>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Foto's</CardTitle>
                <CardDescription>
                  {hasImages ? `${images.length} foto's beschikbaar` : 'Geen foto\'s beschikbaar'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasImages ? (
                  <>
                    {/* Main Image */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg cursor-pointer"
                         onClick={() => setIsImageDialogOpen(true)}>
                      <img
                        src={sortedImages[activeImageIndex]?.url}
                        alt={`${car.brand} ${car.model}`}
                        className="h-full w-full object-cover hover:scale-105 transition-transform"
                      />
                      {sortedImages[activeImageIndex]?.is_main && (
                        <Badge className="absolute top-2 left-2 bg-yellow-400 text-yellow-900">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Hoofdfoto
                        </Badge>
                      )}
                      <div className="absolute inset-0 flex items-center justify-between p-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            prevImage()
                          }}
                          className="h-8 w-8 rounded-full bg-background/80"
                          disabled={sortedImages.length <= 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            nextImage()
                          }}
                          className="h-8 w-8 rounded-full bg-background/80"
                          disabled={sortedImages.length <= 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        {activeImageIndex + 1} / {sortedImages.length}
                      </div>
                    </div>
                    
                    {/* Thumbnail Grid */}
                    {sortedImages.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {sortedImages.map((image, index) => (
                          <div
                            key={image.id}
                            className={`relative aspect-video cursor-pointer overflow-hidden rounded-md transition-all ${
                              index === activeImageIndex ? "ring-2 ring-primary scale-105" : "hover:scale-105"
                            }`}
                            onClick={() => setActiveImageIndex(index)}
                          >
                            <img
                              src={image.url}
                              alt={`${car.brand} ${car.model} ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            {image.is_main && (
                              <div className="absolute top-1 left-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-lg">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Geen foto's beschikbaar</p>
                    </div>
                  </div>
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/autos/${car.id}/bewerken`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Foto's beheren
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Snelle acties</CardTitle>
                <CardDescription>Status en publicatie beheer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Publication Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Publicatie status:</label>
                  <Button
                    onClick={togglePublishStatus}
                    disabled={updatingStatus}
                    variant={car.post_status === 'published' ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {car.post_status === 'published' ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Depubliceren
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Publiceren
                      </>
                    )}
                  </Button>
                </div>
                
                <Separator />
                
                {/* Vehicle Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Voertuig status:</label>
                  <Select
                    value={car.vehicle_status}
                    onValueChange={(value: 'sold' | 'listed' | 'reserved' | 'upcoming') => updateVehicleStatus(value)}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Aankomend</SelectItem>
                      <SelectItem value="listed">Te Koop</SelectItem>
                      <SelectItem value="reserved">Gereserveerd</SelectItem>
                      <SelectItem value="sold">Verkocht</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Screen Image Dialog */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>{car.brand} {car.model} - Foto {activeImageIndex + 1}</DialogTitle>
            </DialogHeader>
            <div className="relative">
              {hasImages && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={sortedImages[activeImageIndex]?.url}
                    alt={`${car.brand} ${car.model}`}
                    className="h-full w-full object-contain"
                  />
                  {sortedImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-background/80"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-background/80"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                    {activeImageIndex + 1} / {sortedImages.length}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
