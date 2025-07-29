"use client"

import { useQuery } from "react-query"
import { api } from "@/lib/api"

export function useAnalisis(filtros?: {
  estado?: string
  fechaDesde?: string
  fechaHasta?: string
  solicitudId?: string
}) {
  return useQuery(["analisis", filtros], () => api.getAnalisis(filtros), {
    staleTime: 30000,
  })
}
