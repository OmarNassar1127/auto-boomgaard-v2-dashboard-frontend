import { Input } from "@/app/components/ui/input"
import { InputWithUnit } from "@/app/components/ui/input-with-unit"
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
  // Create a handler for our InputWithUnit component
  const handleUnitInput = (name: string, value: string) => {
    // Create a synthetic event to pass to the onChange handler
    const syntheticEvent = {
      target: {
        name,
        value: value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

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
          <InputWithUnit
            id="torque"
            name="torque"
            placeholder="320"
            unit="nm"
            value={data.torque.replace(/[^0-9.,]/g, '')}
            onChange={onChange}
            onValueChange={(value) => handleUnitInput("torque", value + " nm")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="acceleration">Acceleratie (0-100km/h)</Label>
          <InputWithUnit
            id="acceleration"
            name="acceleration"
            placeholder="7.5"
            unit="s"
            value={data.acceleration.replace(/[^0-9.,]/g, '')}
            onChange={onChange}
            onValueChange={(value) => handleUnitInput("acceleration", value + "s")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wheelbase">Wielbasis</Label>
          <InputWithUnit
            id="wheelbase"
            name="wheelbase"
            placeholder="282"
            unit="cm"
            value={data.wheelbase.replace(/[^0-9.,]/g, '')}
            onChange={onChange}
            onValueChange={(value) => handleUnitInput("wheelbase", value + " cm")}
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
          <InputWithUnit
            id="top_speed"
            name="top_speed"
            placeholder="241"
            unit="km/h"
            value={data.top_speed.replace(/[^0-9.,]/g, '')}
            onChange={onChange}
            onValueChange={(value) => handleUnitInput("top_speed", value + "km/h")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tank_capacity">Tankinhoud</Label>
          <InputWithUnit
            id="tank_capacity"
            name="tank_capacity"
            placeholder="54"
            unit="L"
            value={data.tank_capacity.replace(/[^0-9.,]/g, '')}
            onChange={onChange}
            onValueChange={(value) => handleUnitInput("tank_capacity", value + " L")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="engine_capacity">Cilinderinhoud</Label>
          <InputWithUnit
            id="engine_capacity"
            name="engine_capacity"
            placeholder="1984"
            unit="cc"
            value={data.engine_capacity.replace(/[^0-9.,]/g, '')}
            onChange={onChange}
            onValueChange={(value) => handleUnitInput("engine_capacity", value + " cc")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight">Gewicht (leeg)</Label>
          <InputWithUnit
            id="weight"
            name="weight"
            placeholder="1460"
            unit="kg"
            value={data.weight.replace(/[^0-9.,]/g, '')}
            onChange={onChange}
            onValueChange={(value) => handleUnitInput("weight", value + " kg")}
          />
        </div>
      </div>
    </div>
  )
}
