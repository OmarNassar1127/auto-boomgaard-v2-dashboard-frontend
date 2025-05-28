"use client"

import { useState, useEffect } from "react"
import { Header } from "@/app/components/dashboard/header"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { authAPI, type User } from "@/app/lib/api"
import { Eye, EyeOff, Key, User as UserIcon, Mail, Shield, CheckCircle } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Email change state
  const [emailData, setEmailData] = useState({
    email: '',
    password: ''
  })
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailErrors, setEmailErrors] = useState<Record<string, string>>({})
  const [showEmailPassword, setShowEmailPassword] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.user()
      setUser(response.user)
      setEmailData(prev => ({ ...prev, email: response.user.email }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordErrors({})
    setSuccess(null)
    setError(null)

    try {
      await authAPI.changePassword(passwordData)
      setSuccess('Wachtwoord succesvol gewijzigd')
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      })
    } catch (err) {
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message)
          setPasswordErrors(errorData.errors || {})
          setError(errorData.message || err.message)
        } catch {
          setError(err.message)
        }
      } else {
        setError('Er is een fout opgetreden bij het wijzigen van het wachtwoord')
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setEmailErrors({})
    setSuccess(null)
    setError(null)

    try {
      const response = await authAPI.changeEmail(emailData)
      setUser(response.user)
      setSuccess('E-mailadres succesvol gewijzigd')
      setEmailData(prev => ({ ...prev, password: '' }))
    } catch (err) {
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message)
          setEmailErrors(errorData.errors || {})
          setError(errorData.message || err.message)
        } catch {
          setError(err.message)
        }
      } else {
        setError('Er is een fout opgetreden bij het wijzigen van het e-mailadres')
      }
    } finally {
      setEmailLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Header 
          title="Instellingen" 
          subtitle="Beheer uw account instellingen"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Instellingen laden...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header 
        title="Instellingen" 
        subtitle="Beheer uw account instellingen"
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {(error || success) && (
            <Card className={error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              <CardContent className="p-4">
                <div className={`flex items-center gap-2 ${error ? "text-red-800" : "text-green-800"}`}>
                  {success && <CheckCircle className="h-4 w-4" />}
                  <p>{error || success}</p>
                </div>
              </CardContent>
            </Card>
          )}

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Algemeen
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Wachtwoord
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account informatie</CardTitle>
                <CardDescription>
                  Uw huidige account gegevens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Naam</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm">{user?.name}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Rol</Label>
                    <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">
                        {user?.role === 'admin' ? 'Beheerder' : 'Verkoper'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>E-mailadres wijzigen</CardTitle>
                <CardDescription>
                  Verander uw e-mailadres. Voor verificatie is uw wachtwoord vereist.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Nieuw e-mailadres</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={emailData.email}
                        onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        placeholder="nieuw@email.com"
                        required
                      />
                    </div>
                    {emailErrors.email && (
                      <p className="text-sm text-red-600">{emailErrors.email[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-password">Wachtwoord voor verificatie</Label>
                    <div className="relative">
                      <Input
                        id="email-password"
                        type={showEmailPassword ? "text" : "password"}
                        value={emailData.password}
                        onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
                        className="pr-10"
                        placeholder="Voer uw wachtwoord in"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowEmailPassword(!showEmailPassword)}
                      >
                        {showEmailPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {emailErrors.password && (
                      <p className="text-sm text-red-600">{emailErrors.password[0]}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={emailLoading}>
                    {emailLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Wijzigen...
                      </div>
                    ) : (
                      'E-mailadres wijzigen'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wachtwoord wijzigen</CardTitle>
                <CardDescription>
                  Verander uw wachtwoord. Zorg ervoor dat het nieuwe wachtwoord sterk en uniek is.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Huidig wachtwoord</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                        className="pr-10"
                        placeholder="Voer uw huidige wachtwoord in"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.current_password && (
                      <p className="text-sm text-red-600">{passwordErrors.current_password[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nieuw wachtwoord</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                        className="pr-10"
                        placeholder="Voer uw nieuwe wachtwoord in"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.new_password && (
                      <p className="text-sm text-red-600">{passwordErrors.new_password[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Bevestig nieuw wachtwoord</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.new_password_confirmation}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new_password_confirmation: e.target.value }))}
                        className="pr-10"
                        placeholder="Herhaal uw nieuwe wachtwoord"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.new_password_confirmation && (
                      <p className="text-sm text-red-600">{passwordErrors.new_password_confirmation[0]}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={passwordLoading}>
                      {passwordLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Wijzigen...
                        </div>
                      ) : (
                        'Wachtwoord wijzigen'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <h4 className="font-medium text-amber-800 mb-2">Tips voor een sterk wachtwoord:</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Minimaal 8 karakters lang</li>
                  <li>• Combinatie van hoofdletters en kleine letters</li>
                  <li>• Bevat cijfers en speciale tekens</li>
                  <li>• Gebruik een uniek wachtwoord dat niet hergebruikt wordt</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  )
}
