export class ReporteCaja {
    razonSocial: string;
    nombreComercial: string;
    nombreReporte: string;
    fechaInicio: string;
    fechaFinal: string;
    //DATOS GENERALES
    fecha: string;
    periodoReporte: string;
    usuario: string;
    perfil: string;
    //COMPROBANTES EMITIDOS
    facturasEmitidas: string;
    facturasAnuladas: string;
    facturasTotales: string;
    //RESUMEN DE VENTAS
    total0: string;
    total12: string;
    totalIva: string;
    total: string;
    //CIERRE DE CAJA VENTAS AL CONTADO
    efectivo: string;
    cheque: string;
    tarjetaCredito: string;
    tarjetaDebito: string;
    transferencia: string;
    deposito: string;
    credito: string;
    totalRecaudacion: string;
    //DINERO RECAUDADO
    cantidadBillete100: string;
    denominacionBillete100: string;
    totalBillete100: string;
    cantidadBillete50: string;
    denominacionBillete50: string;
    totalBillete50: string;
    cantidadBillete20: string;
    denominacionBillete20: string;
    totalBillete20: string;
    cantidadBillete10: string;
    denominacionBillete10: string;
    totalBillete10: string;
    cantidadBillete5: string;
    denominacionBillete5: string;
    totalBillete5: string;
    cantidadBillete2: string;
    denominacionBillete2: string;
    totalBillete2: string;
    cantidadBillete1: string;
    denominacionBillete1: string;
    totalBillete1: string;
    totalBilletes: string;

    cantidadMoneda1: string;
    denominacionMoneda1: string;
    totalMoneda1: string;
    cantidadMoneda050: string;
    denominacionMoneda050: string;
    totalMoneda050: string;
    cantidadMoneda025: string;
    denominacionMoneda025: string;
    totalMoneda025: string;
    cantidadMoneda010: string;
    denominacionMoneda010: string;
    totalMoneda010: string;
    cantidadMoneda005: string;
    denominacionMoneda005: string;
    totalMoneda005: string;
    cantidadMoneda001: string;
    denominacionMoneda001: string;
    totalMoneda001: string;
    totalMonedas: string;

    totalCaja: string;

    //DIFERENCIAS
    faltante: string;
    sobrante: string;

    //FIRMAS DE RESPONSABILIDAD
    nombreRepresentanteLegal: string;
    cargoRepresentanteLegal: string;
    empresaRepresentanteLegal: string;
    nombreUsuario: string;
    cargoUsuario: string;
    empresaUsuario: string;
}