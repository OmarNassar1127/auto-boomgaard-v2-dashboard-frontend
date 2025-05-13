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
import mockData from "@/app/data/mockData.json"
import { Search, UserPlus, CheckCircle, XCircle, MoreHorizontal, UserCog } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    // In een echte applicatie zouden we hier data ophalen van een API
    setUsers(mockData.users)
    setFilteredUsers(mockData.users)
  }, [])

  useEffect(() => {
    let result = [...users]

    // Zoeken
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query)
      )
    }

    setFilteredUsers(result)
  }, [users, searchQuery])

  const approveUser = (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: "active" } : user
      )
    )
  }

  const rejectUser = (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: "inactive" } : user
      )
    )
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
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
      case "pending":
        return "In afwachting"
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Gebruikers" 
        subtitle="Beheer gebruikerstoegang tot het systeem"
      />
      
      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoeken op naam of e-mail..."
              className="pl-9 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
                        Geen gebruikers gevonden die aan de criteria voldoen.
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
                            {user.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => approveUser(user.id)}
                                  title="Goedkeuren"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => rejectUser(user.id)}
                                  title="Afkeuren"
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedUser(user)
                                setUserModalOpen(true)
                              }}
                              title="Bewerken"
                            >
                              <UserCog className="h-4 w-4" />
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
                  <CardTitle>Goedkeuring in behandeling</CardTitle>
                  <CardDescription>
                    Gebruikers die wachten op goedkeuring om toegang te krijgen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredUsers.filter(user => user.status === "pending").length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">
                      Er zijn momenteel geen gebruikers die wachten op goedkeuring.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {filteredUsers
                        .filter(user => user.status === "pending")
                        .map(user => (
                          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{user.name}</h4>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground">
                                Aangevraagd op {formatDate(user.created_at)}
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
                                Goedkeuren
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                                onClick={() => rejectUser(user.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Afkeuren
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
  )
}