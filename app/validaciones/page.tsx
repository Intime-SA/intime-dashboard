"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useValidaciones } from "@/hooks/use-validaciones"
import { Search, RefreshCw, CreditCard, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const estadoColors = {
  validado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800",
  pendiente: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
}

const estadoIcons = {
  validado: CheckCircle,
  rechazado: XCircle,
  pendiente: Clock,
  error: AlertTriangle,
}

export default function ValidacionesPage() {
  const [filtros, setFiltros] = useState({
    estado: "todas",
    solicitudId: "",
  })

  const {
    data: validaciones,
    isLoading,
    refetch,
  } = useValidaciones(filtros.estado === "todas" ? { ...filtros, estado: undefined } : filtros)

  const handleFiltroChange = (key: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Validaciones Mercado Pago</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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

  const stats = validaciones?.reduce(
    (acc, val) => {
      acc.total++
      acc[val.estado]++
      acc.tiempoPromedio += val.tiempoRespuesta
      return acc
    },
    { total: 0, validado: 0, rechazado: 0, pendiente: 0, error: 0, tiempoPromedio: 0 },
  )

  if (stats) {
    stats.tiempoPromedio = Math.round(stats.tiempoPromedio / stats.total)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Validaciones Mercado Pago</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Validaciones</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Consultas realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.validado || 0}</div>
            <p className="text-xs text-muted-foreground">Pagos confirmados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.rechazado || 0}</div>
            <p className="text-xs text-muted-foreground">No validadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tiempoPromedio || 0}ms</div>
            <p className="text-xs text-muted-foreground">Respuesta API</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra validaciones por estado y solicitud</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID de solicitud..."
                  value={filtros.solicitudId}
                  onChange={(e) => handleFiltroChange("solicitudId", e.target.value)}
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
                <SelectItem value="validado">Validado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Validaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Validaciones</CardTitle>
          <CardDescription>{validaciones?.length || 0} validaciones encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Solicitud</TableHead>
                <TableHead>Número Operación</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Tiempo</TableHead>
                <TableHead>Intentos</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validaciones?.map((validacion) => {
                const IconComponent = estadoIcons[validacion.estado]
                return (
                  <TableRow key={validacion.id}>
                    <TableCell className="font-medium">{validacion.id}</TableCell>
                    <TableCell>{validacion.solicitudId}</TableCell>
                    <TableCell>{validacion.numeroOperacion || "N/A"}</TableCell>
                    <TableCell>{validacion.monto ? `$${validacion.monto.toLocaleString()}` : "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <Badge className={estadoColors[validacion.estado]}>
                          {validacion.estado.charAt(0).toUpperCase() + validacion.estado.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{validacion.tiempoRespuesta}ms</TableCell>
                    <TableCell>{validacion.intentos}</TableCell>
                    <TableCell>
                      {format(new Date(validacion.fechaConsulta), "dd/MM/yyyy HH:mm", { locale: es })}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {validaciones?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron validaciones con los filtros aplicados
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
