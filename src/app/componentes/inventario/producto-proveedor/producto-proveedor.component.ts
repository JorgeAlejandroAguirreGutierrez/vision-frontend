import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Sesion } from 'src/app/modelos/acceso/sesion';
import { SesionService } from 'src/app/servicios/acceso/sesion.service';
import { Empresa } from '../../../modelos/acceso/empresa';
import { Producto } from '../../../modelos/inventario/producto';
import { ProductoService } from '../../../servicios/inventario/producto.service';
import { Proveedor } from '../../../modelos/compra/proveedor';
import { ProveedorService } from '../../../servicios/compra/proveedor.service';
import { ProductoProveedor } from '../../../modelos/inventario/producto-proveedor';
import { ProductoProveedorService } from '../../../servicios/inventario/producto-proveedor.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-producto-proveedor',
  templateUrl: './producto-proveedor.component.html',
  styleUrls: ['./producto-proveedor.component.scss']
})

export class ProductoProveedorComponent implements OnInit {

  activo: string = valores.estadoActivo;
  inactivo: string = valores.estadoInactivo;
  si: string = valores.si;
  no: string = valores.no;

  abrirPanelAsignarProveedor: boolean = true;
  verBotones: boolean = false;
  deshabilitarEditarProveedor: boolean = true;
  deshabilitarFiltroProveedores: boolean = true;
  verActualizarProveedor: boolean = false;
  verActualizarProducto: boolean = false;

  codigoEquivalente: string = "";

  sesion: Sesion=null;
  empresa: Empresa = new Empresa();
  producto: Producto = new Producto();
  proveedor: Proveedor = new Proveedor();
  productoProveedor: ProductoProveedor = new ProductoProveedor();

  productos: Producto[]=[];
  proveedores: Proveedor[] = [];
  productoProveedores: ProductoProveedor[] = [];

  controlProducto = new UntypedFormControl();
  controlProveedor = new UntypedFormControl();

  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  filtroProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();

  columnasProductoProveedor: any[] = [
    { nombreColumna: 'codigo_propio', cabecera: 'Código propio', celda: (row: ProductoProveedor) => `${row.proveedor.codigo}`},
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: ProductoProveedor) => `${row.proveedor.razonSocial}`},
    { nombreColumna: 'codigo_proveedor', cabecera: 'Código proveedor', celda: (row: ProductoProveedor) => `${row.codigoEquivalente}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: ProductoProveedor) => `${row.estado}`},
    { nombreColumna: 'acciones', cabecera: 'Acciones'}
  ];
  cabeceraProductoProveedor: string[]  = this.columnasProductoProveedor.map(titulo => titulo.nombreColumna);
  dataSourceProductoProveedor: MatTableDataSource<ProductoProveedor>;
  clickedRowsProductoProveedor = new Set<ProductoProveedor>();

  @ViewChild("inputFiltroProductoProveedor") inputFiltroProductoProveedor: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private renderer: Renderer2, private productoService: ProductoService, private proveedorService: ProveedorService,
            private productoProveedorService: ProductoProveedorService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.controlProveedor.disable();
    this.consultarProductos();
    this.consultarProveedores();
    this.inicializarFiltros();
  }

  consultarProductos() {
    this.productoService.consultarPorCategoriaProductoYEmpresaYEstado(valores.bien, this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.productos = res.resultado as Producto[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    });
  }
  consultarProveedores(){
    this.proveedorService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.proveedores = res.resultado as Proveedor[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  nuevo(){
    this.producto = new Producto();
    this.productoProveedor = new ProductoProveedor();
    this.productoProveedores = [];
    this.abrirPanelAsignarProveedor = true;
    this.deshabilitarFiltroProveedores = true;
    this.verBotones = false;
    this.deshabilitarEditarProveedor = false;
    this.verActualizarProducto = false;
    this.controlProveedor.disable();
    this.controlProducto.patchValue('');
    this.dataSourceProductoProveedor = new MatTableDataSource<ProductoProveedor>([]);
    this.clickedRowsProductoProveedor = new Set<ProductoProveedor>();
    this.borrarFiltroProductoProveedor();
    this.nuevoProveedor();
  };

  crear(event: any){
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.productoProveedorService.crear(this.productoProveedor).subscribe({
      next: (res) => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.nuevo();
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  seleccionarProducto(){
    this.producto = this.controlProducto.value as Producto;
    this.consultarProductoProveedor();
    this.verBotones = true;
    this.controlProveedor.enable();
    this.deshabilitarEditarProveedor = false;

  }

  consultarProductoProveedor(){
    this.productoProveedorService.consultarPorProductoYEstado(this.producto.id, valores.estadoActivo).subscribe({
      next: res => {
        this.productoProveedores = res.resultado as ProductoProveedor[];
        if (this.productoProveedores.length > 0) {
          this.llenarTablaProductoProveedor(this.productoProveedores);
        }
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    });
  }

  // CODIGO PARA PROVEEDOR
  nuevoProveedor(){
    this.proveedor = new Proveedor();
    this.controlProveedor.patchValue("");
    this.controlProveedor.enable();
    this.deshabilitarEditarProveedor = false;
    this.codigoEquivalente = "";
    this.verActualizarProveedor = false;
    this.clickedRowsProductoProveedor.clear();
  }

  agregarProductoProveedor(){
    let existe: boolean;
    existe = this.existeProductoProveedor();
    if (existe) {
      Swal.fire(error, mensajes.error_producto_proveedor, error_swal);
      return;
    }
    this.productoProveedor = new ProductoProveedor();
    this.productoProveedor.producto = this.producto;
    this.productoProveedor.proveedor = this.proveedor;
    this.productoProveedor.codigoEquivalente = this.codigoEquivalente;
    this.productoProveedores.push(this.productoProveedor);
    //this.producto.productosProveedores = this.productoProveedores;
    this.llenarTablaProductoProveedor(this.productoProveedores);
    this.verActualizarProducto = true;
    this.nuevoProveedor();
  }

  llenarTablaProductoProveedor(productoProveedores : ProductoProveedor[]){
    this.dataSourceProductoProveedor = new MatTableDataSource(productoProveedores);
    this.dataSourceProductoProveedor.filterPredicate = (data: ProductoProveedor, filter: string): boolean =>
      data.proveedor.codigo.toUpperCase().includes(filter) || data.proveedor.razonSocial.toUpperCase().includes(filter) ||
      data.codigoEquivalente.toUpperCase().includes(filter);
    this.dataSourceProductoProveedor.paginator = this.paginator;
    this.dataSourceProductoProveedor.sort = this.sort;
  }

  seleccionProductoProveedor(productoProveedorSeleccionado: ProductoProveedor) {
    if (!this.clickedRowsProductoProveedor.has(productoProveedorSeleccionado)){
      this.nuevoProveedor();
      this.construirProductoProveedor(productoProveedorSeleccionado);
    } else {
      this.nuevoProveedor();  
    }
  }

  filtroProductoProveedor(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProductoProveedor.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceProductoProveedor.paginator) {
      this.dataSourceProductoProveedor.paginator.firstPage();
    }
  }
  borrarFiltroProductoProveedor(){
    this.renderer.setProperty(this.inputFiltroProductoProveedor.nativeElement, 'value', '');
    //Funciona, pero es mala práctica
    //this.inputFiltroProductoProveedor.nativeElement.value = '';
    this.dataSourceProductoProveedor.filter = '';
  }

  editarProductoProveedor(){
    this.verActualizarProveedor = true;
    this.deshabilitarEditarProveedor = false;
  }
  
  actualizarProductoProveedor(){
    this.productoProveedor.codigoEquivalente = this.codigoEquivalente;
    this.verActualizarProducto = true;
    this.nuevoProveedor();
  }

  eliminarProductoProveedor(index: number){

  }

  construirProductoProveedor(productoProveedorSeleccionado: ProductoProveedor) {
    //this.productoProveedorService.currentMessage.subscribe(message => productoProveedorId = message);
    if (productoProveedorSeleccionado.proveedor.id != 0) {
      this.clickedRowsProductoProveedor.add(productoProveedorSeleccionado);
      this.productoProveedor = productoProveedorSeleccionado;
      this.proveedor = this.productoProveedor.proveedor;
      //this.controlProveedor.patchValue(this.proveedor.razonSocial);
      this.controlProveedor.patchValue({razonSocial: this.proveedor.razonSocial});
      this.controlProveedor.disable();
      this.codigoEquivalente = this.productoProveedor.codigoEquivalente;
      this.deshabilitarEditarProveedor = true;
      //this.actualizar_precios();
    }
  }

  existeProductoProveedor():boolean{
    /*for (let i = 0; i < this.producto.productosProveedores.length; i++) {
      if (this.proveedor.id == this.producto.productosProveedores[i].proveedor.id){
        return true;
      }
    }*/
    return false;
  }



  //FILTROS AUTOCOMPLETE
  inicializarFiltros(){
    this.filtroProductos = this.controlProducto.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(producto => typeof producto === 'string' ? this.filtroProducto(producto) : this.productos.slice())
      );

    this.filtroProveedores = this.controlProveedor.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(proveedor => typeof proveedor === 'string' ? this.filtroProveedor(proveedor) : this.proveedores.slice())
      );
  }
  
  private filtroProducto(value: string): Producto[] {
    if(this.productos.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.productos.filter(producto => producto.nombre.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : '';
  }

  private filtroProveedor(value: string): Proveedor[] {
    if(this.productos.length>0) {
      const filterValue = value.toLowerCase();
      return this.proveedores.filter(proveedor => proveedor.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.razonSocial ? proveedor.razonSocial : '';
  } 
  seleccionarProveedor(){
    this.proveedor = this.controlProveedor.value as Proveedor;
  }

    //VALIDACIONES
  validarFormulario(): boolean {
    if (this.producto.nombre == valores.vacio) {
      Swal.fire(error, mensajes.error_nombre_producto, error_swal);
      return false;
    }
    return true;
  }
}
