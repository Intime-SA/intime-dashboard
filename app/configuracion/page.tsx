"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { useConfigGeneral, useUpdateConfigGeneral } from "@/hooks/use-config-general"
import { Save, RefreshCw, Settings, Building, Clock, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ConfiguracionPage() {
  const { data: config, isLoading } = useConfigGeneral()
  const updateConfig = useUpdateConfigGeneral()

  const [formData, setFormData] = useState({
    empresa: {
      nombre: "",
      email: "",
      telefono: "",
    },
    sistema: {
      timeoutGPT: 30,
      timeoutMP: 15,
      reintentos: 3,
      notificaciones: true,
    },
    limites: {
      solicitudesDiarias: 1000,
      analisisMensual: 5000,
      validacionesMensual: 10000,
    },
  })

  // Update form when config loads
  useState(() => {
    if (config) {
      setFormData(config)
    }
  })

  const handleInputChange = (section: string, key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleSave = () => {
    updateConfig.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Configuración General</h2>
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Configuración General</h2>
        </div>
        <Button onClick={handleSave} disabled={updateConfig.isLoading}>
          {updateConfig.isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Guardar Cambios
        </Button>
      </div>

      {/* Información de la Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Información de la Empresa
          </CardTitle>
          <CardDescription>Datos básicos de tu empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre de la Empresa</label>
              <Input
                value={formData.empresa.nombre}
                onChange={(e) => handleInputChange("empresa", "nombre", e.target.value)}
                placeholder="Mi Empresa S.A."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email de Contacto</label>
              <Input
                type="email"
                value={formData.empresa.email}
                onChange={(e) => handleInputChange("empresa", "email", e.target.value)}
                placeholder="admin@miempresa.com"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Teléfono de Contacto</label>
            <Input
              value={formData.empresa.telefono}
              onChange={(e) => handleInputChange("empresa", "telefono", e.target.value)}
              placeholder="+5491123456789"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuración del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración del Sistema
          </CardTitle>
          <CardDescription>Parámetros técnicos y timeouts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Timeout GPT-O (segundos)</label>
              <Input
                type="number"
                value={formData.sistema.timeoutGPT}
                onChange={(e) => handleInputChange("sistema", "timeoutGPT", Number.parseInt(e.target.value))}
                min="10"
                max="120"
              />
              <p className="text-xs text-muted-foreground mt-1">Tiempo máximo para análisis de comprobantes</p>
            </div>
            <div>
              <label className="text-sm font-medium">Timeout Mercado Pago (segundos)</label>
              <Input
                type="number"
                value={formData.sistema.timeoutMP}
                onChange={(e) => handleInputChange("sistema", "timeoutMP", Number.parseInt(e.target.value))}
                min="5"
                max="60"
              />
              <p className="text-xs text-muted-foreground mt-1">Tiempo máximo para validaciones</p>
            </div>
            <div>
              <label className="text-sm font-medium">Número de Reintentos</label>
              <Input
                type="number"
                value={formData.sistema.reintentos}
                onChange={(e) => handleInputChange("sistema", "reintentos", Number.parseInt(e.target.value))}
                min="1"
                max="10"
              />
              <p className="text-xs text-muted-foreground mt-1">Reintentos automáticos en caso de error</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Notificaciones Push</label>
              <p className="text-xs text-muted-foreground">Recibir notificaciones en tiempo real</p>
            </div>
            <Switch
              checked={formData.sistema.notificaciones}
              onCheckedChange={(checked) => handleInputChange("sistema", "notificaciones", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Límites y Cuotas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Límites y Cuotas
          </CardTitle>
          <CardDescription>Límites de uso del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Solicitudes Diarias</label>
              <Input
                type="number"
                value={formData.limites.solicitudesDiarias}
                onChange={(e) => handleInputChange("limites", "solicitudesDiarias", Number.parseInt(e.target.value))}
                min="100"
                max="10000"
              />
              <p className="text-xs text-muted-foreground mt-1">Máximo de solicitudes por día</p>
            </div>
            <div>
              <label className="text-sm font-medium">Análisis Mensuales</label>
              <Input
                type="number"
                value={formData.limites.analisisMensual}
                onChange={(e) => handleInputChange("limites", "analisisMensual", Number.parseInt(e.target.value))}
                min="1000"
                max="50000"
              />
              <p className="text-xs text-muted-foreground mt-1">Máximo de análisis GPT por mes</p>
            </div>
            <div>
              <label className="text-sm font-medium">Validaciones Mensuales</label>
              <Input
                type="number"
                value={formData.limites.validacionesMensual}
                onChange={(e) => handleInputChange("limites", "validacionesMensual", Number.parseInt(e.target.value))}
                min="1000"
                max="100000"
              />
              <p className="text-xs text-muted-foreground mt-1">Máximo de validaciones MP por mes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Información del Sistema
          </CardTitle>
          <CardDescription>Estado y versión actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Versión:</span>
              <p className="font-medium">v1.0.0</p>
            </div>
            <div>
              <span className="text-muted-foreground">Última Actualización:</span>
              <p className="font-medium">15/01/2024</p>
            </div>
            <div>
              <span className="text-muted-foreground">Estado:</span>
              <p className="font-medium text-green-600">Operativo</p>
            </div>
            <div>
              <span className="text-muted-foreground">Uptime:</span>
              <p className="font-medium">99.9%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
