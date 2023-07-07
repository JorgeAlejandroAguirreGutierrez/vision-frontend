import { ReporteKardexLinea } from "./reporte-kardex-linea";

export class ReporteKardex {
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
    //PRODUCTO
    nombre: string;
    modelo: string;
    serie: string;
    caducidad: string;
    //VALORACION
    costoPromedio: string;
    ultimoCosto: string;
    margenRentabilidadPromedio: string;
    tarifaProducto: string;
    //TARJETA KARDEX
    reporteKardexLineas: ReporteKardexLinea[];
    //FIRMAS DE RESPONSABILIDAD
    nombreRepresentanteLegal: string;
    cargoRepresentanteLegal: string;
    empresaRepresentanteLegal: string;
    nombreUsuario: string;
    cargoUsuario: string;
    empresaUsuario: string;
}