import { Proveedor } from '../compra/proveedor';
import { FacturaCompraLinea } from '../compra/factura-compra-linea';
import { valores } from "../../constantes";
import { TipoComprobante } from './tipo-comprobante';
import { Empresa } from '../acceso/empresa';
import { Usuario } from '../acceso/usuario';

export class ModeloDetalle {
    id: number;
    codigoPrincipal: string;
    descripcion: string;
    cantidad: string;
    precioUnitario: string;
    descuento: string;
    precioTotalSinImpuesto: string;
    codigoImpuesto: string;
    codigoProcentaje: string;
    tarifa: string;
    baseImponible: string;
    valor: string;

    constructor() {
        this.id = valores.cero;
        this.codigoPrincipal = valores.vacio;
        this.descripcion = valores.vacio;
        this.cantidad = valores.vacio;
        this.precioUnitario = valores.vacio;
        this.descuento = valores.vacio;
        this.precioTotalSinImpuesto = valores.vacio;
        this.codigoImpuesto = valores.vacio;
        this.tarifa = valores.vacio;
        this.baseImponible = valores.vacio;
        this.valor = valores.vacio;
    }
}