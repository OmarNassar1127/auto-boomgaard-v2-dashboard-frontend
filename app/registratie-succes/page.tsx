"use client"

import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Auto Boomgaard</h1>
          <p className="text-gray-500 mt-2">Beheerderspaneel</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center">Registratie succesvol!</CardTitle>
            <CardDescription className="text-center">
              Uw aanvraag is succesvol ingediend en wacht op goedkeuring.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Een beheerder zal uw account binnenkort goedkeuren. U ontvangt een e-mail zodra uw account is geactiveerd.
            </p>
            <p className="text-sm text-muted-foreground">
              Als u vragen heeft, neem dan contact op met de beheerder via support@autoboomgaard.nl
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Terug naar inloggen</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}