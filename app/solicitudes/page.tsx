"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSolicitudes } from "@/hooks/use-solicitudes"
import { Search, Eye, RefreshCw, Download } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const estadoColors = {
  pendiente: "bg-yellow-100 text-yellow-800",
  en_revision: "bg-blue-100 text-blue-800",
  validada: "bg-green-100 text-green-800",
  rechazada: "bg-red-100 text-red-800",
  cancelada: "bg-gray-100 text-gray-800",
}

const estadoLabels = {
  pendiente: "Pendiente",
  en_revision: "En Revisión",
  validada: "Validada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
}

export default function SolicitudesPage() {
  const [filtros, setFiltros] = useState({
    estado: "todas",
    busqueda: "",
    telefono: "",
  })

  const {
    data: solicitudes,
    isLoading,
    refetch,
  } = useSolicitudes(filtros.estado === "todas" ? { ...filtros, estado: undefined } : filtros)

  const handleFiltroChange = (key: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Solicitudes</h2>
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Solicitudes</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>Filtra y busca solicitudes por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, cliente o número de operación..."
                  value={filtros.busqueda}
                  onChange={(e) => handleFiltroChange("busqueda", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filtros.estado} onValueChange={(value) => handleFiltroChange("estado", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_revision">En Revisión</SelectItem>
                <SelectItem value="validada">Validada</SelectItem>
                <SelectItem value="rechazada">Rechazada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Teléfono..."
              value={filtros.telefono}
              onChange={(e) => handleFiltroChange("telefono", e.target.value)}
              className="w-[150px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Solicitudes</CardTitle>
          <CardDescription>{solicitudes?.length || 0} solicitudes encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitudes?.map((solicitud) => (
                <TableRow key={solicitud.id}>
                  <TableCell className="font-medium">{solicitud.id}</TableCell>
                  <TableCell>{solicitud.clienteFinal}</TableCell>
                  <TableCell>{solicitud.telefono}</TableCell>
                  <TableCell>
                    <Badge className={estadoColors[solicitud.estado]}>{estadoLabels[solicitud.estado]}</Badge>
                  </TableCell>
                  <TableCell>{solicitud.monto ? `$${solicitud.monto.toLocaleString()}` : "N/A"}</TableCell>
                  <TableCell>
                    {format(new Date(solicitud.fechaSolicitud), "dd/MM/yyyy HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/solicitudes/${solicitud.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {solicitudes?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron solicitudes con los filtros aplicados
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
