"use client"

import { useState, useEffect } from "react"
import { Header } from "@/app/components/dashboard/header"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { formatDate } from "@/app/lib/utils"
import { usersAPI, type User } from "@/app/lib/api"
import { Search, UserPlus, CheckCircle, XCircle, UserCog, UserX } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await usersAPI.getAll({
        search: searchQuery || undefined,
      })
      setUsers(response.data)
      setFilteredUsers(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    // Filter users based on search query (client-side for now)
    let result = [...users]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toString().includes(query)
      )
    }

    setFilteredUsers(result)
  }, [users, searchQuery])

  const handleSearch = () => {
    // Trigger API call with search query
    fetchUsers()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const approveUser = async (id: number) => {
    try {
      await usersAPI.activate(id)
      // Refresh the users list
      await fetchUsers()
    } catch (err) {
      console.error('Error activating user:', err)
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het activeren')
    }
  }

  const deactivateUser = async (id: number) => {
    try {
      await usersAPI.deactivate(id)
      // Refresh the users list
      await fetchUsers()
    } catch (err) {
      console.error('Error deactivating user:', err)
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het deactiveren')
    }
  }

  const deleteUser = async (id: number) => {
    if (!confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
      return
    }

    try {
      await usersAPI.delete(id)
      // Refresh the users list
      await fetchUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het verwijderen')
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actief"
      case "inactive":
        return "Inactief"
      default:
        return status
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Beheerder"
      case "verkoper":
        return "Verkoper"
      default:
        return role
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Header 
          title="Gebruikers" 
          subtitle="Beheer gebruikerstoegang tot het systeem"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Gebruikers laden...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header 
        title="Gebruikers" 
        subtitle="Beheer gebruikerstoegang tot het systeem"
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-800">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    setError(null)
                    fetchUsers()
                  }}
                >
                  Opnieuw proberen
                </Button>
              </CardContent>
            </Card>
          )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op naam of e-mail..."
              className="pl-9 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button onClick={handleSearch} variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Zoeken
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nieuwe gebruiker
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gebruikerslijst</CardTitle>
            <CardDescription>
              Beheer gebruikers en hun toegangsrechten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Naam</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aangemaakt op</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {loading 
                          ? "Gebruikers laden..."
                          : "Geen gebruikers gevonden die aan de criteria voldoen."
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.id}
                        </TableCell>
                        <TableCell>
                          {user.name}
                        </TableCell>
                        <TableCell>
                          {user.email}
                        </TableCell>
                        <TableCell>
                          {getRoleText(user.role)}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                            {getStatusText(user.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.status === "inactive" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => approveUser(user.id)}
                                title="Activeren"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            {user.status === "active" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deactivateUser(user.id)}
                                title="Deactiveren"
                              >
                                <UserX className="h-4 w-4 text-orange-500" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Bewerken"
                            >
                              <UserCog className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteUser(user.id)}
                              title="Verwijderen"
                            >
                              <UserX className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inactieve gebruikers</CardTitle>
              <CardDescription>
                Gebruikers die momenteel gedeactiveerd zijn
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.filter(user => user.status === "inactive").length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  Er zijn momenteel geen inactieve gebruikers.
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredUsers
                    .filter(user => user.status === "inactive")
                    .map(user => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {getRoleText(user.role)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Aangemaakt op {formatDate(user.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                            onClick={() => approveUser(user.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activeren
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                            onClick={() => deleteUser(user.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Verwijderen
                          </Button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  )
}