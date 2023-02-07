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
  consignacion: string;
  stockTotal: number;
  //serieAutogenerado: number;
  estado: string;
  categoriaProducto: CategoriaProducto;
  grupoProducto: GrupoProducto;
  impuesto: Impuesto;
  medida: Medida;
  tipoGasto: TipoGasto;

  kardexs: Kardex[];
  //caracteristicas: Caracteristica[];
  precios: Precio[];
  productosProveedores: ProductoProveedor[];
  productosBodegas: ProductoBodega[];
  

  constructor() {
    this.id=valores.cero;
    this.codigo=valores.vacio;
    this.nombre=valores.vacio;
    this.consignacion=valores.no;
    this.stockTotal=valores.cero;
    //this.serieAutogenerado=valores.cero;
    this.estado=valores.activo;
    this.categoriaProducto=new CategoriaProducto();
    this.grupoProducto=new GrupoProducto();
    this.impuesto=new Impuesto();
    this.medida=new Medida();
    this.tipoGasto=new TipoGasto();

    this.kardexs=[];
    //this.caracteristicas=[];
    this.precios=[];
    this.productosProveedores=[];
    this.productosBodegas=[];
    
  }
}
