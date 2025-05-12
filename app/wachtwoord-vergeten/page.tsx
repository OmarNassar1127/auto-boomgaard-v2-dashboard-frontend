"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Normaal gesproken zou hier een fetch naar de backend gaan
      setTimeout(() => {
        setIsSubmitted(true)
      }, 1000)
    } catch (err) {
      setError("Er is een fout opgetreden. Probeer het later opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Auto Boomgaard</h1>
          <p className="text-gray-500 mt-2">Beheerderspaneel</p>
        </div>
        
        <Card>
          {!isSubmitted ? (
            <>
              <CardHeader>
                <CardTitle>Wachtwoord vergeten</CardTitle>
                <CardDescription>
                  Voer uw e-mailadres in om een link te ontvangen waarmee u uw wachtwoord kunt resetten.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mailadres</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="uw@email.nl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Bezig met verzenden..." : "Reset link versturen"}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <div className="flex justify-center mb-6">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-center">E-mail verzonden!</CardTitle>
                <CardDescription className="text-center">
                  We hebben een e-mail gestuurd naar {email} met instructies om uw wachtwoord te resetten.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Controleer uw inbox en spam-folder. Als u de e-mail niet binnen 5 minuten heeft ontvangen, kunt u het opnieuw proberen.
                </p>
              </CardContent>
            </>
          )}
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/">Terug naar inloggen</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}