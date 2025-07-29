"use client"

import { useQuery, useMutation } from "react-query"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useReportes() {
  return useQuery(["reportes"], () => api.getReportes())
}

export function useExportarReporte() {
  const { toast } = useToast()

  return useMutation(
    ({ periodo, formato }: { periodo: string; formato: "pdf" | "excel" }) => api.exportarReporte(periodo, formato),
    {
      onSuccess: (data) => {
        toast({
          title: "Reporte generado",
          description: "El reporte se ha generado exitosamente.",
        })
        // Simular descarga
        window.open(data.url, "_blank")
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo generar el reporte.",
          variant: "destructive",
        })
      },
    },
  )
}
