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
          <Input
            id="torque"
            name="torque"
            placeholder="320 nm"
            value={data.torque}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="acceleration">Acceleratie (0-100km/h)</Label>
          <Input
            id="acceleration"
            name="acceleration"
            placeholder="7.5s"
            value={data.acceleration}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wheelbase">Wielbasis</Label>
          <Input
            id="wheelbase"
            name="wheelbase"
            placeholder="282 cm"
            value={data.wheelbase}
            onChange={onChange}
          />
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
          <Input
            id="top_speed"
            name="top_speed"
            placeholder="241km/h"
            value={data.top_speed}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tank_capacity">Tankinhoud</Label>
          <Input
            id="tank_capacity"
            name="tank_capacity"
            placeholder="54 L"
            value={data.tank_capacity}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="engine_capacity">Cilinderinhoud</Label>
          <Input
            id="engine_capacity"
            name="engine_capacity"
            placeholder="1984 cc"
            value={data.engine_capacity}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight">Gewicht (leeg)</Label>
          <Input
            id="weight"
            name="weight"
            placeholder="1460 kg"
            value={data.weight}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}