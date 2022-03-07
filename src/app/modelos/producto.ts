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
    this.id=0;
    this.codigo="";
    this.nombre="";
    this.consignacion=false;
    this.serieAutogenerado=0;
    this.stockTotal=0;
    this.estado="ACTIVO";
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
