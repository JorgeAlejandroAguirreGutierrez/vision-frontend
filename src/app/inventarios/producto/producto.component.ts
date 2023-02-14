import { Component, OnInit, HostListener, Type, Inject, ElementRef, Renderer2 } from '@angular/core';
import { UntypedFormControl, UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal, warning, warning_swal, si_seguro } from '../../constantes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { GrupoProducto } from '../../modelos/inventario/grupo-producto';
import { Producto } from '../../modelos/inventario/producto';
import { TipoGasto } from '../../modelos/inventario/tipo-gasto';
import { TipoGastoService } from '../../servicios/inventario/tipo-gasto.service';
import { Impuesto } from '../../modelos/inventario/impuesto';
import { ImpuestoService } from '../../servicios/inventario/impuesto.service';
import { Medida } from '../../modelos/inventario/medida';
import { MedidaService } from '../../servicios/inventario/medida.service';
import { Precio } from '../../modelos/inventario/precio';
import { SegmentoService } from '../../servicios/cliente/segmento.service';
import { Segmento } from '../../modelos/inventario/segmento';
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
import { BodegaService } from 'src/app/servicios/inventario/bodega.service';

export interface DialogData {
  grupoProducto: GrupoProducto;
}

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})

export class ProductoComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;
  si: string = valores.si;
  no: string = valores.no;

  sesion: Sesion = null;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = false;
  abrirPanelNuevoKardex: boolean = false;
  abrirPanelNuevoPrecio: boolean = false;

  producto: Producto = new Producto();

  productos: Producto[];
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
    private segmentoService: SegmentoService, private categoriaProductoService: CategoriaProductoService, private bodegaService: BodegaService, 
    private medidaService: MedidaService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
    this.obtenerCategoriaProducto(valores.bien);
    this.consultarTipoGasto();
    this.consultarImpuesto();
    this.consultarMedida();
    this.consultarSegmento();
    this.consultarBodega();
    this.consultarProveedor();
  }

  obtenerCategoriaProducto(abreviatura: string){
    this.categoriaProductoService.obtenerPorAbreviatura(abreviatura).subscribe(
      res => {
        this.producto.categoriaProducto = res.resultado as CategoriaProducto;
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

  consultarMedida(){
    this.medidaService.consultar().subscribe(
      res => {
        this.medidas = res.resultado as Medida[];
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

  consultarBodega(){
    this.bodegaService.consultar().subscribe(
      res => {
        this.bodegas = res.resultado as Bodega[];
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
    this.producto = new Producto();
  }

  limpiar() {
    this.producto = new Producto();
    this.dataSourcePrecios = new BehaviorSubject<Precio[]>([]);
    this.clickedRows.clear();
  }

  crear(event: any) {
    if (event != null)
      event.preventDefault();
    console.log(this.producto);
    if (this.producto.grupoProducto.id == valores.cero) {
      Swal.fire(error, mensajes.error_grupo_producto, error_swal);
      return;
    }
    if (this.producto.medida.id == valores.cero) {
      Swal.fire(error, mensajes.error_medida, error_swal);
      return;
    }
    if (this.producto.proveedor.id == valores.cero) {
      Swal.fire(error, mensajes.error_proveedor, error_swal);
      return;
    }
    if (this.producto.nombre == valores.vacio) {
      Swal.fire(error, mensajes.error_nombre_producto, error_swal);
      return;
    }
    if (this.producto.precios.length == valores.cero) {
      Swal.fire(error, mensajes.error_precio, error_swal);
      return;
    }
    if (this.producto.kardexs.length == valores.cero) {
      Swal.fire(error, mensajes.error_kardex, error_swal);
      return;
    }
    this.productoService.crear(this.producto).subscribe({
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
    if (this.producto.categoriaProducto.id == valores.cero) {
      Swal.fire(error, mensajes.error_tipo_producto, error_swal);
      return;
    }
    if (this.producto.grupoProducto.id == valores.cero) {
      Swal.fire(error, mensajes.error_grupo_producto, error_swal);
      return;
    }
    if (this.producto.nombre == valores.vacio) {
      Swal.fire(error, mensajes.error_nombre_producto, error_swal);
      return;
    }
    if (this.producto.impuesto.id == valores.cero) {
      Swal.fire(error, mensajes.error_impuesto, error_swal);
      return;
    }
    if (this.producto.tipoGasto.id == valores.cero) {
      Swal.fire(error, mensajes.error_tipo_gasto, error_swal);
      return;
    }
    if (this.producto.categoriaProducto.id == valores.cero) {
      Swal.fire(error, mensajes.error_tipo_producto, error_swal);
      return;
    }
    this.productoService.actualizar(this.producto).subscribe({
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
    this.productoService.activar(this.producto).subscribe({
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
    this.productoService.inactivar(this.producto).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.productoService.consultar().subscribe({
      next: res => {
        this.productos = res.resultado as Producto[];
        this.llenarTabla(this.productos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(productos: Producto[]) {
    this.dataSource = new MatTableDataSource(productos);
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

  seleccionarProducto(productoSeleccionado: Producto) {
    if (!this.clickedRows.has(productoSeleccionado)) {
      this.nuevo(null);
      this.clickedRows.add(productoSeleccionado);
      this.producto = productoSeleccionado;
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
    this.dataSourcePrecios = new BehaviorSubject<Precio[]>(this.producto.precios);
  }
  
  pad(numero:string, size:number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }

  calcularPrecios() {
    if (this.producto.kardexs[0].cantidad < valores.cero) {
      Swal.fire(error, mensajes.error_cantidad, error_swal);
      return;
    }
    if (this.producto.kardexs[0].costoUnitario < valores.cero) {
      Swal.fire(error, mensajes.error_costo_unitario, error_swal);
      return;
    }
    this.producto.kardexs[0].costoTotal = Number((this.producto.kardexs[0].cantidad * this.producto.kardexs[0].costoUnitario).toFixed(2));
    this.producto.kardexs[0].entrada = this.producto.kardexs[0].cantidad;
    this.producto.kardexs[0].debe = this.producto.kardexs[0].costoTotal;
    this.producto.kardexs[0].saldo = this.producto.kardexs[0].cantidad;
    this.producto.precios = [];
    for (let i = 0; i < this.segmentos.length; i++) {
      let precio = new Precio();
      precio.costo = this.producto.kardexs[0].costoUnitario;
      precio.margenGanancia = this.segmentos[i].margenGanancia;
      precio.precioSinIva = Number((precio.costo / (1 - precio.margenGanancia / 100)).toFixed(4));
      precio.precioVentaPublico = Number((precio.precioSinIva + (precio.precioSinIva * this.producto.impuesto.porcentaje / 100)).toFixed(4));
      precio.precioVentaPublicoManual = precio.precioVentaPublico;
      precio.utilidad = Number((precio.precioSinIva - precio.costo).toFixed(4));
      precio.utilidadPorcentaje = Number(((precio.utilidad / precio.precioSinIva) * 100).toFixed(2));
      precio.segmento = this.segmentos[i];
      this.producto.precios.push(precio);
    }
    this.dataSourcePrecios = new BehaviorSubject<Precio[]>(this.producto.precios);
    this.abrirPanelNuevoPrecio = true;
    Swal.fire({ icon: exito_swal, title: exito, text: mensajes.exito_kardex_inicializado });
  }

  actualizarPrecioVentaPublicoManual(){
    for (let i = 0; i < this.producto.precios.length; i++) {
      if(this.producto.precios[i].precioVentaPublicoManual < this.producto.precios[i].precioVentaPublico){
        Swal.fire(error, mensajes.error_precio_venta_publico_manual, error_swal);
      }
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  // VALIDACIONES DE CAMPOS
  validarFormularioProducto(): boolean {
    if (this.producto.grupoProducto.id == 0) {
      Swal.fire(error, mensajes.error_grupo_producto, error_swal);
      return false;
    }
    if (this.producto.nombre == '') {
      Swal.fire(error, mensajes.error_nombre_producto, error_swal);
      return false;
    }
    if (this.producto.medida.id == 0) {
      Swal.fire(error, mensajes.error_medida_kardex, error_swal);
      return false;
    }
    if (this.producto.impuesto.id == 0) {
      Swal.fire(error, mensajes.error_impuesto, error_swal);
      return false;
    }
    if (this.producto.tipoGasto.id == 0) {
      Swal.fire(error, mensajes.error_tipo_gasto, error_swal);
      return false;
    }
    if (this.producto.categoriaProducto.id == 0) {
      Swal.fire(error, mensajes.error_tipo_producto, error_swal);
      return false;
    }
    return true;
  }

  dialogoGruposProductos(): void {
    const dialogRef = this.dialog.open(DialogoGrupoProductoComponent, {
      width: '80%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(this.producto.grupoProducto, result as GrupoProducto);
        this.producto.categoriaProducto = this.producto.grupoProducto.categoriaProducto;
        if (this.producto.grupoProducto.categoriaProducto.id == 1){ // BIEN
          this.producto.nombre = this.producto.grupoProducto.linea + valores.espacio +
          this.producto.grupoProducto.sublinea + valores.espacio + this.producto.grupoProducto.presentacion;
        } else {
          this.producto.nombre = '';
        }
      }
    });
  }
}

@Component({
  selector: 'dialogo-grupo-producto',
  templateUrl: 'dialogo-grupo-producto.component.html',
})
export class DialogoGrupoProductoComponent {

  constructor(public dialogRef: MatDialogRef<DialogoGrupoProductoComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  grupoProductoSeleccionado(event: any) {
    this.data.grupoProducto = event;
  }
}