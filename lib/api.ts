// API Endpoints y funciones mockeadas
export interface Solicitud {
  id: string
  clienteFinal: string
  telefono: string
  fechaSolicitud: string
  estado: "pendiente" | "en_revision" | "validada" | "rechazada" | "cancelada"
  monto: number | null
  montoEsperado: number | null
  numeroOperacion: string | null
  banco: string | null
  fechaPago: string | null
  comprobante: {
    url: string
    nombre: string
  }
  analisisGPT: {
    estado: "pendiente" | "procesado" | "error"
    datos: {
      numeroOperacion: string | null
      monto: number | null
      banco: string | null
      fecha: string | null
    } | null
    confianza: number | null
  }
  validacionMP: {
    estado: "pendiente" | "validado" | "rechazado" | "error"
    respuesta: any | null
    fechaValidacion: string | null
  }
  notas: string
  historial: Array<{
    fecha: string
    accion: string
    usuario: string
    detalles: string
  }>
}

export interface MensajeWhatsApp {
  id: string
  telefono: string
  mensaje: string
  tipo: "recibido" | "enviado"
  fecha: string
  tieneArchivo: boolean
  archivo?: {
    url: string
    tipo: string
    nombre: string
  }
  solicitudId?: string
  estado: "procesado" | "pendiente" | "error"
}

export interface Cliente {
  id: string
  telefono: string
  nombre?: string
  totalSolicitudes: number
  solicitudesValidadas: number
  ultimaActividad: string
}

export interface ConfigWhatsApp {
  numero: string
  proveedor: "wati" | "twilio"
  apiKey: string
  webhookUrl: string
  estado: "conectado" | "desconectado" | "error"
  ultimaConexion: string
}

export interface EstadisticasDashboard {
  totalSolicitudes: number
  solicitudesPendientes: number
  solicitudesValidadas: number
  solicitudesRechazadas: number
  mensajesHoy: number
  clientesActivos: number
  montoTotalValidado: number
  tasaValidacion: number
}

// Mock data
const mockSolicitudes: Solicitud[] = [
  {
    id: "SOL-001",
    clienteFinal: "Juan Pérez",
    telefono: "+5491123456789",
    fechaSolicitud: "2024-01-15T10:30:00Z",
    estado: "validada",
    monto: 15000,
    montoEsperado: 15000,
    numeroOperacion: "MP123456789",
    banco: "Mercado Pago",
    fechaPago: "2024-01-15T10:25:00Z",
    comprobante: {
      url: "/placeholder.svg?height=400&width=300&text=Comprobante+MP",
      nombre: "comprobante_001.jpg",
    },
    analisisGPT: {
      estado: "procesado",
      datos: {
        numeroOperacion: "MP123456789",
        monto: 15000,
        banco: "Mercado Pago",
        fecha: "2024-01-15",
      },
      confianza: 0.95,
    },
    validacionMP: {
      estado: "validado",
      respuesta: {
        status: "approved",
        amount: 15000,
        date: "2024-01-15T10:25:00Z",
      },
      fechaValidacion: "2024-01-15T10:31:00Z",
    },
    notas: "Pago validado correctamente",
    historial: [
      {
        fecha: "2024-01-15T10:30:00Z",
        accion: "Solicitud creada",
        usuario: "Sistema",
        detalles: "Comprobante recibido vía WhatsApp",
      },
      {
        fecha: "2024-01-15T10:31:00Z",
        accion: "Análisis GPT completado",
        usuario: "Sistema",
        detalles: "Datos extraídos con 95% de confianza",
      },
      {
        fecha: "2024-01-15T10:31:00Z",
        accion: "Validación MP exitosa",
        usuario: "Sistema",
        detalles: "Pago confirmado en Mercado Pago",
      },
    ],
  },
  {
    id: "SOL-002",
    clienteFinal: "María García",
    telefono: "+5491187654321",
    fechaSolicitud: "2024-01-15T11:15:00Z",
    estado: "pendiente",
    monto: null,
    montoEsperado: 25000,
    numeroOperacion: null,
    banco: null,
    fechaPago: null,
    comprobante: {
      url: "/placeholder.svg?height=400&width=300&text=Comprobante+Borroso",
      nombre: "comprobante_002.jpg",
    },
    analisisGPT: {
      estado: "error",
      datos: null,
      confianza: null,
    },
    validacionMP: {
      estado: "pendiente",
      respuesta: null,
      fechaValidacion: null,
    },
    notas: "Comprobante ilegible, requiere revisión manual",
    historial: [
      {
        fecha: "2024-01-15T11:15:00Z",
        accion: "Solicitud creada",
        usuario: "Sistema",
        detalles: "Comprobante recibido vía WhatsApp",
      },
      {
        fecha: "2024-01-15T11:16:00Z",
        accion: "Error en análisis GPT",
        usuario: "Sistema",
        detalles: "No se pudieron extraer datos del comprobante",
      },
    ],
  },
  {
    id: "SOL-003",
    clienteFinal: "Carlos López",
    telefono: "+5491156789012",
    fechaSolicitud: "2024-01-15T12:00:00Z",
    estado: "rechazada",
    monto: 8000,
    montoEsperado: 10000,
    numeroOperacion: "TR987654321",
    banco: "Banco Nación",
    fechaPago: "2024-01-15T11:55:00Z",
    comprobante: {
      url: "/placeholder.svg?height=400&width=300&text=Comprobante+Transferencia",
      nombre: "comprobante_003.jpg",
    },
    analisisGPT: {
      estado: "procesado",
      datos: {
        numeroOperacion: "TR987654321",
        monto: 8000,
        banco: "Banco Nación",
        fecha: "2024-01-15",
      },
      confianza: 0.88,
    },
    validacionMP: {
      estado: "rechazado",
      respuesta: {
        error: "Monto no coincide con lo esperado",
      },
      fechaValidacion: "2024-01-15T12:01:00Z",
    },
    notas: "Monto inferior al esperado",
    historial: [
      {
        fecha: "2024-01-15T12:00:00Z",
        accion: "Solicitud creada",
        usuario: "Sistema",
        detalles: "Comprobante recibido vía WhatsApp",
      },
      {
        fecha: "2024-01-15T12:01:00Z",
        accion: "Análisis GPT completado",
        usuario: "Sistema",
        detalles: "Datos extraídos con 88% de confianza",
      },
      {
        fecha: "2024-01-15T12:01:00Z",
        accion: "Validación rechazada",
        usuario: "Sistema",
        detalles: "Monto no coincide (esperado: $10,000, recibido: $8,000)",
      },
    ],
  },
]

const mockMensajes: MensajeWhatsApp[] = [
  {
    id: "MSG-001",
    telefono: "+5491123456789",
    mensaje: "Hola, te envío el comprobante de pago",
    tipo: "recibido",
    fecha: "2024-01-15T10:29:00Z",
    tieneArchivo: true,
    archivo: {
      url: "/placeholder.svg?height=400&width=300&text=Comprobante+MP",
      tipo: "image/jpeg",
      nombre: "comprobante.jpg",
    },
    solicitudId: "SOL-001",
    estado: "procesado",
  },
  {
    id: "MSG-002",
    telefono: "+5491123456789",
    mensaje: "Gracias, recibimos tu comprobante. Estamos validando tu pago y te avisaremos pronto.",
    tipo: "enviado",
    fecha: "2024-01-15T10:30:00Z",
    tieneArchivo: false,
    estado: "procesado",
  },
  {
    id: "MSG-003",
    telefono: "+5491123456789",
    mensaje: "Tu pago fue validado correctamente, gracias por operar con nosotros.",
    tipo: "enviado",
    fecha: "2024-01-15T10:32:00Z",
    tieneArchivo: false,
    estado: "procesado",
  },
  {
    id: "MSG-004",
    telefono: "+5491187654321",
    mensaje: "Adjunto comprobante",
    tipo: "recibido",
    fecha: "2024-01-15T11:14:00Z",
    tieneArchivo: true,
    archivo: {
      url: "/placeholder.svg?height=400&width=300&text=Comprobante+Borroso",
      tipo: "image/jpeg",
      nombre: "IMG_001.jpg",
    },
    solicitudId: "SOL-002",
    estado: "procesado",
  },
]

const mockClientes: Cliente[] = [
  {
    id: "CLI-001",
    telefono: "+5491123456789",
    nombre: "Juan Pérez",
    totalSolicitudes: 5,
    solicitudesValidadas: 4,
    ultimaActividad: "2024-01-15T10:32:00Z",
  },
  {
    id: "CLI-002",
    telefono: "+5491187654321",
    nombre: "María García",
    totalSolicitudes: 2,
    solicitudesValidadas: 1,
    ultimaActividad: "2024-01-15T11:15:00Z",
  },
  {
    id: "CLI-003",
    telefono: "+5491156789012",
    nombre: "Carlos López",
    totalSolicitudes: 3,
    solicitudesValidadas: 2,
    ultimaActividad: "2024-01-15T12:00:00Z",
  },
]

const mockConfigWhatsApp: ConfigWhatsApp = {
  numero: "+5491123456789",
  proveedor: "wati",
  apiKey: "wati_api_key_***",
  webhookUrl: "https://api.example.com/webhook/whatsapp",
  estado: "conectado",
  ultimaConexion: "2024-01-15T10:00:00Z",
}

const mockEstadisticas: EstadisticasDashboard = {
  totalSolicitudes: 156,
  solicitudesPendientes: 23,
  solicitudesValidadas: 98,
  solicitudesRechazadas: 35,
  mensajesHoy: 47,
  clientesActivos: 89,
  montoTotalValidado: 2450000,
  tasaValidacion: 73.6,
}

// API Functions
export const api = {
  // Dashboard
  getEstadisticas: async (): Promise<EstadisticasDashboard> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockEstadisticas
  },

  // Solicitudes
  getSolicitudes: async (filtros?: {
    estado?: string
    fechaDesde?: string
    fechaHasta?: string
    telefono?: string
    busqueda?: string
  }): Promise<Solicitud[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    let solicitudes = [...mockSolicitudes]

    if (filtros?.estado && filtros.estado !== "todas") {
      solicitudes = solicitudes.filter((s) => s.estado === filtros.estado)
    }

    if (filtros?.telefono) {
      solicitudes = solicitudes.filter((s) => s.telefono.includes(filtros.telefono!))
    }

    if (filtros?.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase()
      solicitudes = solicitudes.filter(
        (s) =>
          s.id.toLowerCase().includes(busqueda) ||
          s.clienteFinal.toLowerCase().includes(busqueda) ||
          s.numeroOperacion?.toLowerCase().includes(busqueda),
      )
    }

    return solicitudes
  },

  getSolicitud: async (id: string): Promise<Solicitud | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockSolicitudes.find((s) => s.id === id) || null
  },

  updateSolicitud: async (id: string, datos: Partial<Solicitud>): Promise<Solicitud> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const solicitud = mockSolicitudes.find((s) => s.id === id)
    if (!solicitud) throw new Error("Solicitud no encontrada")

    Object.assign(solicitud, datos)
    return solicitud
  },

  cambiarEstadoSolicitud: async (id: string, estado: Solicitud["estado"], notas?: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const solicitud = mockSolicitudes.find((s) => s.id === id)
    if (solicitud) {
      solicitud.estado = estado
      if (notas) solicitud.notas = notas
      solicitud.historial.push({
        fecha: new Date().toISOString(),
        accion: `Estado cambiado a ${estado}`,
        usuario: "Admin",
        detalles: notas || "",
      })
    }
  },

  reanalizar: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const solicitud = mockSolicitudes.find((s) => s.id === id)
    if (solicitud) {
      solicitud.analisisGPT.estado = "procesado"
      solicitud.historial.push({
        fecha: new Date().toISOString(),
        accion: "Reanálisis GPT solicitado",
        usuario: "Admin",
        detalles: "Análisis manual iniciado",
      })
    }
  },

  revalidar: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const solicitud = mockSolicitudes.find((s) => s.id === id)
    if (solicitud) {
      solicitud.validacionMP.estado = "validado"
      solicitud.historial.push({
        fecha: new Date().toISOString(),
        accion: "Revalidación MP solicitada",
        usuario: "Admin",
        detalles: "Validación manual iniciada",
      })
    }
  },

  // Mensajes WhatsApp
  getMensajes: async (filtros?: {
    telefono?: string
    tipo?: string
    fechaDesde?: string
    fechaHasta?: string
  }): Promise<MensajeWhatsApp[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    let mensajes = [...mockMensajes]

    if (filtros?.telefono) {
      mensajes = mensajes.filter((m) => m.telefono.includes(filtros.telefono!))
    }

    if (filtros?.tipo && filtros.tipo !== "todos") {
      mensajes = mensajes.filter((m) => m.tipo === filtros.tipo)
    }

    return mensajes.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  },

  enviarMensaje: async (telefono: string, mensaje: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    mockMensajes.push({
      id: `MSG-${Date.now()}`,
      telefono,
      mensaje,
      tipo: "enviado",
      fecha: new Date().toISOString(),
      tieneArchivo: false,
      estado: "procesado",
    })
  },

  // Clientes
  getClientes: async (): Promise<Cliente[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return mockClientes
  },

  // Configuración WhatsApp
  getConfigWhatsApp: async (): Promise<ConfigWhatsApp> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockConfigWhatsApp
  },

  updateConfigWhatsApp: async (config: Partial<ConfigWhatsApp>): Promise<ConfigWhatsApp> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    Object.assign(mockConfigWhatsApp, config)
    return mockConfigWhatsApp
  },

  testConexionWhatsApp: async (): Promise<{ success: boolean; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return {
      success: true,
      message: "Conexión exitosa. Mensaje de prueba enviado.",
    }
  },
  // Validaciones MP
  getValidaciones: async (filtros?: {
    estado?: string
    fechaDesde?: string
    fechaHasta?: string
    solicitudId?: string
  }): Promise<ValidacionMP[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    let validaciones = [...mockValidaciones]

    if (filtros?.estado && filtros.estado !== "todas") {
      validaciones = validaciones.filter((v) => v.estado === filtros.estado)
    }

    if (filtros?.solicitudId) {
      validaciones = validaciones.filter((v) => v.solicitudId.includes(filtros.solicitudId!))
    }

    return validaciones.sort((a, b) => new Date(b.fechaConsulta).getTime() - new Date(a.fechaConsulta).getTime())
  },

  // Análisis GPT
  getAnalisis: async (filtros?: {
    estado?: string
    fechaDesde?: string
    fechaHasta?: string
    solicitudId?: string
  }): Promise<AnalisisGPT[]> => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    let analisis = [...mockAnalisis]

    if (filtros?.estado && filtros.estado !== "todas") {
      analisis = analisis.filter((a) => a.estado === filtros.estado)
    }

    if (filtros?.solicitudId) {
      analisis = analisis.filter((a) => a.solicitudId.includes(filtros.solicitudId!))
    }

    return analisis.sort((a, b) => new Date(b.fechaAnalisis).getTime() - new Date(a.fechaAnalisis).getTime())
  },

  // Reportes
  getReportes: async (): Promise<Reporte[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockReportes
  },

  exportarReporte: async (periodo: string, formato: "pdf" | "excel"): Promise<{ url: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return {
      url: `/placeholder.svg?height=400&width=300&text=Reporte+${periodo}.${formato}`,
    }
  },

  // Configuración general
  getConfigGeneral: async (): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return {
      empresa: {
        nombre: "Mi Empresa",
        email: "admin@miempresa.com",
        telefono: "+5491123456789",
      },
      sistema: {
        timeoutGPT: 30,
        timeoutMP: 15,
        reintentos: 3,
        notificaciones: true,
      },
      limites: {
        solicitudesDiarias: 1000,
        analisisMensual: 5000,
        validacionesMensual: 10000,
      },
    }
  },

  updateConfigGeneral: async (config: any): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return config
  },
}

export interface ValidacionMP {
  id: string
  solicitudId: string
  numeroOperacion: string | null
  monto: number | null
  fechaConsulta: string
  estado: "validado" | "rechazado" | "pendiente" | "error"
  respuestaMp: any
  tiempoRespuesta: number
  intentos: number
}

export interface AnalisisGPT {
  id: string
  solicitudId: string
  comprobante: string
  fechaAnalisis: string
  estado: "procesado" | "error" | "pendiente"
  datosExtraidos: {
    numeroOperacion: string | null
    monto: number | null
    banco: string | null
    fecha: string | null
    emisor: string | null
  } | null
  confianza: number | null
  tiempoProcesamiento: number
  modelo: string
  tokens: number
}

export interface Reporte {
  periodo: string
  totalSolicitudes: number
  solicitudesValidadas: number
  tasaValidacion: number
  montoTotal: number
  tiempoPromedioValidacion: number
  erroresGPT: number
  erroresMP: number
}

const mockValidaciones: ValidacionMP[] = [
  {
    id: "VAL-001",
    solicitudId: "SOL-001",
    numeroOperacion: "MP123456789",
    monto: 15000,
    fechaConsulta: "2024-01-15T10:31:00Z",
    estado: "validado",
    respuestaMp: {
      status: "approved",
      amount: 15000,
      payment_method: "credit_card",
      date_created: "2024-01-15T10:25:00Z",
    },
    tiempoRespuesta: 1200,
    intentos: 1,
  },
  {
    id: "VAL-002",
    solicitudId: "SOL-002",
    numeroOperacion: null,
    monto: 25000,
    fechaConsulta: "2024-01-15T11:16:00Z",
    estado: "error",
    respuestaMp: {
      error: "Operation not found",
    },
    tiempoRespuesta: 2500,
    intentos: 3,
  },
  {
    id: "VAL-003",
    solicitudId: "SOL-003",
    numeroOperacion: "TR987654321",
    monto: 8000,
    fechaConsulta: "2024-01-15T12:01:00Z",
    estado: "rechazado",
    respuestaMp: {
      status: "rejected",
      amount: 8000,
      reason: "insufficient_funds",
    },
    tiempoRespuesta: 800,
    intentos: 1,
  },
]

const mockAnalisis: AnalisisGPT[] = [
  {
    id: "ANA-001",
    solicitudId: "SOL-001",
    comprobante: "/placeholder.svg?height=400&width=300&text=Comprobante+MP",
    fechaAnalisis: "2024-01-15T10:31:00Z",
    estado: "procesado",
    datosExtraidos: {
      numeroOperacion: "MP123456789",
      monto: 15000,
      banco: "Mercado Pago",
      fecha: "2024-01-15",
      emisor: "Juan Pérez",
    },
    confianza: 0.95,
    tiempoProcesamiento: 3500,
    modelo: "gpt-4-vision",
    tokens: 1250,
  },
  {
    id: "ANA-002",
    solicitudId: "SOL-002",
    comprobante: "/placeholder.svg?height=400&width=300&text=Comprobante+Borroso",
    fechaAnalisis: "2024-01-15T11:16:00Z",
    estado: "error",
    datosExtraidos: null,
    confianza: null,
    tiempoProcesamiento: 5000,
    modelo: "gpt-4-vision",
    tokens: 800,
  },
  {
    id: "ANA-003",
    solicitudId: "SOL-003",
    comprobante: "/placeholder.svg?height=400&width=300&text=Comprobante+Transferencia",
    fechaAnalisis: "2024-01-15T12:01:00Z",
    estado: "procesado",
    datosExtraidos: {
      numeroOperacion: "TR987654321",
      monto: 8000,
      banco: "Banco Nación",
      fecha: "2024-01-15",
      emisor: "Carlos López",
    },
    confianza: 0.88,
    tiempoProcesamiento: 2800,
    modelo: "gpt-4-vision",
    tokens: 1100,
  },
]

const mockReportes: Reporte[] = [
  {
    periodo: "2024-01",
    totalSolicitudes: 156,
    solicitudesValidadas: 98,
    tasaValidacion: 62.8,
    montoTotal: 2450000,
    tiempoPromedioValidacion: 45,
    erroresGPT: 12,
    erroresMP: 8,
  },
  {
    periodo: "2023-12",
    totalSolicitudes: 142,
    solicitudesValidadas: 89,
    tasaValidacion: 62.7,
    montoTotal: 2180000,
    tiempoPromedioValidacion: 52,
    erroresGPT: 15,
    erroresMP: 11,
  },
  {
    periodo: "2023-11",
    totalSolicitudes: 128,
    solicitudesValidadas: 85,
    tasaValidacion: 66.4,
    montoTotal: 1950000,
    tiempoPromedioValidacion: 48,
    erroresGPT: 10,
    erroresMP: 6,
  },
]
