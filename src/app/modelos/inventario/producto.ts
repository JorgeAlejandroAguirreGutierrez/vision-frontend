import { CategoriaProducto } from './categoria-producto';
import { Impuesto } from './impuesto';
import { TipoGasto } from './tipo-gasto';
import { GrupoProducto } from './grupo-producto';
import { Precio } from './precio';
import { Kardex } from './kardex';
import { valores } from "../../constantes";
import { Medida } from './medida';
import { Proveedor } from '../compra/proveedor';
import { Bodega } from './bodega';
import { Empresa } from '../usuario/empresa';
export class Producto {
  id: number;
  codigo: string;
  nombre: string;
  consignacion: string;
  estado: string;
  categoriaProducto: CategoriaProducto;
  grupoProducto: GrupoProducto;
  tipoGasto: TipoGasto;
  impuesto: Impuesto;
  medida: Medida;
  proveedor: Proveedor;
  bodega: Bodega;
  empresa: Empresa;
  precios: Precio[];
  kardexs: Kardex[];
  

  constructor() {
    this.id = valores.cero;
    this.codigo = valores.vacio;
    this.nombre = valores.vacio;
    this.consignacion = valores.vacio;
    this.estado = valores.activo;
    this.categoriaProducto = new CategoriaProducto();
    this.grupoProducto = new GrupoProducto();
    this.tipoGasto = new TipoGasto();
    this.impuesto = new Impuesto();
    this.medida = new Medida();
    this.proveedor = new Proveedor();
    this.bodega = new Bodega();
    this.precios=[];
    this.kardexs=[];
    this.kardexs.push(new Kardex());    
  }
}
