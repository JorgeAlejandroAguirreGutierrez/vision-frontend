import { Proveedor } from './proveedor';
import { Producto } from './producto';
import { Medida } from './medida';

export class Kardex {
    id: number;
    codigo: string;
    fecha: Date;
    documento: string;
    numero: string;
    operacion: string; //AJUSTE , COMPRA, SALDO INICIAL
    entrada: number;
    salida: number;
    debe: number;
    haber: number;
    cantidad: number;
    costoPromedio: number;
    costoTotal: number;
    proveedor: Proveedor;
    producto: Producto;

    constructor() {
        this.id=0;
        this.codigo= "";
        this.fecha= new Date();
        this.documento="";
        this.numero="";
        this.operacion="";
        this.entrada=0;
        this.salida=0;
        this.costoPromedio=0;
        this.costoTotal=0;
        this.debe=0;
        this.haber=0;
        this.cantidad=0;
        this.proveedor=new Proveedor();
        this.producto=new Producto();
    }
    
}
