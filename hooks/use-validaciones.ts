"use client"

import { useQuery } from "react-query"
import { api } from "@/lib/api"

export function useValidaciones(filtros?: {
  estado?: string
  fechaDesde?: string
  fechaHasta?: string
  solicitudId?: string
}) {
  return useQuery(["validaciones", filtros], () => api.getValidaciones(filtros), {
    staleTime: 30000,
  })
}
