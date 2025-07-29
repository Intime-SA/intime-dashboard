"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMensajes, useEnviarMensaje } from "@/hooks/use-mensajes"
import { Send, RefreshCw, ImageIcon, Phone } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"

export default function MensajesPage() {
  const [filtros, setFiltros] = useState({
    tipo: "todos",
    telefono: "",
  })
  const [nuevoMensaje, setNuevoMensaje] = useState({
    telefono: "",
    mensaje: "",
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    data: mensajes,
    isLoading,
    refetch,
  } = useMensajes(filtros.tipo === "todos" ? { ...filtros, tipo: undefined } : filtros)
  const enviarMensaje = useEnviarMensaje()

  const handleFiltroChange = (key: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [key]: value }))
  }

  const handleEnviarMensaje = () => {
    if (nuevoMensaje.telefono && nuevoMensaje.mensaje) {
      enviarMensaje.mutate(nuevoMensaje, {
        onSuccess: () => {
          setNuevoMensaje({ telefono: "", mensaje: "" })
          setDialogOpen(false)
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Mensajes WhatsApp</h2>
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
                <Skeleton key={i} className="h-20 w-full" />
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
          <h2 className="text-3xl font-bold tracking-tight">Mensajes WhatsApp</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Enviar Mensaje
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar Mensaje Manual</DialogTitle>
                <DialogDescription>Envía un mensaje personalizado a un cliente</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input
                    placeholder="+5491123456789"
                    value={nuevoMensaje.telefono}
                    onChange={(e) => setNuevoMensaje((prev) => ({ ...prev, telefono: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Mensaje</label>
                  <Textarea
                    placeholder="Escribe tu mensaje aquí..."
                    value={nuevoMensaje.mensaje}
                    onChange={(e) => setNuevoMensaje((prev) => ({ ...prev, mensaje: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleEnviarMensaje}
                  disabled={!nuevoMensaje.telefono || !nuevoMensaje.mensaje || enviarMensaje.isLoading}
                >
                  {enviarMensaje.isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Enviar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra mensajes por tipo y teléfono</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por teléfono..."
                  value={filtros.telefono}
                  onChange={(e) => handleFiltroChange("telefono", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filtros.tipo} onValueChange={(value) => handleFiltroChange("tipo", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="recibido">Recibidos</SelectItem>
                <SelectItem value="enviado">Enviados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversaciones</CardTitle>
          <CardDescription>{mensajes?.length || 0} mensajes encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {mensajes?.map((mensaje) => (
              <div key={mensaje.id} className={`flex ${mensaje.tipo === "enviado" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    mensaje.tipo === "enviado" ? "bg-blue-500 text-white" : "bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={mensaje.tipo === "enviado" ? "secondary" : "default"}>
                        {mensaje.tipo === "enviado" ? "Enviado" : "Recibido"}
                      </Badge>
                      {mensaje.tieneArchivo && <ImageIcon className="h-4 w-4" />}
                    </div>
                    <span
                      className={`text-xs ${mensaje.tipo === "enviado" ? "text-blue-100" : "text-muted-foreground"}`}
                    >
                      {format(new Date(mensaje.fecha), "dd/MM HH:mm", { locale: es })}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">{mensaje.telefono}</div>

                    {mensaje.archivo && (
                      <div className="border rounded p-2 bg-white/10">
                        <Image
                          src={mensaje.archivo.url || "/placeholder.svg"}
                          alt="Archivo adjunto"
                          width={200}
                          height={150}
                          className="rounded"
                        />
                        <p className="text-xs mt-1">{mensaje.archivo.nombre}</p>
                      </div>
                    )}

                    <p className="text-sm">{mensaje.mensaje}</p>

                    {mensaje.solicitudId && (
                      <div className="text-xs">
                        <Badge variant="outline" className="text-xs">
                          Solicitud: {mensaje.solicitudId}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mensajes?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron mensajes con los filtros aplicados
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
