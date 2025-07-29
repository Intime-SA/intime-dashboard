"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useClientes } from "@/hooks/use-dashboard"
import { Search, RefreshCw, Users, Phone, MessageSquare, Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ClientesPage() {
  const [busqueda, setBusqueda] = useState("")
  const { data: clientes, isLoading, refetch } = useClientes()

  const clientesFiltrados = clientes?.filter(
    (cliente) => cliente.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || cliente.telefono.includes(busqueda),
  )

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const stats = clientes?.reduce(
    (acc, cliente) => {
      acc.total++
      acc.totalSolicitudes += cliente.totalSolicitudes
      acc.totalValidadas += cliente.solicitudesValidadas
      return acc
    },
    { total: 0, totalSolicitudes: 0, totalValidadas: 0 },
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Clientes únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes Totales</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSolicitudes || 0}</div>
            <p className="text-xs text-muted-foreground">Todas las solicitudes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
            <Badge className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalSolicitudes ? ((stats.totalValidadas / stats.totalSolicitudes) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Solicitudes validadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Clientes</CardTitle>
          <CardDescription>Busca clientes por nombre o teléfono</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>{clientesFiltrados?.length || 0} clientes encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Total Solicitudes</TableHead>
                <TableHead>Validadas</TableHead>
                <TableHead>Tasa Éxito</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados?.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nombre || "Sin nombre"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {cliente.telefono}
                    </div>
                  </TableCell>
                  <TableCell>{cliente.totalSolicitudes}</TableCell>
                  <TableCell>{cliente.solicitudesValidadas}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {((cliente.solicitudesValidadas / cliente.totalSolicitudes) * 100).toFixed(0)}%
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(cliente.ultimaActividad), "dd/MM/yyyy HH:mm", { locale: es })}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalle del Cliente</DialogTitle>
                          <DialogDescription>
                            Información completa del cliente {cliente.nombre || cliente.telefono}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                              <p className="font-medium">{cliente.nombre || "Sin nombre"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                              <p className="font-medium">{cliente.telefono}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Total Solicitudes</label>
                              <p className="font-medium">{cliente.totalSolicitudes}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Solicitudes Validadas</label>
                              <p className="font-medium">{cliente.solicitudesValidadas}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Tasa de Éxito</label>
                              <p className="font-medium">
                                {((cliente.solicitudesValidadas / cliente.totalSolicitudes) * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Última Actividad</label>
                              <p className="font-medium">
                                {format(new Date(cliente.ultimaActividad), "dd/MM/yyyy HH:mm", { locale: es })}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">Acciones Rápidas</h4>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Enviar Mensaje
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Solicitudes
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {clientesFiltrados?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron clientes con la búsqueda aplicada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
