import { Segmento } from './segmento';
import { Medida } from './medida';

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
        this.id=0;
        this.costo=0;
        this.margenGanancia=0;
        this.precioSinIva=0;
        this.precioVentaPublico=0;
        this.precioVentaPublicoManual=0;
        this.utilidad=0;
        this.utilidadPorcentaje=0;
        this.segmento=new Segmento();
        this.medida=new Medida();
    }
}