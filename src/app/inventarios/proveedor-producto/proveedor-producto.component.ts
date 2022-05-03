import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto.service';
import { Proveedor } from '../../modelos/proveedor';
import { ProveedorService } from '../../servicios/proveedor.service';
import { ProductoProveedor } from '../../modelos/producto-proveedor';
import { ProductoProveedorService } from '../../servicios/producto-proveedor.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sesion } from 'src/app/modelos/sesion';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedor-producto',
  templateUrl: './proveedor-producto.component.html',
  styleUrls: ['./proveedor-producto.component.scss']
})
export class ProveedorProductoComponent implements OnInit {

  sesion: Sesion=null;
  verPanelAsignarProveedor: boolean = false;
  abrirPanelAsignarProveedor: boolean = true;
  deshabilitarEditarProveedor: boolean = false;
  deshabilitarFiltroProveedores: boolean = false;

  producto: Producto = new Producto();
  proveedor: Proveedor = new Proveedor();
  productoProveedor: ProductoProveedor = new ProductoProveedor();

  codigoEquivalente: string = "";

  productoProveedores: ProductoProveedor[] = [];

  //Variables para los autocomplete
  productos: Producto[]=[];
  controlProducto = new FormControl();
  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();

  proveedores: Proveedor[] = [];
  controlProveedor = new FormControl();
  filtroProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();

  @ViewChild("inputFiltroProductoProveedor") inputFiltroProductoProveedor: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnasProductoProveedor: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: ProductoProveedor) => `${row.id}`},
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: ProductoProveedor) => `${row.codigo}`},
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: ProductoProveedor) => `${row.proveedor.razonSocial}`},
    { nombreColumna: 'codigo_local', cabecera: 'Código local', celda: (row: ProductoProveedor) => `${row.proveedor.codigo}`},
    { nombreColumna: 'codigo_proveedor', cabecera: 'Código proveedor', celda: (row: ProductoProveedor) => `${row.codigoEquivalente}`},
    { nombreColumna: 'acciones', cabecera: 'Acciones', celda: (row: any) => ''}
  ];
  cabeceraProductoProveedor: string[]  = this.columnasProductoProveedor.map(titulo => titulo.nombreColumna);
  dataSourceProductoProveedor: MatTableDataSource<ProductoProveedor>;
  clickedRowsProductoProveedor = new Set<ProductoProveedor>();
  
  constructor(private renderer: Renderer2, private productoService: ProductoService, private proveedorService: ProveedorService,
              private productoProveedorService: ProductoProveedorService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultarProductos();
    this.consultarProveedores();
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

  // CÓDIGO EN COMÚN
  limpiar(){
    this.producto = new Producto();
    this.abrirPanelAsignarProveedor = true;
    this.deshabilitarFiltroProveedores = false;
    this.controlProducto.patchValue('');
    this.productoProveedor = new ProductoProveedor();
    this.productoProveedores = [];
    this.dataSourceProductoProveedor = new MatTableDataSource();
    this.clickedRowsProductoProveedor = new Set<ProductoProveedor>();
    this.borrarFiltroProductoProveedor();
  };

  actualizarProducto(event: any){
    if (event!=null)
      event.preventDefault();
    if (this.producto.nombre == '') {
        Swal.fire(constantes.error, constantes.error_nombre_producto, constantes.error_swal);
        return;
    }
    console.log(this.producto);
    this.producto.kardexs[0].proveedor = new Proveedor;
    this.productoService.actualizar(this.producto).subscribe({
      next: (res) => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
        //this.consultar();
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  consultarProductos() {
    this.productoService.consultar().subscribe({
      next: (res) => {
        this.productos = res.resultado as Producto[]
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }
  private filtroProducto(value: string): Producto[] {
    if(this.productos.length>0) {
      const filterValue = value.toLowerCase();
      return this.productos.filter(producto => producto.nombre.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : '';
  }
  seleccionarProducto(){
    this.producto = this.controlProducto.value as Producto;
    this.verPanelAsignarProveedor = true;
    this.productoProveedores = this.producto.productosProveedores;
    this.llenarDataSourceProductoProveedor(this.productoProveedores);
  }

  // CODIGO PARA PROVEEDOR
  limpiarProveedor(){
    this.proveedor = new Proveedor();
    this.controlProveedor.patchValue("");
    this.codigoEquivalente = "";
    this.clickedRowsProductoProveedor.clear();
  }

  agregarProductoProveedor(){
    let existe: boolean;
    existe = this.validarProductoProveedor();
    if (existe) {
      Swal.fire(constantes.error, constantes.error_grupo_producto, constantes.error_swal);
      return;
    }
    this.productoProveedor = new ProductoProveedor();
    this.productoProveedor.producto.id = this.producto.id
    this.productoProveedor.proveedor = this.proveedor;
    this.productoProveedor.codigoEquivalente = this.codigoEquivalente;
    this.productoProveedores.push(this.productoProveedor);
    this.producto.productosProveedores = this.productoProveedores;
    this.llenarDataSourceProductoProveedor(this.productoProveedores);
    this.limpiarProveedor();
    //console.log(this.producto); 
  }

  llenarDataSourceProductoProveedor(productoProveedores : ProductoProveedor[]){
    this.dataSourceProductoProveedor = new MatTableDataSource(productoProveedores);
    this.dataSourceProductoProveedor.filterPredicate = (data: ProductoProveedor, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.proveedor.razonSocial.toUpperCase().includes(filter) || data.proveedor.codigo.toUpperCase().includes(filter) ||
      data.codigoEquivalente.toUpperCase().includes(filter);
    this.dataSourceProductoProveedor.paginator = this.paginator;
    this.dataSourceProductoProveedor.sort = this.sort;
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

  seleccionProductoProveedor(productoProveedorSeleccionado: ProductoProveedor) {
    //this.productoProveedor=productoProveedorSeleccionado;
    if (!this.clickedRowsProductoProveedor.has(productoProveedorSeleccionado)){
      this.limpiarProveedor();
      this.construirProductoProveedor(productoProveedorSeleccionado);
    } else {
      this.limpiarProveedor();
    }
  }

  construirProductoProveedor(productoProveedorSeleccionado: ProductoProveedor) {
    let productoProveedorId = 0;
    //this.productoProveedorService.currentMessage.subscribe(message => productoProveedorId = message);
    if (productoProveedorSeleccionado.id != 0) {
      this.clickedRowsProductoProveedor.add(productoProveedorSeleccionado);
      this.productoProveedor = productoProveedorSeleccionado;
      this.proveedor = this.productoProveedor.proveedor;
      //this.controlProveedor.patchValue(this.proveedor.razonSocial);
      this.controlProveedor.patchValue({razonSocial: this.proveedor.razonSocial});
      this.codigoEquivalente = this.productoProveedor.codigoEquivalente;
      this.deshabilitarEditarProveedor = true;
      //this.actualizar_precios();
    }
  }

  validarProductoProveedor():boolean{
    for (let i = 0; i < this.producto.productosProveedores.length; i++) {
      if (this.proveedor.id = this.producto.productosProveedores[i].id){
        return true;
      } else {
        return false;
      }
    }
  }

  editarProductoProveedor(){
    this.deshabilitarEditarProveedor = false;
  }
  
  actualizarProductoProveedor(){

  }

  eliminarProveedor(event: any) {
    if (event != null)
    event.preventDefault();
    if (confirm("Realmente quiere eliminar el proveedor?")) {
    this.productoProveedorService.eliminar(this.productoProveedor).subscribe({
      next: (res) => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        //this.consultar();
      },
      error: (err) => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  /*    this.recaudacion.depositos.splice(i, 1);
      this.dataDepositos = new MatTableDataSource<Deposito>(this.recaudacion.depositos);
      this.dataDepositos.sort = this.sort;
      this.dataDepositos.paginator = this.paginator;
      this.recaudacion.calcularTotales();
      this.seleccionarValorPagado();
      this.defectoRecaudacion();*/
    }

  }

  // Metodos para los autocomplete
  consultarProveedores(){
    this.proveedorService.consultar().subscribe(
      res => {
        this.proveedores = res.resultado as Proveedor[];
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
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
    //console.log(this.proveedor.codigo);
  }

}
