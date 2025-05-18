import { Button } from "@/app/components/ui/button"
import { Save } from "lucide-react"

interface FormNavigationProps {
  currentTab: string
  isSubmitting: boolean
  onNext: () => void
  onPrevious: () => void
  onSubmit: () => void
}

const TAB_ORDER = ["basic", "specifications", "options", "images", "description"]

export function FormNavigation({ 
  currentTab, 
  isSubmitting, 
  onNext, 
  onPrevious, 
  onSubmit 
}: FormNavigationProps) {
  const currentIndex = TAB_ORDER.indexOf(currentTab)
  const isFirstTab = currentIndex === 0
  const isLastTab = currentIndex === TAB_ORDER.length - 1

  return (
    <div className="flex justify-between">
      {!isFirstTab ? (
        <Button type="button" variant="outline" onClick={onPrevious}>
          Vorige
        </Button>
      ) : (
        <div></div>
      )}
      
      <Button
        type="button"
        disabled={isSubmitting}
        onClick={isLastTab ? onSubmit : onNext}
        className="ml-auto"
      >
        {isLastTab ? (
          <>
            {isSubmitting ? "Bezig met opslaan..." : "Opslaan"}
            <Save className="ml-2 h-4 w-4" />
          </>
        ) : (
          "Volgende"
        )}
      </Button>
    </div>
  )
}
