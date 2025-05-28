"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/app/components/dashboard/header"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { ArrowLeft, AlertCircle } from "lucide-react"
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

export default function CarForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTab, setSelectedTab] = useState("basic")
  const [errors, setErrors] = useState<FormErrors>({})
  const [imagesPreviews, setImagesPreviews] = useState<ImagePreview[]>([])
  
  // Basic Information (fixed columns in backend)
  const [basicData, setBasicData] = useState({
    brand: "",
    model: "",
    price: 0,
    tax_info: "incl. BTW",
    mileage: 0,
    year: new Date().getFullYear(),
    color: "",
    transmission: "",
    fuel: "",
    power: 0,
    vehicle_status: "upcoming" as const,
    post_status: "draft" as const,
  })

  // Specifications (JSON column in backend)
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

  // Highlights (JSON column in backend)
  const [highlights, setHighlights] = useState({
    content: "",
  })

  // Options & Accessories (JSON column in backend)
  const [optionsAccessories, setOptionsAccessories] = useState({
    data: {
      exterieur: [] as string[],
      infotainment: [] as string[],
      interieur_comfort: [] as string[],
      extra: [] as string[],
    }
  })

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

  const handleNumberChange = useCallback((name: string, value: number) => {
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
    if (!basicData.price || basicData.price <= 0) newErrors.price = "Prijs is verplicht"
    if (!basicData.mileage || basicData.mileage < 0) newErrors.mileage = "Kilometerstand is verplicht"
    if (!basicData.year || basicData.year < 1900) newErrors.year = "Bouwjaar is verplicht"
    if (!basicData.color.trim()) newErrors.color = "Kleur is verplicht"
    if (!basicData.transmission.trim()) newErrors.transmission = "Transmissie is verplicht"
    if (!basicData.fuel.trim()) newErrors.fuel = "Brandstoftype is verplicht"
    if (!basicData.power || basicData.power <= 0) newErrors.power = "Vermogen is verplicht"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSelectedTab("basic") // Go back to first tab if validation fails
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare the car data according to our backend structure
      const carData: CarData = {
        ...basicData,
        specifications: Object.fromEntries(
          Object.entries(specifications).filter(([_, value]) => value.trim() !== "")
        ),
        highlights: highlights.content.trim() ? highlights : undefined,
        options_accessories: Object.values(optionsAccessories.data).some(arr => arr.length > 0) 
          ? optionsAccessories 
          : undefined,
      }

      // Create the car
      const response = await carsAPI.create(carData)
      const createdCar = response.data

      // Upload images if any
      if (imagesPreviews.length > 0 && createdCar.id) {
        const files = imagesPreviews.map(imgPreview => imgPreview.file)
        const mainImageIndex = imagesPreviews.findIndex(img => img.isMain)
        
        // Upload images with main image designation
        await carsAPI.uploadImages(createdCar.id, files, mainImageIndex >= 0 ? mainImageIndex : 0)
      }

      // Redirect to car list
      router.push("/dashboard/autos")
    } catch (error) {
      console.error("Error creating car:", error)
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

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header 
        title="Nieuwe auto toevoegen" 
        subtitle="Voeg een nieuwe auto toe aan de inventaris"
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Terug naar overzicht</span>
            <span className="sm:hidden">Terug</span>
          </Button>

          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Auto gegevens</CardTitle>
              <CardDescription className="text-sm">
                Vul de onderstaande gegevens in om een nieuwe auto toe te voegen
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6 md:space-y-8">
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  {/* Mobile: Scrollable tab list */}
                  <div className="w-full overflow-x-auto">
                    <TabsList className="inline-flex w-full min-w-max lg:grid lg:grid-cols-5 lg:w-full">
                      <TabsTrigger value="basic" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
                        <span className="hidden sm:inline">Basisgegevens</span>
                        <span className="sm:hidden">Basis</span>
                      </TabsTrigger>
                      <TabsTrigger value="specifications" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
                        <span className="hidden sm:inline">Specificaties</span>
                        <span className="sm:hidden">Specs</span>
                      </TabsTrigger>
                      <TabsTrigger value="options" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
                        Opties
                      </TabsTrigger>
                      <TabsTrigger value="images" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
                        <span className="hidden sm:inline">Afbeeldingen</span>
                        <span className="sm:hidden">Foto's</span>
                        {imagesPreviews.length > 0 && (
                          <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                            {imagesPreviews.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="description" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
                        <span className="hidden sm:inline">Beschrijving</span>
                        <span className="sm:hidden">Info</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="mt-4 md:mt-6">
                    <TabsContent value="basic" className="space-y-4 md:space-y-6 mt-0">
                      <BasicInfoForm
                        data={basicData}
                        errors={errors}
                        onChange={handleBasicChange}
                        onSelectChange={handleSelectChange}
                        onNumberChange={handleNumberChange}
                      />
                      {errors.submit && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="specifications" className="space-y-4 md:space-y-6 mt-0">
                      <SpecificationsForm
                        data={specifications}
                        onChange={handleSpecificationChange}
                      />
                    </TabsContent>

                    <TabsContent value="options" className="space-y-4 md:space-y-6 mt-0">
                      <OptionsAccessoriesForm
                        data={optionsAccessories}
                        onChange={setOptionsAccessories}
                      />
                    </TabsContent>

                    <TabsContent value="images" className="space-y-4 md:space-y-6 mt-0">
                      <ImageUploadForm
                        images={imagesPreviews}
                        onImagesChange={setImagesPreviews}
                      />
                    </TabsContent>

                    <TabsContent value="description" className="space-y-4 md:space-y-6 mt-0">
                      <HighlightsForm
                        data={highlights}
                        onChange={handleHighlightChange}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </form>
            </CardContent>
            <CardFooter className="p-4 md:p-6">
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
    </div>
  )
}
