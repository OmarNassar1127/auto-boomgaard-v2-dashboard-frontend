import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"

interface SpecificationsFormProps {
  data: {
    first_registration_date: string
    seats: string
    torque: string
    acceleration: string
    wheelbase: string
    cylinders: string
    model_date_from: string
    doors: string
    gears: string
    top_speed: string
    tank_capacity: string
    engine_capacity: string
    weight: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SpecificationsForm({ data, onChange }: SpecificationsFormProps) {
  // Helper function to handle changes with unit suffixes
  const handleUnitChange = (name: string, suffix: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const cleanValue = value.replace(/[^\d.,]/g, '') // Keep only numbers, dots, and commas
      
      // Create synthetic event with unit appended
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: cleanValue ? `${cleanValue} ${suffix}` : ''
        }
      }
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
    }
  }

  // Helper function to get display value (remove units for input)
  const getDisplayValue = (value: string): string => {
    if (!value) return ''
    // Remove common units from display value
    return value.replace(/\s*(nm|s|cm|km\/h|L|cc|kg)\s*$/i, '')
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_registration_date">Datum eerste registratie</Label>
          <Input
            id="first_registration_date"
            name="first_registration_date"
            placeholder="15-02-2019"
            value={data.first_registration_date}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seats">Aantal zitplaatsen</Label>
          <Input
            id="seats"
            name="seats"
            placeholder="5"
            value={data.seats}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="torque">Maximale koppel</Label>
          <div className="relative">
            <Input
              id="torque"
              name="torque"
              placeholder="320"
              value={getDisplayValue(data.torque)}
              onChange={handleUnitChange('torque', 'nm')}
              className="pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              nm
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="acceleration">Acceleratie (0-100km/h)</Label>
          <div className="relative">
            <Input
              id="acceleration"
              name="acceleration"
              placeholder="7.5"
              value={getDisplayValue(data.acceleration)}
              onChange={handleUnitChange('acceleration', 's')}
              className="pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              s
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wheelbase">Wielbasis</Label>
          <div className="relative">
            <Input
              id="wheelbase"
              name="wheelbase"
              placeholder="282"
              value={getDisplayValue(data.wheelbase)}
              onChange={handleUnitChange('wheelbase', 'cm')}
              className="pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              cm
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cylinders">Aantal cilinders</Label>
          <Input
            id="cylinders"
            name="cylinders"
            placeholder="4"
            value={data.cylinders}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model_date_from">Modeldatum vanaf</Label>
          <Input
            id="model_date_from"
            name="model_date_from"
            placeholder="2018"
            value={data.model_date_from}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="doors">Aantal deuren</Label>
          <Input
            id="doors"
            name="doors"
            placeholder="5"
            value={data.doors}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gears">Aantal versnellingen</Label>
          <Input
            id="gears"
            name="gears"
            placeholder="7"
            value={data.gears}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="top_speed">Topsnelheid</Label>
          <div className="relative">
            <Input
              id="top_speed"
              name="top_speed"
              placeholder="241"
              value={getDisplayValue(data.top_speed)}
              onChange={handleUnitChange('top_speed', 'km/h')}
              className="pr-16"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              km/h
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tank_capacity">Tankinhoud</Label>
          <div className="relative">
            <Input
              id="tank_capacity"
              name="tank_capacity"
              placeholder="54"
              value={getDisplayValue(data.tank_capacity)}
              onChange={handleUnitChange('tank_capacity', 'L')}
              className="pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              L
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="engine_capacity">Cilinderinhoud</Label>
          <div className="relative">
            <Input
              id="engine_capacity"
              name="engine_capacity"
              placeholder="1984"
              value={getDisplayValue(data.engine_capacity)}
              onChange={handleUnitChange('engine_capacity', 'cc')}
              className="pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              cc
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight">Gewicht (leeg)</Label>
          <div className="relative">
            <Input
              id="weight"
              name="weight"
              placeholder="1460"
              value={getDisplayValue(data.weight)}
              onChange={handleUnitChange('weight', 'kg')}
              className="pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              kg
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}