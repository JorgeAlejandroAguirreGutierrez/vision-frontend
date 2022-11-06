import { Proveedor } from '../compra/proveedor';
import { Producto } from './producto';
import { valores } from "../../constantes";
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
    //proveedor: Proveedor;
    producto: Producto;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.fecha= new Date();
        this.documento=valores.vacio;
        this.numero=valores.vacio;
        this.operacion=valores.vacio;
        this.entrada=valores.cero;
        this.salida=valores.cero;
        this.costoPromedio=valores.cero;
        this.costoTotal=valores.cero;
        this.debe=valores.cero;
        this.haber=valores.cero;
        this.cantidad=valores.cero;
        //this.proveedor=new Proveedor();
        this.producto=new Producto();
    }
    
}
