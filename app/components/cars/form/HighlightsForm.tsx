import { Textarea } from "@/app/components/ui/textarea"
import { Label } from "@/app/components/ui/label"

interface HighlightsFormProps {
  data: {
    content: string
  }
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function HighlightsForm({ data, onChange }: HighlightsFormProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="highlights" className="text-sm font-medium">Highlights & Opmerkingen</Label>
        <Textarea
          id="highlights"
          name="content"
          placeholder="**Highlights:** - 1e Eigenaar - 19&quot; RS velgen - Automatisch inparkeren..."
          value={data.content}
          onChange={onChange}
          className="min-h-[150px] md:min-h-[200px]"
        />
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Gebruik markdown voor opmaak (bijvoorbeeld **vetgedrukt** voor dikgedrukte tekst)</p>
          <div className="hidden sm:block">
            <p>Voorbeelden van formatting:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>**tekst** voor vetgedrukte tekst</li>
              <li>*tekst* voor cursieve tekst</li>
              <li>- item voor een lijst item</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
