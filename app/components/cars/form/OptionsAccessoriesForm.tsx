import { useState, useCallback } from "react"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Plus, X } from "lucide-react"

interface OptionsAccessoriesFormProps {
  data: {
    data: {
      exterieur: string[]
      infotainment: string[]
      interieur_comfort: string[]
      extra: string[]
    }
  }
  onChange: (newData: typeof data) => void
}

type OptionCategory = keyof OptionsAccessoriesFormProps['data']['data']

export function OptionsAccessoriesForm({ data, onChange }: OptionsAccessoriesFormProps) {
  const [newOptions, setNewOptions] = useState({
    exterieur: "",
    infotainment: "",
    interieur_comfort: "",
    extra: "",
  })

  const addOption = useCallback((category: OptionCategory) => {
    const value = newOptions[category].trim()
    if (value && !data.data[category].includes(value)) {
      const updatedData = {
        data: {
          ...data.data,
          [category]: [...data.data[category], value],
        }
      }
      onChange(updatedData)
      setNewOptions(prev => ({ ...prev, [category]: "" }))
    }
  }, [newOptions, data, onChange])

  const removeOption = useCallback((category: OptionCategory, index: number) => {
    const updatedData = {
      data: {
        ...data.data,
        [category]: data.data[category].filter((_, i) => i !== index),
      }
    }
    onChange(updatedData)
  }, [data, onChange])

  const handleNewOptionChange = useCallback((category: OptionCategory, value: string) => {
    setNewOptions(prev => ({ ...prev, [category]: value }))
  }, [])

  const handleKeyPress = useCallback((category: OptionCategory) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addOption(category)
    }
  }, [addOption])

  const categories = [
    { key: 'exterieur' as const, label: 'Exterieur' },
    { key: 'infotainment' as const, label: 'Infotainment' },
    { key: 'interieur_comfort' as const, label: 'Interieur & Comfort' },
    { key: 'extra' as const, label: 'Extra (Overig)' },
  ]

  return (
    <div className="space-y-8">
      {categories.map(({ key, label }) => (
        <div key={key} className="space-y-4">
          <h3 className="text-lg font-medium">{label}</h3>
          
          {/* Add new option input */}
          <div className="flex gap-2">
            <Input
              placeholder={`Voeg ${label.toLowerCase()} optie toe...`}
              value={newOptions[key]}
              onChange={(e) => handleNewOptionChange(key, e.target.value)}
              onKeyDown={handleKeyPress(key)}
            />
            <Button type="button" onClick={() => addOption(key)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Existing options */}
          <div className="flex flex-wrap gap-2">
            {data.data[key].map((option, index) => (
              <div
                key={index}
                className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
              >
                <span>{option}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => removeOption(key, index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          {data.data[key].length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nog geen {label.toLowerCase()} opties toegevoegd
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
