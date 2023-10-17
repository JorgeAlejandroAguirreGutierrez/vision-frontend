import { Proveedor } from './proveedor';
import { valores } from "../../constantes";
import { TipoComprobante } from '../configuracion/tipo-comprobante';
import { Empresa } from '../usuario/empresa';
import { Usuario } from '../usuario/usuario';
import { TipoGasto } from '../inventario/tipo-gasto';
import { GastoPersonalLinea } from './gasto-personal-linea';

export class GastoPersonal {
    id: number;
    codigo: string;
    establecimiento: string;
    puntoVenta: string;
    secuencial: string;
    numeroComprobante: string;
    fecha: Date;
    estado: string;
    
    descuento: number;
    subtotal: number;
    
    subtotalGravadoConDescuento: number;
    subtotalNoGravadoConDescuento: number;
    importeIvaTotal: number;
    total: number;

    comentario: string;
    tipoGasto: TipoGasto;
    proveedor: Proveedor;
    usuario: Usuario;
    tipoComprobante: TipoComprobante;
    empresa: Empresa;
    gastoPersonalLineas: GastoPersonalLinea[];

    constructor() {
        this.id = valores.cero;
        this.codigo = valores.vacio;
        this.establecimiento = valores.vacio;
        this.puntoVenta = valores.vacio;
        this.secuencial = valores.vacio;
        this.numeroComprobante = valores.vacio;
        this.fecha = new Date();
        this.estado = valores.vacio;

        this.subtotal = valores.cero;
        this.descuento = valores.cero;
        this.subtotalGravadoConDescuento = valores.cero;
        this.subtotalNoGravadoConDescuento = valores.cero;
        this.importeIvaTotal = valores.cero;
        this.total = valores.cero;

        this.comentario = valores.vacio;
        this.proveedor = new Proveedor();
        this.usuario = new Usuario();
        this.tipoComprobante = new TipoComprobante();
        this.gastoPersonalLineas = [];
    }
}