import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal, warning, warning_swal, si_seguro } from '../../../constantes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { GrupoProducto } from '../../../modelos/inventario/grupo-producto';
import { Producto } from '../../../modelos/inventario/producto';
import { TipoGasto } from '../../../modelos/inventario/tipo-gasto';
import { TipoGastoService } from '../../../servicios/inventario/tipo-gasto.service';
import { Impuesto } from '../../../modelos/inventario/impuesto';
import { ImpuestoService } from '../../../servicios/inventario/impuesto.service';
import { Medida } from '../../../modelos/inventario/medida';
import { MedidaService } from '../../../servicios/inventario/medida.service';
import { Precio } from '../../../modelos/inventario/precio';
import { SegmentoService } from '../../../servicios/cliente/segmento.service';
import { Segmento } from '../../../modelos/cliente/segmento';
import { ProductoService } from '../../../servicios/inventario/producto.service';

import { Proveedor } from '../../../modelos/compra/proveedor';
import { ProveedorService } from '../../../servicios/compra/proveedor.service';
import { Bodega } from '../../../modelos/inventario/bodega';
import { BodegaService } from '../../../servicios/inventario/bodega.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})

export class ProductoComponent implements OnInit {

  activo: string = valores.estadoActivo;
  inactivo: string = valores.estadoInactivo;
  si: string = valores.si;
  no: string = valores.no;
  pvpServicioAF: number = valores.cero;

  abrirPanelPrecio: boolean = true;
  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  abrirPanelKardex: boolean = true;
  abrirPanelNuevoPrecio: boolean = false;
  deshabilitarIniciarKardex: boolean = false;
  esBien: boolean = true;

  saldoInicialKardex: number = valores.cero;
  costoUnitarioKardex: number = valores.cero;
  costoTotalKardex: number = valores.cero;

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  producto: Producto = new Producto();
  bodega: Bodega = new Bodega();

  productos: Producto[];
  tiposGastos: TipoGasto[] = [];
  segmentos: Segmento[] = [];
  impuestos: Impuesto[] = [];
  medidas: Medida[] = [];
  bodegas: Bodega[] = [];
  proveedores: Proveedor[] = [];

  columnasPrecios: any[] = [
    { nombreColumna: 'segmento', cabecera: 'Segmento', celda: (row: Precio) => `${row.segmento.descripcion}` },
    { nombreColumna: 'costo', cabecera: 'Costo', celda: (row: Precio) => `${row.costo}` },
    { nombreColumna: 'margenGanancia', cabecera: 'MG %', celda: (row: Precio) => `${row.margenGanancia}` },
    { nombreColumna: 'precioSinIva', cabecera: 'Precio', celda: (row: Precio) => `${row.precioSinIva}` },
    { nombreColumna: 'precioVentaPublico', cabecera: 'PVP Sug.', celda: (row: Precio) => `${row.precioVentaPublico}` },
    { nombreColumna: 'precioVentaPublicoManual', cabecera: 'PVP Real', celda: (row: Precio) => `${row.precioVentaPublicoManual}` },
    { nombreColumna: 'utilidad', cabecera: 'Utilidad', celda: (row: Precio) => `${row.utilidad}` },
    { nombreColumna: 'utilidadPorcentaje', cabecera: 'Util. %', celda: (row: Precio) => `${row.utilidadPorcentaje} %` }
  ];
  cabeceraPrecios: string[] = this.columnasPrecios.map(titulo => titulo.nombreColumna);
  dataSourcePrecios: MatTableDataSource<Precio>;
  clickedRowsPrecios = new Set<Precio>();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Producto) => `${row.codigo}` },
    { nombreColumna: 'categoriaProducto', cabecera: 'Categoria', celda: (row: Producto) => `${row.categoriaProducto.descripcion}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Producto) => `${row.nombre}` },
    { nombreColumna: 'tipoGasto', cabecera: 'Tipo Gasto', celda: (row: Producto) => `${row.tipoGasto.descripcion}` },
    { nombreColumna: 'impuesto', cabecera: 'IVA %', celda: (row: Producto) => `${row.impuesto.porcentaje}` },
    { nombreColumna: 'consignacion', cabecera: 'Consign.', celda: (row: Producto) => `${row.consignacion}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Producto) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Producto>;
  clickedRows = new Set<Producto>();
  
  controls: UntypedFormArray[] = [];

  @ViewChild('MatPaginator1') paginator1: MatPaginator;
  @ViewChild('MatPaginator2') paginator2: MatPaginator;
  @ViewChild('MatSort1') sort1: MatSort;
  @ViewChild('MatSort2') sort2: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, public dialog: MatDialog, private sesionService: SesionService, private productoService: ProductoService,  private proveedorService: ProveedorService,
    private tipoGastoService: TipoGastoService, private impuestoService: ImpuestoService, private router: Router,
    private segmentoService: SegmentoService, private bodegaService: BodegaService, private medidaService: MedidaService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.consultar();
    this.consultarProveedor();
    this.consultarImpuesto();
    this.consultarTipoGasto();
    this.consultarMedida();
    this.consultarBodega();
    this.consultarSegmento();
  }

  consultarProveedor(){
    this.proveedorService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.proveedores = res.resultado as Proveedor[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarImpuesto(){
    this.impuestoService.consultarPorEstado(valores.estadoActivo).subscribe({
      next: res => {
        this.impuestos = res.resultado as Impuesto[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarTipoGasto(){
    this.tipoGastoService.consultar().subscribe({
      next: res => {
        this.tiposGastos = res.resultado as TipoGasto[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarMedida(){
    this.medidaService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.medidas = res.resultado as Medida[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarBodega(){
    this.bodegaService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.bodegas = res.resultado as Bodega[];
        this.bodega = this.bodegas[0];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarSegmento(){
    this.segmentoService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.segmentos = res.resultado as Segmento[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  nuevo(event){
    if (event != null)
      event.preventDefault();
    this.producto = new Producto();
    this.pvpServicioAF = valores.cero;
    this.saldoInicialKardex = valores.cero;
    this.costoUnitarioKardex = valores.cero;
    this.costoTotalKardex = valores.cero;
    this.dataSourcePrecios = new MatTableDataSource<Precio>;
    this.clickedRows.clear();
    this.esBien = true;
    this.deshabilitarIniciarKardex = false;
  }

  crear(event: any) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.producto.empresa = this.empresa;
    this.productoService.crear(this.producto).subscribe({
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

  actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
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
    this.productoService.consultarPorEmpresa(this.empresa.id).subscribe({
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
    this.dataSource.paginator = this.paginator1;
    this.dataSource.paginator.firstPage();
    this.dataSource.sort = this.sort1;
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  borrarFiltro() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSource.filter = '';
  }

  seleccion(producto: Producto) {
    if (!this.clickedRows.has(producto)) {
      this.clickedRows.clear();
      this.clickedRows.add(producto);
      this.producto = { ...producto};
      this.validarCategoriaProducto(this.producto);
      this.llenarPrecios(this.producto.precios);
      if (this.esBien){
        this.llenarKardex();
      }
    } else {
      this.nuevo(null);
    }
  }

  llenarPrecios(precios: Precio[]){
    this.dataSourcePrecios = new MatTableDataSource(precios);
    this.dataSourcePrecios.paginator = this.paginator2;
    this.dataSourcePrecios.sort = this.sort2;
  }

  llenarKardex(){
    console.log('HOLA MUNDO');
    this.deshabilitarIniciarKardex = true;
    this.saldoInicialKardex = this.producto.kardexs[0].saldo;
    this.costoUnitarioKardex = this.producto.kardexs[0].costoPromedio;
    this.costoTotalKardex = this.producto.kardexs[0].costoTotal;
  }

  inicializarKardex(){
    if (!this.validarKardex())
      return;
    if (this.saldoInicialKardex != valores.cero){
      this.producto.kardexs[0].tipoComprobante.id = 1;
      this.producto.kardexs[0].tipoOperacion.id = 1;
      this.producto.kardexs[0].entrada = this.saldoInicialKardex;
      this.producto.kardexs[0].saldo = this.saldoInicialKardex;
      this.producto.kardexs[0].debe = this.costoUnitarioKardex;
      this.producto.kardexs[0].costoPromedio = this.costoUnitarioKardex;
      this.producto.kardexs[0].costoTotal = this.costoTotalKardex;
      this.producto.kardexs[0].bodega = this.bodega;
    } else {
      this.producto.kardexs = [];
    }
  }
  
  calcularCostoTotalKardex(){
    this.costoTotalKardex = Number((this.saldoInicialKardex * this.costoUnitarioKardex).toFixed(2));
  }

  calcularPreciosBienes() {
    this.inicializarKardex();
    this.producto.precios = [];
    for (let i = 0; i < this.segmentos.length; i++) {
      let precio = new Precio();
      precio.costo = this.costoUnitarioKardex;
      precio.margenGanancia = this.segmentos[i].margenGanancia;
      precio.precioSinIva = Number((precio.costo / (1 - precio.margenGanancia / 100)).toFixed(4));
      precio.precioVentaPublico = Number((precio.precioSinIva + (precio.precioSinIva * this.producto.impuesto.porcentaje / 100)).toFixed(2));
      precio.precioVentaPublicoManual = precio.precioVentaPublico;
      precio.utilidad = Number((precio.precioSinIva - precio.costo).toFixed(4));
      if (precio.precioSinIva != valores.cero){
        precio.utilidadPorcentaje = Number(((precio.utilidad / precio.precioSinIva) * 100).toFixed(2));
      } else {
        precio.utilidadPorcentaje = valores.cero;
      }
      precio.segmento = this.segmentos[i];
      this.producto.precios.push(precio);
    }
    this.llenarPrecios(this.producto.precios);
    this.abrirPanelNuevoPrecio = true;
    Swal.fire({ icon: exito_swal, title: exito, text: mensajes.exito_kardex_inicializado });
  }

  calcularPreciosServicios(){
    this.producto.medida.id = 1; //UNIDAD
    this.producto.precios = [];
    for (let i = 0; i < this.segmentos.length; i++) {
      let precio = new Precio();
      precio.precioVentaPublico = Number(Number(this.pvpServicioAF).toFixed(2));
      precio.precioVentaPublicoManual = precio.precioVentaPublico;
      precio.precioSinIva = Number((precio.precioVentaPublico*100/(100+this.producto.impuesto.porcentaje)).toFixed(4));
      precio.margenGanancia = this.segmentos[i].margenGanancia;
      precio.costo = Number((precio.precioSinIva*100/(100+precio.margenGanancia)).toFixed(4));
      precio.utilidad = Number((precio.precioSinIva - precio.costo).toFixed(4));
      precio.utilidadPorcentaje = Number(((precio.utilidad / precio.precioSinIva) * 100).toFixed(2));
      precio.segmento = this.segmentos[i];
      this.producto.precios.push(precio);
    }
    this.llenarPrecios(this.producto.precios);
    this.abrirPanelNuevoPrecio = true;
    Swal.fire({ icon: exito_swal, title: exito, text: mensajes.exito_kardex_inicializado });
  }

  actualizarmMargenGanancia(i: number, margenGanancia: number){
    this.producto.precios[i].margenGanancia = margenGanancia;
    this.producto.precios[i].precioSinIva = Number((this.producto.precios[0].costo / (1 - margenGanancia / 100)).toFixed(4));
    this.producto.precios[i].precioVentaPublico = Number((this.producto.precios[i].precioSinIva + (this.producto.precios[i].precioSinIva * this.producto.impuesto.porcentaje / 100)).toFixed(2));
    this.producto.precios[i].precioVentaPublicoManual = this.producto.precios[i].precioVentaPublico;
    this.producto.precios[i].utilidad = Number((this.producto.precios[i].precioSinIva - this.producto.precios[i].costo).toFixed(4));
     this.producto.precios[i].utilidadPorcentaje = Number(((this.producto.precios[i].utilidad / this.producto.precios[i].precioSinIva) * 100).toFixed(2));
  }

  actualizarPVPManual(i: number, pvpManual: number){
    if(this.producto.precios[i].precioVentaPublicoManual < this.producto.precios[i].precioVentaPublico){
      Swal.fire(warning, mensajes.advertencia_precio_venta_publico_manual, warning_swal);
    }
    let precioSinIVA: number = pvpManual * 100 / (100 + this.producto.impuesto.porcentaje);
    this.producto.precios[i].precioVentaPublicoManual = pvpManual;
    this.producto.precios[i].utilidad = Number((precioSinIVA - this.producto.precios[i].costo).toFixed(4));
    this.producto.precios[i].utilidadPorcentaje = Number(((this.producto.precios[i].utilidad / precioSinIVA) * 100).toFixed(2));
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  inicializarOpciones(){
    this.producto.medida = this.medidas[0];
    this.producto.impuesto = this.impuestos.find(iva => iva.codigoSRI.includes('2'));
    this.producto.tipoGasto = this.tiposGastos[0];
    this.producto.consignacion = valores.no;
  }

  // VALIDACIONES DE CAMPOS
  validarCategoriaProducto(producto: Producto){
    if (producto.categoriaProducto.id == 1){ // BIEN
      this.esBien = true;
    } else { 
      this.esBien = false;
    }
  }

  validarKardex(): boolean {
    if (this.producto.kardexs[0].saldo < valores.cero) {
      Swal.fire(error, mensajes.error_cantidad, error_swal);
      return false;
    }
    if (this.producto.kardexs[0].costoPromedio < valores.cero) {
      Swal.fire(error, mensajes.error_costo_unitario, error_swal);
      return false;
    }
    return true;
  }

  validarFormulario(): boolean {
    if (this.producto.grupoProducto.id == valores.cero) {
      Swal.fire(error, mensajes.error_grupo_producto, error_swal);
      return false;
    }
    if (this.producto.nombre == valores.vacio) {
      Swal.fire(error, mensajes.error_nombre_producto, error_swal);
      return false;
    }
    if (this.producto.medida.id == valores.cero) {
      Swal.fire(error, mensajes.error_medida_kardex, error_swal);
      return false;
    }
    if (this.producto.proveedor.id == valores.cero) {
      Swal.fire(error, mensajes.error_proveedor, error_swal);
      return;
    }
    if (this.producto.impuesto.id == valores.cero) {
      Swal.fire(error, mensajes.error_impuesto, error_swal);
      return false;
    }
    if (this.producto.tipoGasto.id == valores.cero) {
      Swal.fire(error, mensajes.error_tipo_gasto, error_swal);
      return false;
    }
    if (this.producto.categoriaProducto.id == valores.cero) {
      Swal.fire(error, mensajes.error_tipo_producto, error_swal);
      return false;
    }
    if (this.producto.precios.length == valores.cero) {
      Swal.fire(error, mensajes.error_precio, error_swal);
      return;
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
        this.producto.precios = [];
        this.producto.categoriaProducto = this.producto.grupoProducto.categoriaProducto;
        this.validarCategoriaProducto(this.producto);
        if (this.esBien){ 
          this.producto.nombre = this.producto.grupoProducto.linea + valores.espacio +
          this.producto.grupoProducto.sublinea + valores.espacio + this.producto.grupoProducto.presentacion;
          this.producto.kardexs[0].bodega = this.bodegas[0];
        } else {
          this.producto.nombre = '';
        }
        this.inicializarOpciones();
      }
    });
  }
}

@Component({
  selector: 'dialogo-grupo-producto',
  templateUrl: 'dialogo-grupo-producto.component.html',
})
export class DialogoGrupoProductoComponent {

  constructor(public dialogRef: MatDialogRef<DialogoGrupoProductoComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: GrupoProducto) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  grupoProductoSeleccionado(event: any) {
    this.data = event;
  }
}