"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useReportes, useExportarReporte } from "@/hooks/use-reportes"
import { Download, RefreshCw, TrendingUp, TrendingDown, BarChart3, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function ReportesPage() {
  const [periodoExport, setPeriodoExport] = useState("")
  const [formatoExport, setFormatoExport] = useState<"pdf" | "excel">("pdf")

  const { data: reportes, isLoading, refetch } = useReportes()
  const exportarReporte = useExportarReporte()

  const handleExportar = () => {
    if (periodoExport) {
      exportarReporte.mutate({ periodo: periodoExport, formato: formatoExport })
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[100px]" />
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

  const reporteActual = reportes?.[0]
  const reporteAnterior = reportes?.[1]

  const calcularCambio = (actual: number, anterior: number) => {
    if (!anterior) return 0
    return ((actual - anterior) / anterior) * 100
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Resumen del Período Actual */}
      {reporteActual && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resumen del Período {reporteActual.periodo}
            </CardTitle>
            <CardDescription>Métricas principales del período actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Solicitudes</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{reporteActual.totalSolicitudes}</span>
                  {reporteAnterior && (
                    <Badge
                      variant={
                        calcularCambio(reporteActual.totalSolicitudes, reporteAnterior.totalSolicitudes) >= 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {calcularCambio(reporteActual.totalSolicitudes, reporteAnterior.totalSolicitudes) >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(
                        calcularCambio(reporteActual.totalSolicitudes, reporteAnterior.totalSolicitudes),
                      ).toFixed(1)}
                      %
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tasa de Validación</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{reporteActual.tasaValidacion.toFixed(1)}%</span>
                  {reporteAnterior && (
                    <Badge
                      variant={
                        calcularCambio(reporteActual.tasaValidacion, reporteAnterior.tasaValidacion) >= 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {calcularCambio(reporteActual.tasaValidacion, reporteAnterior.tasaValidacion) >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(calcularCambio(reporteActual.tasaValidacion, reporteAnterior.tasaValidacion)).toFixed(
                        1,
                      )}
                      %
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Monto Total</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">${reporteActual.montoTotal.toLocaleString()}</span>
                  {reporteAnterior && (
                    <Badge
                      variant={
                        calcularCambio(reporteActual.montoTotal, reporteAnterior.montoTotal) >= 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {calcularCambio(reporteActual.montoTotal, reporteAnterior.montoTotal) >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(calcularCambio(reporteActual.montoTotal, reporteAnterior.montoTotal)).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{reporteActual.tiempoPromedioValidacion}s</span>
                  {reporteAnterior && (
                    <Badge
                      variant={
                        calcularCambio(
                          reporteActual.tiempoPromedioValidacion,
                          reporteAnterior.tiempoPromedioValidacion,
                        ) <= 0
                          ? "default"
                          : "destructive"
                      }
                    >
                      {calcularCambio(
                        reporteActual.tiempoPromedioValidacion,
                        reporteAnterior.tiempoPromedioValidacion,
                      ) <= 0 ? (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(
                        calcularCambio(
                          reporteActual.tiempoPromedioValidacion,
                          reporteAnterior.tiempoPromedioValidacion,
                        ),
                      ).toFixed(1)}
                      %
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Errores y Alertas */}
      {reporteActual && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Errores del Sistema
              </CardTitle>
              <CardDescription>Errores registrados en el período</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Errores GPT-O</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{reporteActual.erroresGPT}</span>
                    <Badge variant="destructive" className="text-xs">
                      {((reporteActual.erroresGPT / reporteActual.totalSolicitudes) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Errores Mercado Pago</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{reporteActual.erroresMP}</span>
                    <Badge variant="destructive" className="text-xs">
                      {((reporteActual.erroresMP / reporteActual.totalSolicitudes) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Errores</span>
                    <span className="font-bold text-red-600">{reporteActual.erroresGPT + reporteActual.erroresMP}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exportar Reportes</CardTitle>
              <CardDescription>Genera reportes detallados en PDF o Excel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Período</label>
                  <Select value={periodoExport} onValueChange={setPeriodoExport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportes?.map((reporte) => (
                        <SelectItem key={reporte.periodo} value={reporte.periodo}>
                          {reporte.periodo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Formato</label>
                  <Select value={formatoExport} onValueChange={(value: "pdf" | "excel") => setFormatoExport(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleExportar}
                disabled={!periodoExport || exportarReporte.isLoading}
                className="w-full"
              >
                {exportarReporte.isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Exportar Reporte
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Histórico de Reportes */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Períodos</CardTitle>
          <CardDescription>Comparación de métricas por período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportes?.map((reporte, index) => (
              <div key={reporte.periodo} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">{reporte.periodo}</h4>
                  <Badge variant={index === 0 ? "default" : "secondary"}>{index === 0 ? "Actual" : "Anterior"}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Solicitudes:</span>
                    <p className="font-medium">{reporte.totalSolicitudes}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Validadas:</span>
                    <p className="font-medium">{reporte.solicitudesValidadas}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tasa:</span>
                    <p className="font-medium">{reporte.tasaValidacion.toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monto:</span>
                    <p className="font-medium">${reporte.montoTotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
