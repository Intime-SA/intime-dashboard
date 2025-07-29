"use client"

import { useQuery, useMutation, useQueryClient } from "react-query"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useConfigGeneral() {
  return useQuery(["config-general"], () => api.getConfigGeneral())
}

export function useUpdateConfigGeneral() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation((config: any) => api.updateConfigGeneral(config), {
    onSuccess: () => {
      queryClient.invalidateQueries(["config-general"])
      toast({
        title: "Configuración actualizada",
        description: "La configuración general ha sido guardada.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración.",
        variant: "destructive",
      })
    },
  })
}
