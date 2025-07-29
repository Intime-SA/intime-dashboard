"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAnalisis } from "@/hooks/use-analisis"
import { Search, RefreshCw, Bot, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const estadoColors = {
  procesado: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  pendiente: "bg-yellow-100 text-yellow-800",
}

const estadoIcons = {
  procesado: CheckCircle,
  error: XCircle,
  pendiente: Clock,
}

export default function AnalisisPage() {
  const [filtros, setFiltros] = useState({
    estado: "todas",
    solicitudId: "",
  })

  const {
    data: analisis,
    isLoading,
    refetch,
  } = useAnalisis(filtros.estado === "todas" ? { ...filtros, estado: undefined } : filtros)

  const handleFiltroChange = (key: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Análisis GPT-O</h2>
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

  const stats = analisis?.reduce(
    (acc, ana) => {
      acc.total++
      acc[ana.estado]++
      acc.tiempoPromedio += ana.tiempoProcesamiento
      acc.tokensTotal += ana.tokens
      if (ana.confianza) {
        acc.confianzaPromedio += ana.confianza
        acc.confianzaCount++
      }
      return acc
    },
    {
      total: 0,
      procesado: 0,
      error: 0,
      pendiente: 0,
      tiempoPromedio: 0,
      tokensTotal: 0,
      confianzaPromedio: 0,
      confianzaCount: 0,
    },
  )

  if (stats) {
    stats.tiempoPromedio = Math.round(stats.tiempoPromedio / stats.total)
    stats.confianzaPromedio = stats.confianzaCount > 0 ? stats.confianzaPromedio / stats.confianzaCount : 0
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Análisis GPT-O</h2>
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
            <CardTitle className="text-sm font-medium">Total Análisis</CardTitle>
            <Bot className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Comprobantes analizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procesados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.procesado || 0}</div>
            <p className="text-xs text-muted-foreground">Análisis exitosos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confianza Promedio</CardTitle>
            <Bot className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((stats?.confianzaPromedio || 0) * 100).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Precisión del modelo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Usados</CardTitle>
            <Bot className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tokensTotal.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Consumo total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra análisis por estado y solicitud</CardDescription>
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
                <SelectItem value="procesado">Procesado</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Análisis */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Análisis</CardTitle>
          <CardDescription>{analisis?.length || 0} análisis encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Solicitud</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Confianza</TableHead>
                <TableHead>Tiempo</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analisis?.map((item) => {
                const IconComponent = estadoIcons[item.estado]
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.solicitudId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <Badge className={estadoColors[item.estado]}>
                          {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.confianza ? <Badge variant="outline">{(item.confianza * 100).toFixed(0)}%</Badge> : "N/A"}
                    </TableCell>
                    <TableCell>{item.tiempoProcesamiento}ms</TableCell>
                    <TableCell>{item.tokens}</TableCell>
                    <TableCell>{item.modelo}</TableCell>
                    <TableCell>{format(new Date(item.fechaAnalisis), "dd/MM/yyyy HH:mm", { locale: es })}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Detalle del Análisis {item.id}</DialogTitle>
                            <DialogDescription>Información completa del análisis realizado por GPT-O</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="font-medium mb-2">Comprobante Analizado</h4>
                              <Image
                                src={item.comprobante || "/placeholder.svg"}
                                alt="Comprobante"
                                width={300}
                                height={400}
                                className="w-full h-auto rounded border"
                              />
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Datos Extraídos</h4>
                                {item.datosExtraidos ? (
                                  <div className="space-y-2 text-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                      <span className="text-muted-foreground">Número Operación:</span>
                                      <span>{item.datosExtraidos.numeroOperacion || "N/A"}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <span className="text-muted-foreground">Monto:</span>
                                      <span>
                                        {item.datosExtraidos.monto
                                          ? `$${item.datosExtraidos.monto.toLocaleString()}`
                                          : "N/A"}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <span className="text-muted-foreground">Banco:</span>
                                      <span>{item.datosExtraidos.banco || "N/A"}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <span className="text-muted-foreground">Fecha:</span>
                                      <span>{item.datosExtraidos.fecha || "N/A"}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <span className="text-muted-foreground">Emisor:</span>
                                      <span>{item.datosExtraidos.emisor || "N/A"}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground text-sm">No se pudieron extraer datos</p>
                                )}
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Información Técnica</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-muted-foreground">Modelo:</span>
                                    <span>{item.modelo}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-muted-foreground">Tiempo:</span>
                                    <span>{item.tiempoProcesamiento}ms</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-muted-foreground">Tokens:</span>
                                    <span>{item.tokens}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-muted-foreground">Confianza:</span>
                                    <span>{item.confianza ? `${(item.confianza * 100).toFixed(0)}%` : "N/A"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {analisis?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron análisis con los filtros aplicados
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
