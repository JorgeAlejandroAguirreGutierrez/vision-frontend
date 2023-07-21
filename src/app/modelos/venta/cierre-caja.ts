import { Empresa } from '../usuario/empresa';
import { Sesion } from '../usuario/sesion';
import { valores } from "../../constantes";

export class CierreCaja {
    id: number;
    codigo: string;
    fecha: Date;
    billete100: number;
    billete50: number;
    billete20: number;
    billete10: number;
    billete5: number;
    billete1: number;
    moneda100: number;
    moneda50: number;
    moneda25: number;
    moneda10: number;
    moneda5: number;
    moneda1: number;
    totalBilletes: number;
    totalMonedas: number;
    totalCaja: number;
    estado: string;
    empresa: Empresa;
    sesion: Sesion;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.fecha = new Date();
        this.billete100 = valores.cero;
        this.billete50 = valores.cero;
        this.billete20 = valores.cero;
        this.billete10 = valores.cero;
        this.billete5 = valores.cero;
        this.billete1 = valores.cero;
        this.moneda100 = valores.cero;
        this.moneda50 = valores.cero;
        this.moneda25 = valores.cero;
        this.moneda10 = valores.cero;
        this.moneda5 = valores.cero;
        this.moneda1 = valores.cero;
        this.totalBilletes = valores.cero;
        this.totalMonedas = valores.cero;
        this.totalCaja = valores.cero;
        this.estado = valores.estadoActivo;
        this.empresa = new Empresa();
        this.sesion = new Sesion();
    }
}