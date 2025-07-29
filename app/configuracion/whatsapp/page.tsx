"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useConfigWhatsApp, useUpdateConfigWhatsApp, useTestConexionWhatsApp } from "@/hooks/use-whatsapp-config"
import { Phone, Save, TestTube, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function ConfigWhatsAppPage() {
  const { data: config, isLoading } = useConfigWhatsApp()
  const updateConfig = useUpdateConfigWhatsApp()
  const testConexion = useTestConexionWhatsApp()

  const [formData, setFormData] = useState({
    numero: "",
    proveedor: "wati" as "wati" | "twilio",
    apiKey: "",
    webhookUrl: "",
  })

  // Update form when config loads
  useState(() => {
    if (config) {
      setFormData({
        numero: config.numero,
        proveedor: config.proveedor,
        apiKey: config.apiKey,
        webhookUrl: config.webhookUrl,
      })
    }
  })

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    updateConfig.mutate(formData)
  }

  const handleTest = () => {
    testConexion.mutate()
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Configuración WhatsApp</h2>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
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
          <h2 className="text-3xl font-bold tracking-tight">Configuración WhatsApp</h2>
        </div>
      </div>

      {/* Estado Actual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Estado de Conexión
          </CardTitle>
          <CardDescription>Estado actual de la integración con WhatsApp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {config?.estado === "conectado" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : config?.estado === "error" ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <Badge
                  variant={
                    config?.estado === "conectado"
                      ? "default"
                      : config?.estado === "error"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {config?.estado === "conectado" ? "Conectado" : config?.estado === "error" ? "Error" : "Desconectado"}
                </Badge>
              </div>

              {config?.ultimaConexion && (
                <div className="text-sm text-muted-foreground">
                  Última conexión: {format(new Date(config.ultimaConexion), "dd/MM/yyyy HH:mm", { locale: es })}
                </div>
              )}
            </div>

            <Button variant="outline" onClick={handleTest} disabled={testConexion.isLoading}>
              {testConexion.isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Probar Conexión
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuración */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Proveedor</CardTitle>
          <CardDescription>Configura los datos de conexión con tu proveedor de WhatsApp</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Número de WhatsApp</label>
              <Input
                placeholder="+5491123456789"
                value={formData.numero}
                onChange={(e) => handleInputChange("numero", e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Número asociado a tu cuenta de WhatsApp Business</p>
            </div>

            <div>
              <label className="text-sm font-medium">Proveedor</label>
              <Select value={formData.proveedor} onValueChange={(value) => handleInputChange("proveedor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wati">WATI</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">API Key</label>
            <Input
              type="password"
              placeholder="Tu API Key del proveedor"
              value={formData.apiKey}
              onChange={(e) => handleInputChange("apiKey", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Clave de API proporcionada por {formData.proveedor === "wati" ? "WATI" : "Twilio"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Webhook URL</label>
            <Input
              placeholder="https://tu-dominio.com/api/webhook/whatsapp"
              value={formData.webhookUrl}
              onChange={(e) => handleInputChange("webhookUrl", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">URL donde el proveedor enviará los mensajes recibidos</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={updateConfig.isLoading}>
              {updateConfig.isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Guardar Configuración
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mensajes Automáticos */}
      <Card>
        <CardHeader>
          <CardTitle>Mensajes Automáticos</CardTitle>
          <CardDescription>Configura las respuestas automáticas del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Mensaje de Recepción</label>
            <Input
              value="Gracias, recibimos tu comprobante. Estamos validando tu pago y te avisaremos pronto."
              readOnly
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">Se envía automáticamente al recibir un comprobante</p>
          </div>

          <div>
            <label className="text-sm font-medium">Mensaje de Validación Exitosa</label>
            <Input
              value="Tu pago fue validado correctamente, gracias por operar con nosotros."
              readOnly
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">Se envía cuando el pago es validado exitosamente</p>
          </div>

          <div>
            <label className="text-sm font-medium">Mensaje de Rechazo</label>
            <Input
              value="No pudimos validar tu pago, por favor revisa y reenvía el comprobante."
              readOnly
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">Se envía cuando el pago no puede ser validado</p>
          </div>
        </CardContent>
      </Card>

      {/* Información Técnica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
          <CardDescription>Detalles técnicos para la integración</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Webhook Endpoint:</span>
              <p className="text-muted-foreground">/api/webhook/whatsapp</p>
            </div>
            <div>
              <span className="font-medium">Método HTTP:</span>
              <p className="text-muted-foreground">POST</p>
            </div>
            <div>
              <span className="font-medium">Content-Type:</span>
              <p className="text-muted-foreground">application/json</p>
            </div>
            <div>
              <span className="font-medium">Timeout:</span>
              <p className="text-muted-foreground">30 segundos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
