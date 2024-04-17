import { Proveedor } from './proveedor';
import { valores } from "../../constantes";
import { Empresa } from '../acceso/empresa';
import { Usuario } from '../acceso/usuario';
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
    
    subtotalGravado: number;
    subtotalNoGravado: number;
    importeIvaTotal: number;
    total: number;

    comentario: string;
    tipoGasto: TipoGasto;
    proveedor: Proveedor;
    usuario: Usuario;
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
        this.importeIvaTotal = valores.cero;
        this.total = valores.cero;

        this.comentario = valores.vacio;
        this.tipoGasto = new TipoGasto();
        this.proveedor = new Proveedor();
        this.usuario = new Usuario();
        this.gastoPersonalLineas = [];
    }
}