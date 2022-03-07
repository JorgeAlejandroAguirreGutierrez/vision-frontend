import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';

import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto.service';
import { Proveedor } from '../../modelos/proveedor';
import { ProveedorService } from '../../servicios/proveedor.service';
import { ProductoProveedor } from '../../modelos/producto-proveedor';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-proveedor-producto',
  templateUrl: './proveedor-producto.component.html',
  styleUrls: ['./proveedor-producto.component.scss']
})
export class ProveedorProductoComponent implements OnInit {

  verPanelAsignarProveedor: boolean = false;
  abrirPanelAsignarProveedor: boolean = true;
  deshabilitarFiltroProveedores: boolean = false;

  producto: Producto = new Producto();
  proveedor: Proveedor = new Proveedor();
  productoProveedor: ProductoProveedor = new ProductoProveedor();

  codigoEquivalente: string = "";

  productoProveedores: ProductoProveedor[] = [];

  //Variables para los autocomplete
  productos: Producto[]=[];
  seleccionProducto = new FormControl();
  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();

  proveedores: Proveedor[] = [];
  seleccionProveedor = new FormControl();
  filtroProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();

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
  
  constructor(private productoService: ProductoService, private proveedorService: ProveedorService) { }

  ngOnInit() {
    this.consultarProductos();
    this.consultarProveedores();
    this.filtroProductos = this.seleccionProducto.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(producto => typeof producto === 'string' ? this.filtroProducto(producto) : this.productos.slice())
      );

    this.filtroProveedores = this.seleccionProveedor.valueChanges
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
  };

  actualizarProducto(event: any){
    if (event!=null)
      event.preventDefault();
    if (this.producto.nombre == '') {
        Swal.fire(constantes.error, constantes.error_nombre_producto, constantes.error_swal);
        return;
    }
    this.productoService.actualizar(this.producto).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.limpiar();
        //this.consultar();
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
  }

  consultarProductos() {
    this.productoService.consultar().subscribe(
    res => {
      this.productos = res.resultado as Producto[]
    },
    err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
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
    this.producto = this.seleccionProducto.value as Producto;
    this.verPanelAsignarProveedor = true;
    this.productoProveedores = this.producto.productosProveedores;
    this.llenarDataSourceProductoProveedor(this.productoProveedores);
  }

  // CODIGO PARA PROVEEDOR
  limpiarProveedor(){
    this.proveedor = new Proveedor();
    this.seleccionProveedor.patchValue("");
    this.codigoEquivalente = "";
  }

  agregarProductoProveedor(){
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
      data.codigo.toUpperCase().includes(filter) || data.proveedor.razonSocial.toUpperCase().includes(filter) || data.producto.codigo.toUpperCase().includes(filter) ||
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

  seleccionProductoProveedor(productoProveedorSeleccionado: ProductoProveedor) {
    this.productoProveedor=productoProveedorSeleccionado;
    if (!this.clickedRowsProductoProveedor.has(productoProveedorSeleccionado)){
      this.clickedRowsProductoProveedor.clear();
      this.clickedRowsProductoProveedor.add(productoProveedorSeleccionado);
      this.productoProveedor = productoProveedorSeleccionado;
    } else {
      this.clickedRowsProductoProveedor.clear();
      this.productoProveedor = new ProductoProveedor();
    }
  }

  buscarProveedor(){

  }

  
  editarProveedor(i: number){
    /*this.indiceEditar=i;
    this.deposito= {... this.recaudacion.depositos [this.indiceEditar] };
    this.seleccionBancoDeposito.setValue(this.deposito.banco);
    this.habilitarEditarDeposito=true;*/
  }
  confirmarEditarProveedor(){
   /* this.recaudacion.depositos[this.indiceEditar]=this.deposito;
    this.deposito=new Deposito();
    this.seleccionBancoDeposito.setValue(null);
    this.habilitarEditarDeposito=false;
    this.dataDepositos = new MatTableDataSource<Deposito>(this.recaudacion.depositos);
    this.dataDepositos.sort = this.sort;
    this.dataDepositos.paginator = this.paginator;
    this.recaudacion.calcularTotales();
    this.seleccionarValorPagado();
    this.defectoRecaudacion();*/
  }

  eliminarProveedor(i: number) {
    if (confirm("Realmente quiere eliminar el proveedor?")) {
      console.log('i es: '+i);
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
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
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
    this.proveedor = this.seleccionProveedor.value as Proveedor;
    //console.log(this.proveedor.codigo);
  }

}
