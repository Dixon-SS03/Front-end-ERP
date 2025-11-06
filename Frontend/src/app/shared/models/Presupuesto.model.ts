export interface Presupuesto {
    id: number,
    nombre: string,
    monto_total: number,
    fecha_inicio: Date,
    fecha_fin: Date,
    estado: string,
    id_proyecto: number,
}
