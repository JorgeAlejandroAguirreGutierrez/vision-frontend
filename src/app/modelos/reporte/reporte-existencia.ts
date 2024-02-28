import { ReporteExistenciaLinea } from "./reporte-existencia-linea";

export class ReporteExistencia {
    //DATOS GENERALES
    razonSocial: string;
    nombreComercial: string;
    nombreReporte: string;
    fecha: string;
    usuario: string;
    perfil: string;
    empresa: string;
    totalExistencia: string;
    totalCosto: string;
    reporteExistenciaLineas: ReporteExistenciaLinea [];
    //FIRMAS DE RESPONSABILIDAD
    nombreRepresentanteLegal: string;
    cargoRepresentanteLegal: string;
    empresaRepresentanteLegal: string;
    nombreUsuario: string;
    cargoUsuario: string;
    empresaUsuario: string;
}
