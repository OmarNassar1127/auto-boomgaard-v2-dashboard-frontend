"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/app/components/dashboard/header"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { ArrowLeft, Save, AlertCircle, RefreshCw, Star, X } from "lucide-react"
import { carsAPI, type CarData } from "@/app/lib/api"

// Import form components
import { BasicInfoForm } from "@/app/components/cars/form/BasicInfoForm"
import { SpecificationsForm } from "@/app/components/cars/form/SpecificationsForm"
import { OptionsAccessoriesForm } from "@/app/components/cars/form/OptionsAccessoriesForm"
import { ImageUploadForm, type ImagePreview } from "@/app/components/cars/form/ImageUploadForm"
import { HighlightsForm } from "@/app/components/cars/form/HighlightsForm"
import { FormNavigation } from "@/app/components/cars/form/FormNavigation"

interface FormErrors {
  [key: string]: string
}

interface EditCarState {
  car: CarData | null
  loading: boolean
  error: string | null
}

export default function EditCarPage() {
  const params = useParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTab, setSelectedTab] = useState("basic")
  const [errors, setErrors] = useState<FormErrors>({})
  const [imagesPreviews, setImagesPreviews] = useState<ImagePreview[]>([])
  
  const [state, setState] = useState<EditCarState>({
    car: null,
    loading: true,
    error: null,
  })

  const carId = params.id as string

  // Form data states
  const [basicData, setBasicData] = useState({
    brand: "",
    model: "",
    price: "",
    tax_info: "incl. BTW",
    mileage: "",
    year: "",
    color: "",
    transmission: "",
    fuel: "",
    power: "",
    vehicle_status: "upcoming" as const,
    post_status: "draft" as const,
  })

  const [specifications, setSpecifications] = useState({
    first_registration_date: "",
    seats: "",
    torque: "",
    acceleration: "",
    wheelbase: "",
    cylinders: "",
    model_date_from: "",
    doors: "",
    gears: "",
    top_speed: "",
    tank_capacity: "",
    engine_capacity: "",
    weight: "",
  })

  const [highlights, setHighlights] = useState({
    content: "",
  })

  const [optionsAccessories, setOptionsAccessories] = useState({
    data: {
      exterieur: [] as string[],
      infotainment: [] as string[],
      interieur_comfort: [] as string[],
      extra: [] as string[],
    }
  })

  // Fetch car data
  const fetchCarData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const response = await carsAPI.getById(carId)
      const car = response.data
      
      // Populate form data
      setBasicData({
        brand: car.brand || "",
        model: car.model || "",
        price: car.price || "",
        tax_info: car.tax_info || "incl. BTW",
        mileage: car.mileage || "",
        year: car.year || "",
        color: car.color || "",
        transmission: car.transmission || "",
        fuel: car.fuel || "",
        power: car.power || "",
        vehicle_status: car.vehicle_status || "upcoming",
        post_status: car.post_status || "draft",
      })

      setSpecifications({
        first_registration_date: car.specifications?.first_registration_date || "",
        seats: car.specifications?.seats || "",
        torque: car.specifications?.torque || "",
        acceleration: car.specifications?.acceleration || "",
        wheelbase: car.specifications?.wheelbase || "",
        cylinders: car.specifications?.cylinders || "",
        model_date_from: car.specifications?.model_date_from || "",
        doors: car.specifications?.doors || "",
        gears: car.specifications?.gears || "",
        top_speed: car.specifications?.top_speed || "",
        tank_capacity: car.specifications?.tank_capacity || "",
        engine_capacity: car.specifications?.engine_capacity || "",
        weight: car.specifications?.weight || "",
      })

      setHighlights({
        content: car.highlights?.content || "",
      })

      setOptionsAccessories({
        data: {
          exterieur: car.options_accessories?.data?.exterieur || [],
          infotainment: car.options_accessories?.data?.infotainment || [],
          interieur_comfort: car.options_accessories?.data?.interieur_comfort || [],
          extra: car.options_accessories?.data?.extra || [],
        }
      })

      setState({ car, loading: false, error: null })
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

  // Form handlers
  const handleBasicChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBasicData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  const handleSelectChange = useCallback((name: string, value: string) => {
    setBasicData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleSpecificationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSpecifications((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleHighlightChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setHighlights((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate required basic fields
    if (!basicData.brand.trim()) newErrors.brand = "Merk is verplicht"
    if (!basicData.model.trim()) newErrors.model = "Model is verplicht"
    if (!basicData.price.trim()) newErrors.price = "Prijs is verplicht"
    if (!basicData.mileage.trim()) newErrors.mileage = "Kilometerstand is verplicht"
    if (!basicData.year.trim()) newErrors.year = "Bouwjaar is verplicht"
    if (!basicData.color.trim()) newErrors.color = "Kleur is verplicht"
    if (!basicData.transmission.trim()) newErrors.transmission = "Transmissie is verplicht"
    if (!basicData.fuel.trim()) newErrors.fuel = "Brandstoftype is verplicht"
    if (!basicData.power.trim()) newErrors.power = "Vermogen is verplicht"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Image management handlers
  const handleSetMainImage = useCallback(async (mediaId: number) => {
    if (!state.car || isSubmitting) return

    try {
      setIsSubmitting(true)
      await carsAPI.setMainImage(state.car.id!, mediaId)
      
      // Update local state to reflect the change
      setState(prev => ({
        ...prev,
        car: prev.car ? {
          ...prev.car,
          images: {
            ...prev.car.images,
            all: prev.car.images?.all?.map(img => ({
              ...img,
              is_main: img.id === mediaId
            })) || []
          }
        } : null
      }))
    } catch (error) {
      console.error('Error setting main image:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Kon hoofdfoto niet instellen' })
    } finally {
      setIsSubmitting(false)
    }
  }, [state.car, isSubmitting])

  const handleDeleteImage = useCallback(async (mediaId: number) => {
    if (!state.car || isSubmitting) return

    // Confirm deletion
    if (!confirm('Weet je zeker dat je deze foto wilt verwijderen?')) return

    try {
      setIsSubmitting(true)
      await carsAPI.deleteImage(state.car.id!, mediaId)
      
      // Update local state to remove the deleted image
      setState(prev => ({
        ...prev,
        car: prev.car ? {
          ...prev.car,
          images: {
            ...prev.car.images,
            all: prev.car.images?.all?.filter(img => img.id !== mediaId) || []
          }
        } : null
      }))
    } catch (error) {
      console.error('Error deleting image:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Kon foto niet verwijderen' })
    } finally {
      setIsSubmitting(false)
    }
  }, [state.car, isSubmitting])

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSelectedTab("basic") // Go back to first tab if validation fails
      return
    }

    if (!state.car) return

    setIsSubmitting(true)

    try {
      // Prepare the car data according to our backend structure
      const carData: Partial<CarData> = {
        ...basicData,
        specifications: Object.fromEntries(
          Object.entries(specifications).filter(([_, value]) => value.trim() !== "")
        ),
        highlights: highlights.content.trim() ? highlights : undefined,
        options_accessories: Object.values(optionsAccessories.data).some(arr => arr.length > 0) 
          ? optionsAccessories 
          : undefined,
      }

      // Update the car
      await carsAPI.update(state.car.id!, carData)

      // Upload new images if any
      if (imagesPreviews.length > 0 && state.car.id) {
        const files = imagesPreviews.map(imgPreview => imgPreview.file)
        const mainImageIndex = imagesPreviews.findIndex(img => img.isMain)
        
        // Upload images with main image designation
        await carsAPI.uploadImages(state.car.id!, files, mainImageIndex >= 0 ? mainImageIndex : undefined)
      }

      // Redirect to car detail
      router.push(`/dashboard/autos/${state.car.id}`)
    } catch (error) {
      console.error("Error updating car:", error)
      setErrors({ submit: error instanceof Error ? error.message : "Er is een fout opgetreden" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    if (selectedTab === "basic") {
      // Validate basic fields before proceeding
      if (validateForm()) {
        setSelectedTab("specifications")
      }
    } else if (selectedTab === "specifications") setSelectedTab("options")
    else if (selectedTab === "options") setSelectedTab("images")
    else if (selectedTab === "images") setSelectedTab("description")
    else if (selectedTab === "description") handleSubmit()
  }

  const prevTab = () => {
    if (selectedTab === "specifications") setSelectedTab("basic")
    else if (selectedTab === "options") setSelectedTab("specifications")
    else if (selectedTab === "images") setSelectedTab("options")
    else if (selectedTab === "description") setSelectedTab("images")
  }

  // Loading state
  if (state.loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Auto bewerken" subtitle="Gegevens worden geladen..." />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
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
        <Header title="Auto bewerken" subtitle="Er is een fout opgetreden" />
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title={`Bewerken: ${state.car.brand} ${state.car.model}`} 
        subtitle={`Auto ID: #${state.car.id}`}
      />
      
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar details
          </Button>
          
          <div className="flex gap-2">
            <Badge variant="outline">
              {state.car.vehicle_status === 'upcoming' ? 'Aankomend' :
               state.car.vehicle_status === 'listed' ? 'Te Koop' :
               state.car.vehicle_status === 'reserved' ? 'Gereserveerd' :
               'Verkocht'}
            </Badge>
            <Badge variant="outline">
              {state.car.post_status === 'published' ? 'Gepubliceerd' : 'Concept'}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Auto bewerken</CardTitle>
            <CardDescription>
              Wijzig de gegevens van {state.car.brand} {state.car.model}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basisgegevens</TabsTrigger>
                  <TabsTrigger value="specifications">Specificaties</TabsTrigger>
                  <TabsTrigger value="options">Opties</TabsTrigger>
                  <TabsTrigger value="images">
                    Afbeeldingen
                    {imagesPreviews.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        +{imagesPreviews.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="description">Beschrijving</TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                  <TabsContent value="basic" className="space-y-6">
                    <BasicInfoForm
                      data={basicData}
                      errors={errors}
                      onChange={handleBasicChange}
                      onSelectChange={handleSelectChange}
                    />
                    {errors.submit && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <p className="text-sm text-red-600">{errors.submit}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="specifications" className="space-y-6">
                    <SpecificationsForm
                      data={specifications}
                      onChange={handleSpecificationChange}
                    />
                  </TabsContent>

                  <TabsContent value="options" className="space-y-6">
                    <OptionsAccessoriesForm
                      data={optionsAccessories}
                      onChange={setOptionsAccessories}
                    />
                  </TabsContent>

                  <TabsContent value="images" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Bestaande foto's</CardTitle>
                          <CardDescription>
                            {state.car.images?.all?.length || 0} foto's beschikbaar - Klik op een foto om deze als hoofdfoto in te stellen
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {state.car.images?.all && state.car.images.all.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                              {state.car.images.all.map((image) => (
                                <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                                  <img
                                    src={image.url}
                                    alt="Car image"
                                    className="w-full h-full object-cover"
                                  />
                                  
                                  {/* Hover overlay with actions */}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute top-2 right-2 flex gap-1">
                                      <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => handleSetMainImage(image.id)}
                                        title="Instellen als hoofdfoto"
                                        disabled={isSubmitting}
                                      >
                                        <Star className={`h-3 w-3 ${image.is_main ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => handleDeleteImage(image.id)}
                                        title="Foto verwijderen"
                                        disabled={isSubmitting}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {/* Main image badge */}
                                  {image.is_main && (
                                    <Badge className="absolute top-2 left-2 bg-yellow-400 text-yellow-900">
                                      <Star className="h-3 w-3 mr-1 fill-current" />
                                      Hoofdfoto
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground">Geen bestaande foto's</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Nieuwe foto's toevoegen</CardTitle>
                          <CardDescription>
                            Upload extra foto's voor deze auto
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ImageUploadForm
                            images={imagesPreviews}
                            onImagesChange={setImagesPreviews}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="description" className="space-y-6">
                    <HighlightsForm
                      data={highlights}
                      onChange={handleHighlightChange}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter>
            <FormNavigation
              currentTab={selectedTab}
              isSubmitting={isSubmitting}
              onNext={nextTab}
              onPrevious={prevTab}
              onSubmit={handleSubmit}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
