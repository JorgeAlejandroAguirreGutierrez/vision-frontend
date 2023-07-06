import { ReporteVentaLinea } from "./reporte-venta-linea";

export class ReporteVenta {
    //DATOS GENERALES
    razonSocial: string;
    nombreComercial: string;
    nombreReporte: string;
    fechaInicio: string;
    fechaFinal: string;
    fecha: string;
    periodoReporte: string;
    usuario: string;
    perfil: string;
    //DOCUMENTOS EN EL PERIODO
    reporteVentaLineas: ReporteVentaLinea[];
    //TOTALES
    total0: string;
    total12: string;
    totalIva: string;
    total: string;
    //INFORMACION RESUMEN
    facturasEmitidas: string;
    facturasAnuladas: string;
    facturasTotales: string;
    //REPORTE DE COBROS
    efectivo: string;
    cheque: string;
    tarjetaCredito: string;
    tarjetaDebito: string;
    deposito: string;
    transferencia: string;
    credito: string;
    totalRecaudacion: string;
    //FIRMAS DE RESPONSABILIDAD
    nombreRepresentanteLegal: string;
    cargoRepresentanteLegal: string;
    empresaRepresentanteLegal: string;
    nombreUsuario: string;
    cargoUsuario: string;
    empresaUsuario: string;
}