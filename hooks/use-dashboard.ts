import { useQuery } from "react-query"
import { api } from "@/lib/api"

export function useEstadisticas() {
  return useQuery(["estadisticas"], () => api.getEstadisticas(), {
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useClientes() {
  return useQuery(["clientes"], () => api.getClientes())
}
