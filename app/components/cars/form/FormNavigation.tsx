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
    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 w-full">
      <div className="order-2 sm:order-1">
        {!isFirstTab && (
          <Button type="button" variant="outline" onClick={onPrevious} className="w-full sm:w-auto">
            Vorige
          </Button>
        )}
      </div>
      
      <Button
        type="button"
        disabled={isSubmitting}
        onClick={isLastTab ? onSubmit : onNext}
        className="w-full sm:w-auto order-1 sm:order-2"
      >
        {isLastTab ? (
          <>
            {isSubmitting ? (
              <>
                <span className="hidden sm:inline">Bezig met opslaan...</span>
                <span className="sm:hidden">Opslaan...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Opslaan</span>
                <span className="sm:hidden">Opslaan</span>
                <Save className="ml-2 h-4 w-4" />
              </>
            )}
          </>
        ) : (
          "Volgende"
        )}
      </Button>
    </div>
  )
}
