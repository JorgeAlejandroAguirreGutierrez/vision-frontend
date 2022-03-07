import { Producto } from './producto';

export class SaldoInicialInventario {
    id: number;
    codigo: string;
    cantidad: number;
    costoUnitario: number;
    costoTotal: number;
    producto: Producto;

    constructor(){
        this.id=0;
        this.codigo="";
        this.cantidad=0;
        this.costoUnitario=0;
        this.costoTotal=0;
        this.producto=new Producto();
    }
}
