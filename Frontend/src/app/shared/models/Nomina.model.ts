export interface Nomina {
    id: number;
    usuarioId: number;
    empleadoNombre?: string;
    periodo_Inicio: Date | string;
    periodo_Fin: Date | string;
    salario_Bruto: number;
    salario_Neto: number;
    fecha_Pago: Date | string;
    estaPagada?: boolean;
}

export interface NominaCreateDTO {
    UsuarioId: number;
    Periodo_Inicio: string;
    Periodo_Fin: string;
    Salario_Bruto: number;
    Salario_Neto: number;
    Fecha_Pago: string;
}

export interface PagoNominaDTO {
    NominaId: number;
    Metodo_Pago: string;
    Fecha_Pago?: Date | string;
}

export interface PagoNominaResponse {
    pagoId: number;
    nominaId: number;
    empleadoNombre: string;
    monto: number;
    metodo_Pago: string;
    fecha_Pago: Date;
    mensaje: string;
}