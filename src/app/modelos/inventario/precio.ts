import { Segmento } from '../cliente/segmento';
import { valores } from "../../constantes";
import { Producto } from './producto';
export class Precio {
    id: number;
    codigo: string;
    costo: number;
    margenGanancia: number;
    precioSinIva: number;
    precioVentaPublico: number;
    precioVentaPublicoManual: number;
    utilidad: number;
    utilidadPorcentaje: number;
    estado: string;
    segmento: Segmento;
    producto: Producto;

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.costo = valores.cero;
        this.margenGanancia = valores.cero;
        this.precioSinIva=valores.cero;
        this.precioVentaPublico = valores.cero;
        this.precioVentaPublicoManual = valores.cero;
        this.utilidad = valores.cero;
        this.utilidadPorcentaje = valores.cero;
        this.estado = valores.estadoActivo;
        this.segmento = new Segmento();
        this.producto = new Producto();
    }
}