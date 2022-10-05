import { Segmento } from './segmento';
import { Medida } from './medida';
import { valores } from "../../constantes";
export class Precio {
    id: number;
    costo: number;
    margenGanancia: number;
    precioSinIva: number;
    precioVentaPublico: number;
    precioVentaPublicoManual: number;
    utilidad: number;
    utilidadPorcentaje: number;
    segmento: Segmento;
    medida: Medida;

    constructor() {
        this.id=valores.cero;
        this.costo=valores.cero;
        this.margenGanancia=valores.cero;
        this.precioSinIva=valores.cero;
        this.precioVentaPublico=valores.cero;
        this.precioVentaPublicoManual=valores.cero;
        this.utilidad=valores.cero;
        this.utilidadPorcentaje=valores.cero;
        this.segmento=new Segmento();
        this.medida=new Medida();
    }
}