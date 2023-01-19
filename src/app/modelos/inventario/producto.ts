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
  consignacion: boolean;
  stockTotal: number;
  serieAutogenerado: number;
  estado: string;
  categoriaProducto: CategoriaProducto;
  tipoGasto: TipoGasto;
  impuesto: Impuesto;
  grupoProducto: GrupoProducto;
  medida: Medida;

  kardexs: Kardex[];
  caracteristicas: Caracteristica[];
  precios: Precio[];
  productosProveedores: ProductoProveedor[];
  productosBodegas: ProductoBodega[];
  

  constructor() {
    this.id=valores.cero;
    this.codigo=valores.vacio;
    this.nombre=valores.vacio;
    this.consignacion=false;
    this.stockTotal=valores.cero;
    this.serieAutogenerado=valores.cero;
    this.estado=valores.activo;
    
    this.impuesto=new Impuesto();
    this.tipoGasto=new TipoGasto();
    this.grupoProducto=new GrupoProducto();
    this.categoriaProducto=new CategoriaProducto();
    this.medida=new Medida();

    this.kardexs=[];
    this.caracteristicas=[];
    this.precios=[];
    this.productosProveedores=[];
    this.productosBodegas=[];
    
  }
}
