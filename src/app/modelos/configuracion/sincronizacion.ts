import { valores } from "../../constantes";
import { Empresa } from "../acceso/empresa";
import { Usuario } from "../acceso/usuario";
export class Sincronizacion {
    id: number;
    codigo: string;
    tipo: string;
    mes: string;
    anio: string;
    clavesAccesos: string;
    estado: string;
    usuario: Usuario;
    empresa: Empresa;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.tipo = valores.vacio;
        this.mes = valores.vacio;
        this.anio = valores.vacio;
        this.estado = valores.vacio
        this.usuario = new Usuario();
        this.empresa = new Empresa();
    }
}
