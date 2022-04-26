import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto.service';
import { Bodega } from '../../modelos/bodega';
import { BodegaService } from '../../servicios/bodega.service';
import { ProductoBodega } from '../../modelos/producto-bodega';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Sesion } from 'src/app/modelos/sesion';

@Component({
  selector: 'app-transferencia-bodega',
  templateUrl: './transferencia-bodega.component.html',
  styleUrls: ['./transferencia-bodega.component.scss']
})
export class TransferenciaBodegaComponent implements OnInit {

  sesion: Sesion=null;
  verPanelAsignarBodega: boolean = false;
  abrirPanelAsignarBodega:boolean = true;
  deshabilitarFiltroBodega: boolean = false;

  producto: Producto = new Producto();
  bodegaDestino: Bodega = new Bodega();
  productoBodega: ProductoBodega = new ProductoBodega();

  //cantidadBodegaOrigen:number = 0;
  cantidadBodegaDestino:number = 0;

  productosBodegas: ProductoBodega[] = [];

  //Variables para los autocomplete
  productos: Producto[]=[];
  seleccionProducto = new FormControl();
  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();

  bodegasDestinoTodas: Bodega[] = [];
  bodegasDestino: Bodega[] = [];
  seleccionBodegaDestino = new FormControl();
  filtroBodegasDestino: Observable<Bodega[]> = new Observable<Bodega[]>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  columnasProductoBodega: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: ProductoBodega) => `${row.id}`},
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: ProductoBodega) => `${row.codigo}`},
    { nombreColumna: 'codigo_bodega', cabecera: 'Código bodega', celda: (row: ProductoBodega) => `${row.bodega.codigo}`},
    { nombreColumna: 'nombre_bodega', cabecera: 'Nombre Bodega', celda: (row: ProductoBodega) => `${row.bodega.nombre}`},
    { nombreColumna: 'cantidad', cabecera: 'Cantidad', celda: (row: ProductoBodega) => `${row.cantidad}`},
    { nombreColumna: 'acciones', cabecera: 'Acciones', celda: (row: any) => ''}
  ];
  cabeceraProductoBodega: string[]  = this.columnasProductoBodega.map(titulo => titulo.nombreColumna);
  dataSourceProductoBodega: MatTableDataSource<ProductoBodega>;
  clickedRowsBodega = new Set<ProductoBodega>();

  constructor(private productoService: ProductoService, private bodegaService: BodegaService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultarProductos();
    this.consultarBodegasDestino();
    this.filtroProductos = this.seleccionProducto.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(producto => typeof producto === 'string' ? this.filtroProducto(producto) : this.productos.slice())
      );

      this.filtroBodegasDestino = this.seleccionBodegaDestino.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(bodegaDestino => typeof bodegaDestino === 'string' ? this.filtroBodegaDestino(bodegaDestino) : this.bodegasDestino.slice())
      );
  }

  // CÓDIGO EN COMÚN
  limpiar(){
    this.producto = new Producto();
    this.verPanelAsignarBodega = false;
    this.abrirPanelAsignarBodega = false;
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
    this.verPanelAsignarBodega = true;
    this.productosBodegas = this.producto.productosBodegas;
    this.llenarDataSourceProductoBodega(this.productosBodegas);
  }

  // CODIGO PARA BODEGA
  limpiarBodega(){
    this.productoBodega = new ProductoBodega();
    this.bodegaDestino = new Bodega();
    this.clickedRowsBodega.clear();
    this.seleccionBodegaDestino.patchValue("");
    this.cantidadBodegaDestino = 0;
  }

  agregarProductoBodega(){
    this.calcularCantidadBodegaOrigen(this.productoBodega);
    this.productoBodega = new ProductoBodega();
    this.productoBodega.producto.id = this.producto.id
    this.productoBodega.bodega = this.bodegaDestino;
    this.productoBodega.cantidad = this.cantidadBodegaDestino;
    this.productosBodegas.push(this.productoBodega);
    this.producto.productosBodegas = this.productosBodegas;
    this.llenarDataSourceProductoBodega(this.productosBodegas);
    this.limpiarBodega();
    console.log(this.producto);
  }

  calcularCantidadBodegaOrigen(productoBodegaModificar: ProductoBodega){
    for (let i = 0; i < this.productosBodegas.length; i++) {
      if (this.productosBodegas[i].bodega.id == productoBodegaModificar.bodega.id) {
        this.productosBodegas[i].cantidad = this.productosBodegas[i].cantidad-this.cantidadBodegaDestino;
        //console.log('elim', this.medidas_equivalentes);
      }
    }
  }

  llenarDataSourceProductoBodega(productosBodegas : ProductoBodega[]){
    this.dataSourceProductoBodega = new MatTableDataSource(productosBodegas);
    this.dataSourceProductoBodega.filterPredicate = (data: ProductoBodega, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.bodega.codigo.toUpperCase().includes(filter) || data.bodega.nombre.toUpperCase().includes(filter);
    this.dataSourceProductoBodega.paginator = this.paginator;
    this.dataSourceProductoBodega.sort = this.sort;
  }

  filtroProductoBodega(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProductoBodega.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceProductoBodega.paginator) {
      this.dataSourceProductoBodega.paginator.firstPage();
    }
  }

  seleccionProductoBodega(productoBodegaSeleccionado: ProductoBodega) {
    this.productoBodega=productoBodegaSeleccionado;
    if (!this.clickedRowsBodega.has(productoBodegaSeleccionado)){
      this.clickedRowsBodega.clear();
      this.clickedRowsBodega.add(productoBodegaSeleccionado);
      this.productoBodega = productoBodegaSeleccionado;
      this.eliminarBodegaDestinoSeleccionada(productoBodegaSeleccionado.bodega);
    } else {
      //this.clickedRowsBodega.clear();
      //this.productoBodega = new ProductoBodega();
      this.limpiarBodega();
    }
  }

  eliminarBodegaDestinoSeleccionada(bodegaSeleccionada: Bodega){
    this.bodegasDestino = this.bodegasDestinoTodas;
    for (let i = 0; i < this.bodegasDestino.length; i++) {
      if (this.bodegasDestino[i].id == bodegaSeleccionada.id) {
        this.bodegasDestino.splice(i, 1);
        //console.log('elim', this.medidas_equivalentes);
      }
    }
  }

  buscarBodega(){

  }
  
  editarBodega(i: number){
    /*this.indiceEditar=i;
    this.deposito= {... this.recaudacion.depositos [this.indiceEditar] };
    this.seleccionBancoDeposito.setValue(this.deposito.banco);
    this.habilitarEditarDeposito=true;*/
  }
  confirmarEditarBodega(){
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

  eliminarBodega(i: number) {
    if (confirm("Realmente quiere eliminar la bodega?")) {
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
  consultarBodegasDestino(){
    this.bodegaService.consultar().subscribe(
      res => {
        this.bodegasDestinoTodas = res.resultado as Bodega[];
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
  }
  private filtroBodegaDestino(value: string): Bodega[] {
    if(this.productos.length>0) {
      const filterValue = value.toLowerCase();
      return this.bodegasDestino.filter(bodegaDestino => bodegaDestino.nombre.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBodegaDestino(bodegaDestino: Bodega): string {
    return bodegaDestino && bodegaDestino.nombre ? bodegaDestino.nombre : '';
  } 
  seleccionarBodegaDestino(){
    this.bodegaDestino = this.seleccionBodegaDestino.value as Bodega;
    //console.log(this.proveedor.codigo);
  }

}
