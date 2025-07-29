"use client"

import { useQuery, useMutation, useQueryClient } from "react-query"
import { api, type Solicitud } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useSolicitudes(filtros?: {
  estado?: string
  fechaDesde?: string
  fechaHasta?: string
  telefono?: string
  busqueda?: string
}) {
  return useQuery(["solicitudes", filtros], () => api.getSolicitudes(filtros), {
    staleTime: 30000, // 30 seconds
  })
}

export function useSolicitud(id: string) {
  return useQuery(["solicitud", id], () => api.getSolicitud(id), {
    enabled: !!id,
  })
}

export function useCambiarEstadoSolicitud() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation(
    ({ id, estado, notas }: { id: string; estado: Solicitud["estado"]; notas?: string }) =>
      api.cambiarEstadoSolicitud(id, estado, notas),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["solicitudes"])
        queryClient.invalidateQueries(["solicitud"])
        toast({
          title: "Estado actualizado",
          description: "El estado de la solicitud ha sido cambiado exitosamente.",
        })
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo cambiar el estado de la solicitud.",
          variant: "destructive",
        })
      },
    },
  )
}

export function useReanalizar() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation((id: string) => api.reanalizar(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["solicitud"])
      toast({
        title: "Reanálisis iniciado",
        description: "El comprobante será analizado nuevamente.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo iniciar el reanálisis.",
        variant: "destructive",
      })
    },
  })
}

export function useRevalidar() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation((id: string) => api.revalidar(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["solicitud"])
      toast({
        title: "Revalidación iniciada",
        description: "La solicitud será validada nuevamente con Mercado Pago.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo iniciar la revalidación.",
        variant: "destructive",
      })
    },
  })
}
