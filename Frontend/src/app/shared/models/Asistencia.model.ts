export interface Asistencia {
    id: number,
    id_usuario: number,
    id_horario: number,
    fecha: Date,
    hora_entrada: string,
    hora_salida: string,
    estado: string,
    observaciones: string
}