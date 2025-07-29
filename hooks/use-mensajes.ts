"use client"

import { useQuery, useMutation, useQueryClient } from "react-query"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useMensajes(filtros?: {
  telefono?: string
  tipo?: string
  fechaDesde?: string
  fechaHasta?: string
}) {
  return useQuery(["mensajes", filtros], () => api.getMensajes(filtros), {
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useEnviarMensaje() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation(
    ({ telefono, mensaje }: { telefono: string; mensaje: string }) => api.enviarMensaje(telefono, mensaje),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["mensajes"])
        toast({
          title: "Mensaje enviado",
          description: "El mensaje ha sido enviado exitosamente.",
        })
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje.",
          variant: "destructive",
        })
      },
    },
  )
}
