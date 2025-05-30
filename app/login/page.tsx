"use client"

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })

  // Email validation function
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return 'Het e-mailadres is verplicht.'
    }
    
    if (!email.includes('@')) {
      return 'Voer een geldig e-mailadres in. Het ontbreekt een \'@\' teken.'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Voer een geldig e-mailadres in.'
    }
    
    return null
  }

  // Password validation function
  const validatePassword = (password: string): string | null => {
    if (!password.trim()) {
      return 'Het wachtwoord is verplicht.'
    }
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({ ...prev, [name]: value }))
    
    // Clear errors when user starts typing
    if (error) setError('')
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Real-time validation
    if (name === 'email' && value.trim()) {
      const emailError = validateEmail(value)
      if (emailError) {
        setValidationErrors(prev => ({ ...prev, email: emailError }))
      }
    }
    
    if (name === 'password' && value.trim()) {
      const passwordError = validatePassword(value)
      if (passwordError) {
        setValidationErrors(prev => ({ ...prev, password: passwordError }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setValidationErrors({})

    // Validate form before submission
    const emailError = validateEmail(credentials.email)
    const passwordError = validatePassword(credentials.password)
    
    const newValidationErrors: {[key: string]: string} = {}
    if (emailError) newValidationErrors.email = emailError
    if (passwordError) newValidationErrors.password = passwordError
    
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors)
      return
    }

    setIsLoading(true)

    try {
      await login(credentials.email, credentials.password)
      router.push('/dashboard')
    } catch (error) {
      // Handle server-side validation errors
      if (error instanceof Error) {
        const errorMessage = error.message
        
        // Check if it's a validation error from the server
        if (errorMessage.includes('e-mailadres') || errorMessage.includes('@')) {
          setValidationErrors({ email: errorMessage })
        } else {
          setError(errorMessage)
        }
      } else {
        setError('Inloggen mislukt. Probeer het opnieuw.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Auto Boomgaard Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Log in met uw beheerder account
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Inloggen</CardTitle>
            <CardDescription>
              Voer uw email en wachtwoord in om toegang te krijgen tot het dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="admin@autoboomgaard.nl"
                  disabled={isLoading}
                  className={validationErrors.email ? "border-red-500" : ""}
                />
                {validationErrors.email && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <p>{validationErrors.email}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={validationErrors.password ? "border-red-500" : ""}
                />
                {validationErrors.password && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <p>{validationErrors.password}</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Bezig met inloggen...
                  </>
                ) : (
                  'Inloggen'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Geen account?</span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/register"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-gray-50 border-gray-300"
            >
              Account aanmaken
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Voor demo doeleinden: admin@autoboomgaard.nl / password
          </p>
        </div>
      </div>
    </div>
  )
}
