import { CategoriaProducto } from './categoria-producto';
import { Impuesto } from './impuesto';
import { Caracteristica } from './caracteristica';
import { TipoGasto } from './tipo-gasto';
import { GrupoProducto } from './grupo-producto';
import { Medida } from './medida';
import { Precio } from './precio';
import { Kardex } from './kardex';
import { ProductoProveedor } from './producto-proveedor';
import { ProductoBodega } from './producto-bodega';
import { valores } from "../../constantes";
export class Producto {
  id: number;
  codigo: string;
  nombre: string;
  costo: number;
  consignacion: boolean;
  estado: string;
  serieAutogenerado: number;
  stockTotal: number;
  impuesto: Impuesto;
  tipoGasto: TipoGasto;
  grupoProducto: GrupoProducto;
  categoriaProducto: CategoriaProducto;
  medidaKardex: Medida;
  caracteristicas: Caracteristica[];
  precios: Precio[];
  productosProveedores: ProductoProveedor[];
  productosBodegas: ProductoBodega[];
  kardexs: Kardex[];

  constructor() {
    this.id=valores.cero;
    this.codigo=valores.vacio;
    this.nombre=valores.vacio;
    this.consignacion=false;
    this.serieAutogenerado=valores.cero;
    this.stockTotal=valores.cero;
    this.estado=valores.activo;
    this.caracteristicas=[];
    this.impuesto=new Impuesto();
    this.tipoGasto=new TipoGasto();
    this.grupoProducto=new GrupoProducto();
    this.categoriaProducto=new CategoriaProducto();
    this.medidaKardex=new Medida();
    this.precios=[];
    this.productosProveedores=[];
    this.productosBodegas=[];
    this.kardexs=[];
  }
}
