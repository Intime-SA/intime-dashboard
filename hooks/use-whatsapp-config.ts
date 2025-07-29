"use client"

import { useQuery, useMutation, useQueryClient } from "react-query"
import { api, type ConfigWhatsApp } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useConfigWhatsApp() {
  return useQuery(["config-whatsapp"], () => api.getConfigWhatsApp())
}

export function useUpdateConfigWhatsApp() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation((config: Partial<ConfigWhatsApp>) => api.updateConfigWhatsApp(config), {
    onSuccess: () => {
      queryClient.invalidateQueries(["config-whatsapp"])
      toast({
        title: "Configuración actualizada",
        description: "La configuración de WhatsApp ha sido guardada.",
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

export function useTestConexionWhatsApp() {
  const { toast } = useToast()

  return useMutation(() => api.testConexionWhatsApp(), {
    onSuccess: (data) => {
      toast({
        title: data.success ? "Conexión exitosa" : "Error de conexión",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo probar la conexión.",
        variant: "destructive",
      })
    },
  })
}
