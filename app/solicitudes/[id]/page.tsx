"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSolicitud, useCambiarEstadoSolicitud, useReanalizar, useRevalidar } from "@/hooks/use-solicitudes"
import { ArrowLeft, Download, RefreshCw, Bot, CreditCard, CheckCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"

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

export default function SolicitudDetailPage({ params }: { params: { id: string } }) {
  const [nuevoEstado, setNuevoEstado] = useState("")
  const [notas, setNotas] = useState("")

  const { data: solicitud, isLoading } = useSolicitud(params.id)
  const cambiarEstado = useCambiarEstadoSolicitud()
  const reanalizar = useReanalizar()
  const revalidar = useRevalidar()

  const handleCambiarEstado = () => {
    if (nuevoEstado && solicitud) {
      cambiarEstado.mutate({
        id: solicitud.id,
        estado: nuevoEstado as any,
        notas,
      })
      setNuevoEstado("")
      setNotas("")
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!solicitud) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Solicitud no encontrada</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <Button variant="outline" size="sm" asChild>
            <Link href="/solicitudes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Solicitud {solicitud.id}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Datos básicos de la solicitud</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cliente Final</label>
                <p className="font-medium">{solicitud.clienteFinal}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                <p className="font-medium">{solicitud.telefono}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <Badge className={estadoColors[solicitud.estado]}>{estadoLabels[solicitud.estado]}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha Solicitud</label>
                <p className="font-medium">
                  {format(new Date(solicitud.fechaSolicitud), "dd/MM/yyyy HH:mm", { locale: es })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Monto Detectado</label>
                <p className="font-medium">{solicitud.monto ? `$${solicitud.monto.toLocaleString()}` : "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Monto Esperado</label>
                <p className="font-medium">
                  {solicitud.montoEsperado ? `$${solicitud.montoEsperado.toLocaleString()}` : "N/A"}
                </p>
              </div>
            </div>

            {solicitud.notas && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notas</label>
                <p className="text-sm bg-muted p-2 rounded">{solicitud.notas}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comprobante */}
        <Card>
          <CardHeader>
            <CardTitle>Comprobante</CardTitle>
            <CardDescription>Imagen del comprobante recibido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <Image
                  src={solicitud.comprobante.url || "/placeholder.svg"}
                  alt="Comprobante de pago"
                  width={300}
                  height={400}
                  className="w-full h-auto rounded"
                />
              </div>
              <div className="text-sm text-muted-foreground">Archivo: {solicitud.comprobante.nombre}</div>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Descargar Comprobante
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Análisis GPT-O */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Análisis GPT-O
            </CardTitle>
            <CardDescription>Extracción automática de datos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado del Análisis</span>
              <Badge
                variant={
                  solicitud.analisisGPT.estado === "procesado"
                    ? "default"
                    : solicitud.analisisGPT.estado === "error"
                      ? "destructive"
                      : "secondary"
                }
              >
                {solicitud.analisisGPT.estado === "procesado"
                  ? "Completado"
                  : solicitud.analisisGPT.estado === "error"
                    ? "Error"
                    : "Pendiente"}
              </Badge>
            </div>

            {solicitud.analisisGPT.datos && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Número Operación:</span>
                    <p className="font-medium">{solicitud.analisisGPT.datos.numeroOperacion || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monto:</span>
                    <p className="font-medium">
                      {solicitud.analisisGPT.datos.monto
                        ? `$${solicitud.analisisGPT.datos.monto.toLocaleString()}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Banco:</span>
                    <p className="font-medium">{solicitud.analisisGPT.datos.banco || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fecha:</span>
                    <p className="font-medium">{solicitud.analisisGPT.datos.fecha || "N/A"}</p>
                  </div>
                </div>

                {solicitud.analisisGPT.confianza && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Confianza:</span>
                    <Badge variant="outline">{(solicitud.analisisGPT.confianza * 100).toFixed(0)}%</Badge>
                  </div>
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => reanalizar.mutate(solicitud.id)}
              disabled={reanalizar.isLoading}
              className="w-full"
            >
              {reanalizar.isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Bot className="h-4 w-4 mr-2" />
              )}
              Reanalizar Comprobante
            </Button>
          </CardContent>
        </Card>

        {/* Validación Mercado Pago */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Validación Mercado Pago
            </CardTitle>
            <CardDescription>Estado de la validación con MP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado Validación</span>
              <Badge
                variant={
                  solicitud.validacionMP.estado === "validado"
                    ? "default"
                    : solicitud.validacionMP.estado === "rechazado"
                      ? "destructive"
                      : "secondary"
                }
              >
                {solicitud.validacionMP.estado === "validado"
                  ? "Validado"
                  : solicitud.validacionMP.estado === "rechazado"
                    ? "Rechazado"
                    : "Pendiente"}
              </Badge>
            </div>

            {solicitud.validacionMP.respuesta && (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Respuesta MP:</span>
                  <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                    {JSON.stringify(solicitud.validacionMP.respuesta, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {solicitud.validacionMP.fechaValidacion && (
              <div className="text-sm">
                <span className="text-muted-foreground">Fecha Validación:</span>
                <p className="font-medium">
                  {format(new Date(solicitud.validacionMP.fechaValidacion), "dd/MM/yyyy HH:mm", { locale: es })}
                </p>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => revalidar.mutate(solicitud.id)}
              disabled={revalidar.isLoading}
              className="w-full"
            >
              {revalidar.isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              Revalidar con MP
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Cambiar Estado */}
      <Card>
        <CardHeader>
          <CardTitle>Cambiar Estado</CardTitle>
          <CardDescription>Modifica manualmente el estado de la solicitud</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar nuevo estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_revision">En Revisión</SelectItem>
                <SelectItem value="validada">Validada</SelectItem>
                <SelectItem value="rechazada">Rechazada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Notas adicionales (opcional)"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="md:col-span-2"
            />
          </div>
          <Button onClick={handleCambiarEstado} disabled={!nuevoEstado || cambiarEstado.isLoading}>
            {cambiarEstado.isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Cambiar Estado
          </Button>
        </CardContent>
      </Card>

      {/* Historial */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Eventos</CardTitle>
          <CardDescription>Registro completo de acciones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {solicitud.historial.map((evento, index) => (
              <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{evento.accion}</p>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(evento.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Por: {evento.usuario}</p>
                  {evento.detalles && <p className="text-sm mt-1">{evento.detalles}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
