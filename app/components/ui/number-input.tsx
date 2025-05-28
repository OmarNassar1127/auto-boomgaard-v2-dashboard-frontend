import React from 'react'
import { Input } from '@/app/components/ui/input'
import { cn } from '@/app/lib/utils'

interface NumberInputWithSuffixProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: string
  value: number | string
  onValueChange: (value: number) => void
  formatValue?: (value: number) => string
  parseValue?: (value: string) => number
}

export function NumberInputWithSuffix({
  suffix,
  value,
  onValueChange,
  formatValue,
  parseValue,
  className,
  ...props
}: NumberInputWithSuffixProps) {
  const [displayValue, setDisplayValue] = React.useState(() => {
    const numValue = typeof value === 'string' ? parseValue?.(value) ?? 0 : value
    return formatValue ? formatValue(numValue) : numValue.toString()
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)

    const numericValue = parseValue
      ? parseValue(inputValue)
      : parseInt(inputValue.replace(/[^\d]/g, '')) || 0
    onValueChange(numericValue)
  }

  const handleBlur = () => {
    const numValue = typeof value === 'string' ? parseValue?.(value.toString()) ?? 0 : value
    const formattedValue = formatValue ? formatValue(numValue) : numValue.toString()
    setDisplayValue(formattedValue)
  }

  React.useEffect(() => {
    const numValue = typeof value === 'string' ? parseValue?.(value) ?? 0 : value
    const formattedValue = formatValue ? formatValue(numValue) : numValue.toString()
    setDisplayValue(formattedValue)
  }, [value, formatValue, parseValue])

  return (
    <div className="relative">
      <Input
        {...props}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(suffix ? 'pr-12' : '', className)}
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
          {suffix}
        </div>
      )}
    </div>
  )
}

interface PriceInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number | string
  onValueChange: (value: number) => void
}

export function PriceInput({ value, onValueChange, ...props }: PriceInputProps) {
  const formatPrice = (price: number): string => {
    return price.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  const parsePrice = (priceString: string): number => {
    // Remove all non-digits
    const cleanPrice = priceString.replace(/[^\d]/g, '')
    return parseInt(cleanPrice) || 0
  }

  // Safely convert value to number
  const getNumericValue = (val: number | string): number => {
    if (typeof val === 'number') {
      return Math.round(val) // Remove decimals from numbers
    }
    
    const stringVal = val.toString().trim()
    
    // Handle empty strings
    if (!stringVal) {
      return 0
    }
    
    // If it's a decimal number string like "500000.00" from database
    if (/^\d+\.\d*$/.test(stringVal)) {
      return Math.round(parseFloat(stringVal)) // Convert to integer
    }
    
    // If it's already just integers like "500000"
    if (/^\d+$/.test(stringVal)) {
      return parseInt(stringVal) || 0
    }
    
    // Otherwise, parse out non-digits (for formatted strings like "€50.000")
    return parsePrice(stringVal)
  }

  const [displayValue, setDisplayValue] = React.useState(() => {
    const numValue = getNumericValue(value)
    return formatPrice(numValue)
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)
    
    const numericValue = parsePrice(inputValue)
    onValueChange(numericValue)
  }

  const handleBlur = () => {
    const numValue = getNumericValue(value)
    const formattedValue = formatPrice(numValue)
    setDisplayValue(formattedValue)
  }

  React.useEffect(() => {
    const numValue = getNumericValue(value)
    const formattedValue = formatPrice(numValue)
    setDisplayValue(formattedValue)
  }, [value])

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
        €
      </div>
      <Input
        {...props}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn('pl-8', props.className)}
        placeholder="50.000"
      />
    </div>
  )
}