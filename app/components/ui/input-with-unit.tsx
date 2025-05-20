import * as React from "react"
import { cn } from "@/app/lib/utils"

export interface InputWithUnitProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  unit: string;
  unitClassName?: string;
  onValueChange?: (value: string) => void;
  unitPosition?: "prefix" | "suffix";
}

const InputWithUnit = React.forwardRef<HTMLInputElement, InputWithUnitProps>(
  ({ className, unit, unitClassName, onValueChange, onChange, unitPosition = "suffix", ...props }, ref) => {
    
    // Handle input change to extract only the numeric part
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Keep the original onChange behavior if provided
      if (onChange) {
        onChange(e);
      }
      
      // Extract numeric value for the custom handler
      if (onValueChange) {
        // Remove any non-numeric characters except for period/comma
        const numericValue = e.target.value.replace(/[^0-9.,]/g, '');
        onValueChange(numericValue);
      }
    };
    
    return (
      <div className="relative flex w-full">
        {unitPosition === "prefix" && (
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground",
              unitClassName
            )}
          >
            {unit}
          </div>
        )}
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            unitPosition === "prefix" ? "pl-8" : "pr-12",
            className
          )}
          ref={ref}
          onChange={handleChange}
          inputMode="numeric"
          {...props}
        />
        {unitPosition === "suffix" && (
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground",
              unitClassName
            )}
          >
            {unit}
          </div>
        )}
      </div>
    )
  }
)
InputWithUnit.displayName = "InputWithUnit"

export { InputWithUnit }
