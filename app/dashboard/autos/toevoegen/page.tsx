"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/app/components/dashboard/header"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Checkbox } from "@/app/components/ui/checkbox"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { ArrowLeft, Save, Plus, X, Upload, Image as ImageIcon } from "lucide-react"
import { generateId } from "@/app/lib/utils"

export default function AddCarPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTab, setSelectedTab] = useState("basic")
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [carData, setCarData] = useState({
    brand: "",
    model: "",
    price: "",
    year: "",
    mileage_km: "",
    status: "Te Koop",
    is_favorite: false,
    transmission: "",
    fuel_type: "",
    power_hp: "",
    engine: "",
    doors: "",
    seats: "",
    color: "",
    body_type: "",
    emissions_g_per_km: "",
    energy_label: "",
    description: "",
    maintenance_history: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCarData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCarData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCarData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const addFeature = () => {
    if (newFeature.trim() !== "" && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addFeature()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real application, we would send data to an API
      console.log({ ...carData, features, id: generateId() })
      
      // Simulate API request
      setTimeout(() => {
        router.push("/dashboard/autos")
      }, 1000)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    if (selectedTab === "basic") setSelectedTab("details")
    else if (selectedTab === "details") setSelectedTab("features")
    else if (selectedTab === "features") setSelectedTab("description")
    else if (selectedTab === "description") handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  const prevTab = () => {
    if (selectedTab === "details") setSelectedTab("basic")
    else if (selectedTab === "features") setSelectedTab("details")
    else if (selectedTab === "description") setSelectedTab("features")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Nieuwe auto toevoegen" 
        subtitle="Voeg een nieuwe auto toe aan de inventaris"
      />
      
      <div className="flex-1 p-6 space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug naar overzicht
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Auto gegevens</CardTitle>
            <CardDescription>
              Vul de onderstaande gegevens in om een nieuwe auto toe te voegen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basisgegevens</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="features">Kenmerken</TabsTrigger>
                  <TabsTrigger value="description">Beschrijving</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Merk *</Label>
                      <Input
                        id="brand"
                        name="brand"
                        value={carData.brand}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        name="model"
                        value={carData.model}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Prijs (€) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        value={carData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={carData.status}
                        onValueChange={(value) => handleSelectChange("status", value)}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Selecteer een status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Te Koop">Te Koop</SelectItem>
                          <SelectItem value="Gereserveerd">Gereserveerd</SelectItem>
                          <SelectItem value="Verkocht">Verkocht</SelectItem>
                          <SelectItem value="In Onderhoud">In Onderhoud</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year">Bouwjaar *</Label>
                      <Input
                        id="year"
                        name="year"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        value={carData.year}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mileage_km">Kilometerstand *</Label>
                      <Input
                        id="mileage_km"
                        name="mileage_km"
                        type="number"
                        min="0"
                        value={carData.mileage_km}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmissie *</Label>
                      <Select
                        value={carData.transmission}
                        onValueChange={(value) => handleSelectChange("transmission", value)}
                      >
                        <SelectTrigger id="transmission">
                          <SelectValue placeholder="Selecteer een transmissie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Handgeschakeld">Handgeschakeld</SelectItem>
                          <SelectItem value="Automaat">Automaat</SelectItem>
                          <SelectItem value="CVT Automaat">CVT Automaat</SelectItem>
                          <SelectItem value="Semi-automaat">Semi-automaat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fuel_type">Brandstoftype *</Label>
                      <Select
                        value={carData.fuel_type}
                        onValueChange={(value) => handleSelectChange("fuel_type", value)}
                      >
                        <SelectTrigger id="fuel_type">
                          <SelectValue placeholder="Selecteer een brandstoftype" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Benzine">Benzine</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Hybride">Hybride</SelectItem>
                          <SelectItem value="Elektrisch">Elektrisch</SelectItem>
                          <SelectItem value="LPG">LPG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_favorite"
                      checked={carData.is_favorite}
                      onCheckedChange={(checked) => handleCheckboxChange("is_favorite", checked === true)}
                    />
                    <Label htmlFor="is_favorite">Markeren als favoriet</Label>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="power_hp">Vermogen (pk)</Label>
                      <Input
                        id="power_hp"
                        name="power_hp"
                        type="number"
                        min="0"
                        value={carData.power_hp}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="engine">Motor</Label>
                      <Input
                        id="engine"
                        name="engine"
                        value={carData.engine}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="doors">Aantal deuren</Label>
                      <Input
                        id="doors"
                        name="doors"
                        type="number"
                        min="0"
                        value={carData.doors}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seats">Aantal zitplaatsen</Label>
                      <Input
                        id="seats"
                        name="seats"
                        type="number"
                        min="0"
                        value={carData.seats}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="color">Kleur</Label>
                      <Input
                        id="color"
                        name="color"
                        value={carData.color}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="body_type">Carrosserie</Label>
                      <Select
                        value={carData.body_type}
                        onValueChange={(value) => handleSelectChange("body_type", value)}
                      >
                        <SelectTrigger id="body_type">
                          <SelectValue placeholder="Selecteer een carrosserie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hatchback">Hatchback</SelectItem>
                          <SelectItem value="Sedan">Sedan</SelectItem>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="Stationwagon">Stationwagon</SelectItem>
                          <SelectItem value="Coupé">Coupé</SelectItem>
                          <SelectItem value="Cabriolet">Cabriolet</SelectItem>
                          <SelectItem value="MPV">MPV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emissions_g_per_km">CO2-uitstoot (g/km)</Label>
                      <Input
                        id="emissions_g_per_km"
                        name="emissions_g_per_km"
                        type="number"
                        min="0"
                        value={carData.emissions_g_per_km}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="energy_label">Energielabel</Label>
                      <Select
                        value={carData.energy_label}
                        onValueChange={(value) => handleSelectChange("energy_label", value)}
                      >
                        <SelectTrigger id="energy_label">
                          <SelectValue placeholder="Selecteer een energielabel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="G">G</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newFeature">Voeg kenmerken toe</Label>
                      <div className="flex gap-2">
                        <Input
                          id="newFeature"
                          placeholder="Bijvoorbeeld: Airconditioning, Navigatie, etc."
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button type="button" onClick={addFeature}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Toegevoegde kenmerken</h3>
                      {features.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Nog geen kenmerken toegevoegd. Voeg kenmerken toe om de auto te beschrijven.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                            >
                              <span>{feature}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                                onClick={() => removeFeature(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-3">Voeg foto's toe</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="aspect-video flex items-center justify-center border-2 border-dashed rounded-md p-4 hover:bg-muted/50 cursor-pointer">
                        <div className="flex flex-col items-center text-center">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Sleep foto's hierheen</p>
                          <p className="text-xs text-muted-foreground">
                            Of klik om te bladeren
                          </p>
                        </div>
                      </div>
                      
                      <div className="aspect-video flex items-center justify-center border rounded-md p-2 bg-muted/50">
                        <div className="flex flex-col items-center text-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-1" />
                          <p className="text-xs text-muted-foreground">
                            Foto uploaden...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="description" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Beschrijving</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Geef een uitgebreide beschrijving van de auto..."
                        value={carData.description}
                        onChange={handleInputChange}
                        className="min-h-[150px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maintenance_history">Onderhoudshistorie</Label>
                      <Textarea
                        id="maintenance_history"
                        name="maintenance_history"
                        placeholder="Beschrijf de onderhoudshistorie van de auto..."
                        value={carData.maintenance_history}
                        onChange={handleInputChange}
                        className="min-h-[150px]"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {selectedTab !== "basic" && (
              <Button type="button" variant="outline" onClick={prevTab}>
                Vorige
              </Button>
            )}
            {selectedTab === "basic" && (
              <div></div>
            )}
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={nextTab}
              className="ml-auto"
            >
              {selectedTab === "description" ? (
                <>
                  {isSubmitting ? "Bezig met opslaan..." : "Opslaan"}
                  <Save className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Volgende"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}