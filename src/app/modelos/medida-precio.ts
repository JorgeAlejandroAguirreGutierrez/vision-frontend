import { Medida } from './medida';
import { Precio } from './precio';

export class MedidaPrecio {
    id: number;
    medida: Medida;
    precios: Precio[];

    constructor(){
        this.id=0;
        this.medida=new Medida();
        this.precios=[];
    }
}