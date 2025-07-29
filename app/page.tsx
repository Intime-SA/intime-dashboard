"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useEstadisticas } from "@/hooks/use-dashboard"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Users,
  DollarSign,
  TrendingUp,
  RefreshCw,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { data: estadisticas, isLoading, refetch } = useEstadisticas()

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!estadisticas) return null

  const cards = [
    {
      title: "Total Solicitudes",
      value: estadisticas.totalSolicitudes,
      description: "Solicitudes registradas",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Pendientes",
      value: estadisticas.solicitudesPendientes,
      description: "Esperando validación",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Validadas",
      value: estadisticas.solicitudesValidadas,
      description: "Pagos confirmados",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Rechazadas",
      value: estadisticas.solicitudesRechazadas,
      description: "No validadas",
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Mensajes Hoy",
      value: estadisticas.mensajesHoy,
      description: "Mensajes recibidos",
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      title: "Clientes Activos",
      value: estadisticas.clientesActivos,
      description: "Usuarios únicos",
      icon: Users,
      color: "text-indigo-600",
    },
    {
      title: "Monto Validado",
      value: `$${estadisticas.montoTotalValidado.toLocaleString()}`,
      description: "Total procesado",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Tasa Validación",
      value: `${estadisticas.tasaValidacion}%`,
      description: "Éxito en validaciones",
      icon: TrendingUp,
      color: "text-blue-600",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen de Estados</CardTitle>
            <CardDescription>Distribución actual de solicitudes por estado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Validadas
                </Badge>
                <span className="text-sm text-muted-foreground">{estadisticas.solicitudesValidadas} solicitudes</span>
              </div>
              <div className="text-sm font-medium">
                {((estadisticas.solicitudesValidadas / estadisticas.totalSolicitudes) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Pendientes
                </Badge>
                <span className="text-sm text-muted-foreground">{estadisticas.solicitudesPendientes} solicitudes</span>
              </div>
              <div className="text-sm font-medium">
                {((estadisticas.solicitudesPendientes / estadisticas.totalSolicitudes) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Rechazadas
                </Badge>
                <span className="text-sm text-muted-foreground">{estadisticas.solicitudesRechazadas} solicitudes</span>
              </div>
              <div className="text-sm font-medium">
                {((estadisticas.solicitudesRechazadas / estadisticas.totalSolicitudes) * 100).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">Pago validado</p>
                  <p className="text-muted-foreground">SOL-001 - hace 2 min</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">Nueva solicitud</p>
                  <p className="text-muted-foreground">SOL-004 - hace 5 min</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">Análisis GPT completado</p>
                  <p className="text-muted-foreground">SOL-003 - hace 8 min</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">Mensaje enviado</p>
                  <p className="text-muted-foreground">+549112345678 - hace 12 min</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
