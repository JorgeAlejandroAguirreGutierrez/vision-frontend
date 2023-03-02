import { Component, OnInit, ElementRef } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal, warning, warning_swal, si_seguro } from '../../constantes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Producto } from '../../modelos/inventario/producto';
import { TipoGasto } from '../../modelos/inventario/tipo-gasto';
import { TipoGastoService } from '../../servicios/inventario/tipo-gasto.service';
import { Impuesto } from '../../modelos/inventario/impuesto';
import { ImpuestoService } from '../../servicios/inventario/impuesto.service';
import { Medida } from '../../modelos/inventario/medida';
import { MedidaService } from '../../servicios/inventario/medida.service';
import { Precio } from '../../modelos/inventario/precio';
import { SegmentoService } from '../../servicios/cliente/segmento.service';
import { Segmento } from '../../modelos/cliente/segmento';
import { ProductoService } from '../../servicios/inventario/producto.service';
import { CategoriaProductoService } from '../../servicios/inventario/categoria-producto.service';
import { CategoriaProducto } from '../../modelos/inventario/categoria-producto';
import { Router } from '@angular/router';
import { Proveedor } from '../../modelos/compra/proveedor';
import { ProveedorService } from '../../servicios/compra/proveedor.service';
import { Bodega } from '../../modelos/inventario/bodega';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss']
})

export class ServicioComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;
  si: string = valores.si;
  no: string = valores.no;
  costo: number = valores.cero;

  sesion: Sesion = null;

  abrirPanelNuevo: boolean = true;
  abrirPanelPrecio: boolean = false;
  abrirPanelAdmin: boolean = false;
  
  servicio: Producto = new Producto();

  servicios: Producto[];
  tiposGastos: TipoGasto[] = [];
  segmentos: Segmento[] = [];
  impuestos: Impuesto[] = [];
  medidas: Medida[] = [];
  bodegas: Bodega[] = [];
  proveedores: Proveedor[] = [];

  cabeceraPrecios: string[] = ['segmento', 'costo', 'margenGanancia', 'precioSinIva', 'precioVentaPublico', 'precioVentaPublicoManual', 'utilidad', 'utilidadPorcentaje'];

  dataSourcePrecios: BehaviorSubject<Precio[]> = new BehaviorSubject<Precio[]>([]);

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Producto) => `${row.codigo}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Producto) => `${row.nombre}` },
    { nombreColumna: 'categoriaProducto', cabecera: 'Categoria', celda: (row: Producto) => `${row.categoriaProducto.descripcion}` },
    { nombreColumna: 'tipoGasto', cabecera: 'Tipo Gasto', celda: (row: Producto) => `${row.tipoGasto.descripcion}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Producto) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Producto>;
  clickedRows = new Set<Producto>();
  
  cabeceraPrecioSugerido: string[] = ['medida', 'segmento', 'costo', 'margenGanancia', 'precioSinIva', 'precioVentaPublico'];
  cabeceraPrecioVenta: string[] = ['precioVentaPublicoManual', 'utilidad', 'utilidadPorcentaje'];

  controls: UntypedFormArray[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(public dialog: MatDialog, private sesionService: SesionService, private productoService: ProductoService,  private proveedorService: ProveedorService,
    private tipoGastoService: TipoGastoService, private impuestoService: ImpuestoService, private router: Router,
    private segmentoService: SegmentoService, private categoriaProductoService: CategoriaProductoService,
    private medidaService: MedidaService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
    this.obtenerCategoriaProducto(valores.servicio);
    this.consultarTipoGasto();
    this.consultarImpuesto();
    this.consultarSegmento();
    this.consultarProveedor();
  }

  obtenerCategoriaProducto(abreviatura: string){
    this.categoriaProductoService.obtenerPorAbreviatura(abreviatura).subscribe(
      res => {
        this.servicio.categoriaProducto = res.resultado as CategoriaProducto;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarTipoGasto(){
    this.tipoGastoService.consultar().subscribe(
      res => {
        this.tiposGastos = res.resultado as TipoGasto[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarImpuesto(){
    this.impuestoService.consultar().subscribe(
      res => {
        this.impuestos = res.resultado as Impuesto[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarSegmento(){
    this.segmentoService.consultar().subscribe(
      res => {
        this.segmentos = res.resultado as Segmento[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarProveedor(){
    this.proveedorService.consultar().subscribe(
      res => {
        this.proveedores = res.resultado as Proveedor[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  nuevo(event){
    if (event != null)
      event.preventDefault();
    this.servicio = new Producto();
  }

  limpiar() {
    this.servicio = new Producto();
    this.dataSourcePrecios = new BehaviorSubject<Precio[]>([]);
    this.clickedRows.clear();
  }

  crear(event: any) {
    if (event != null)
      event.preventDefault();
    console.log(this.servicio);
    if (this.servicio.categoriaProducto.id == valores.cero) {
      Swal.fire(error, mensajes.error_tipo_producto, error_swal);
      return;
    }
    if (this.servicio.nombre == valores.vacio) {
      Swal.fire(error, mensajes.error_nombre_producto, error_swal);
      return;
    }
    if (this.servicio.impuesto.id == valores.cero) {
      Swal.fire(error, mensajes.error_impuesto, error_swal);
      return;
    }
    if (this.servicio.tipoGasto.id == valores.cero) {
      Swal.fire(error, mensajes.error_tipo_gasto, error_swal);
      return;
    }
    if (this.servicio.precios.length == valores.cero) {
      Swal.fire(error, mensajes.error_precio, error_swal);
      return;
    }
    this.productoService.crear(this.servicio).subscribe({
      next: (res) => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
        this.consultar();
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    if (this.servicio.categoriaProducto.id == valores.cero) {
      Swal.fire(error, mensajes.error_tipo_producto, error_swal);
      return;
    }
    if (this.servicio.nombre == valores.vacio) {
      Swal.fire(error, mensajes.error_nombre_producto, error_swal);
      return;
    }
    if (this.servicio.impuesto.id == valores.cero) {
      Swal.fire(error, mensajes.error_impuesto, error_swal);
      return;
    }
    if (this.servicio.tipoGasto.id == valores.cero) {
      Swal.fire(error, mensajes.error_tipo_gasto, error_swal);
      return;
    }
    if (this.servicio.precios.length == valores.cero) {
      Swal.fire(error, mensajes.error_precio, error_swal);
      return;
    }
    this.productoService.actualizar(this.servicio).subscribe({
      next: (res) => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.productoService.activar(this.servicio).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.productoService.inactivar(this.servicio).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.productoService.consultarServicio().subscribe({
      next: res => {
        this.servicios = res.resultado as Producto[];
        this.llenarTabla(this.servicios);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(servicios: Producto[]) {
    this.dataSource = new MatTableDataSource(servicios);
    this.dataSource.filterPredicate = (data: Producto, filter: string): boolean =>
      data.codigo.includes(filter) || data.nombre.includes(filter) || data.tipoGasto.descripcion.includes(filter) ||
      data.categoriaProducto.descripcion.includes(filter) || data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.firstPage();
    this.dataSource.sort = this.sort;
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  seleccion(servicio: Producto) {
    if (!this.clickedRows.has(servicio)) {
      this.clickedRows.clear();
      this.clickedRows.add(servicio);
      this.servicio = { ... servicio};
      this.cargar();
    } else {
      this.nuevo(null);
    }
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  cargar(){
    this.dataSourcePrecios = new BehaviorSubject<Precio[]>(this.servicio.precios);
  }
  
  pad(numero:string, size:number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }

  calcularPrecios() {
    if (this.costo < valores.cero) {
      Swal.fire(error, mensajes.error_cantidad, error_swal);
      return;
    }
    this.servicio.precios = [];
    for (let i = 0; i < this.segmentos.length; i++) {
      let precio = new Precio();
      precio.costo = this.costo;
      precio.margenGanancia = this.segmentos[i].margenGanancia;
      precio.precioSinIva = Number((precio.costo / (1 - precio.margenGanancia / 100)).toFixed(4));
      precio.precioVentaPublico = Number((precio.precioSinIva + (precio.precioSinIva * this.servicio.impuesto.porcentaje / 100)).toFixed(4));
      precio.precioVentaPublicoManual = precio.precioVentaPublico;
      precio.utilidad = Number((precio.precioSinIva - precio.costo).toFixed(4));
      precio.utilidadPorcentaje = Number(((precio.utilidad / precio.precioSinIva) * 100).toFixed(2));
      precio.segmento = this.segmentos[i];
      this.servicio.precios.push(precio);
    }
    this.dataSourcePrecios = new BehaviorSubject<Precio[]>(this.servicio.precios);
    this.abrirPanelPrecio = true;
    Swal.fire({ icon: exito_swal, title: exito, text: mensajes.exito_kardex_inicializado });
  }

  actualizarPrecioVentaPublicoManual(){
    for (let i = 0; i < this.servicio.precios.length; i++) {
      if(this.servicio.precios[i].precioVentaPublicoManual < this.servicio.precios[i].precioVentaPublico){
        Swal.fire(error, mensajes.error_precio_venta_publico_manual, error_swal);
      }
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }
}