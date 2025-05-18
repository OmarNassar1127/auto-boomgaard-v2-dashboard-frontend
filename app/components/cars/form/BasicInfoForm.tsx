import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"

interface BasicInfoFormProps {
  data: {
    brand: string
    model: string
    price: string
    tax_info: string
    mileage: string
    year: string
    color: string
    transmission: string
    fuel: string
    power: string
    vehicle_status: 'sold' | 'listed' | 'reserved' | 'upcoming'
    post_status: 'draft' | 'published'
  }
  errors: Record<string, string>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectChange: (name: string, value: string) => void
}

export function BasicInfoForm({ data, errors, onChange, onSelectChange }: BasicInfoFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="brand">Merk *</Label>
          <Input
            id="brand"
            name="brand"
            value={data.brand}
            onChange={onChange}
            className={errors.brand ? "border-red-500" : ""}
            placeholder="Audi"
          />
          {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            name="model"
            value={data.model}
            onChange={onChange}
            className={errors.model ? "border-red-500" : ""}
            placeholder="A6"
          />
          {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Prijs *</Label>
          <Input
            id="price"
            name="price"
            placeholder="€54.990,00"
            value={data.price}
            onChange={onChange}
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tax_info">BTW Info</Label>
          <Input
            id="tax_info"
            name="tax_info"
            value={data.tax_info}
            onChange={onChange}
            placeholder="incl. BTW"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mileage">Kilometerstand *</Label>
          <Input
            id="mileage"
            name="mileage"
            placeholder="83.500 km"
            value={data.mileage}
            onChange={onChange}
            className={errors.mileage ? "border-red-500" : ""}
          />
          {errors.mileage && <p className="text-sm text-red-500">{errors.mileage}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Bouwjaar *</Label>
          <Input
            id="year"
            name="year"
            placeholder="2022"
            value={data.year}
            onChange={onChange}
            className={errors.year ? "border-red-500" : ""}
          />
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color">Kleur *</Label>
          <Input
            id="color"
            name="color"
            placeholder="Daytona grijs metallic"
            value={data.color}
            onChange={onChange}
            className={errors.color ? "border-red-500" : ""}
          />
          {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transmission">Transmissie *</Label>
          <Select
            value={data.transmission}
            onValueChange={(value) => onSelectChange("transmission", value)}
          >
            <SelectTrigger className={errors.transmission ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecteer transmissie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Automaat">Automaat</SelectItem>
              <SelectItem value="Handgeschakeld">Handgeschakeld</SelectItem>
              <SelectItem value="Semi-automaat">Semi-automaat</SelectItem>
              <SelectItem value="CVT">CVT</SelectItem>
            </SelectContent>
          </Select>
          {errors.transmission && <p className="text-sm text-red-500">{errors.transmission}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fuel">Brandstoftype *</Label>
          <Select
            value={data.fuel}
            onValueChange={(value) => onSelectChange("fuel", value)}
          >
            <SelectTrigger className={errors.fuel ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecteer brandstoftype" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Benzine">Benzine</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Hybride">Hybride</SelectItem>
              <SelectItem value="Benzine / Elektrisch">Benzine / Elektrisch</SelectItem>
              <SelectItem value="Elektrisch">Elektrisch</SelectItem>
              <SelectItem value="LPG">LPG</SelectItem>
            </SelectContent>
          </Select>
          {errors.fuel && <p className="text-sm text-red-500">{errors.fuel}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="power">Vermogen *</Label>
          <Input
            id="power"
            name="power"
            placeholder="367 pk"
            value={data.power}
            onChange={onChange}
            className={errors.power ? "border-red-500" : ""}
          />
          {errors.power && <p className="text-sm text-red-500">{errors.power}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vehicle_status">Voertuig Status</Label>
          <Select
            value={data.vehicle_status}
            onValueChange={(value) => onSelectChange("vehicle_status", value)}
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
        
        <div className="space-y-2">
          <Label htmlFor="post_status">Publicatie Status</Label>
          <Select
            value={data.post_status}
            onValueChange={(value) => onSelectChange("post_status", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Concept</SelectItem>
              <SelectItem value="published">Gepubliceerd</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
