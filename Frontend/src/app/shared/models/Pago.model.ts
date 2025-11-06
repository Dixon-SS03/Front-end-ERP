export interface Pago {
    id: number,
    id_factura: number,
    id_nomina: number,
    tipo: string,
    monto: number,
    metodo_pago: string,
    fecha_registro: Date,

}