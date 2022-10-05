import { Producto } from './producto';
import { valores } from "../../constantes";
export class SaldoInicialInventario {
    id: number;
    codigo: string;
    cantidad: number;
    costoUnitario: number;
    costoTotal: number;
    producto: Producto;

    constructor(){
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.cantidad=valores.cero;
        this.costoUnitario=valores.cero;
        this.costoTotal=valores.cero;
        this.producto=new Producto();
    }
}
