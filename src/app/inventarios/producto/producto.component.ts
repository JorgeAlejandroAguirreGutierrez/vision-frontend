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
import { Kardex } from '../../modelos/inventario/kardex';
import { MedidaPrecio } from '../../modelos/inventario/medida-precio';
import { EquivalenciaMedidaService } from '../../servicios/inventario/equivalencia-medida.service';
import { EquivalenciaMedida } from '../../modelos/inventario/equivalencia-medida'
import { Proveedor } from '../../modelos/compra/proveedor';
import { ProveedorService } from '../../servicios/compra/proveedor.service';
import { Bodega } from '../../modelos/inventario/bodega';
import { ProductoBodega } from '../../modelos/inventario/producto-bodega';
import { ProductoProveedor } from '../../modelos/inventario/producto-proveedor';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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

  cantidadMedidas: number = 0;
  precioServicioAF: number = 0;

  sesion: Sesion = null;
  ComponenteProducto: Type<any> = ProductoComponent;

  abrirPanelNuevo: boolean = true;
  abrirPanelPrecio: boolean = true;
  abrirPanelAdmin: boolean = false;
  //verAcordeonPrecios: boolean = false;
  deshabilitarImpuesto: boolean = false;
  deshabilitarOtrasMedidas: boolean = true;
  deshabilitarSaldoInicial: boolean = false;
  abrirPanelPrecios: boolean[] = [];

  producto: Producto = new Producto();
  bodega: Bodega = new Bodega();
  precio: Precio = new Precio();
  medida: Medida = new Medida();
  impuesto: Impuesto = new Impuesto();
  kardexInicial: Kardex = new Kardex();
  kardexFinal: Kardex = new Kardex();
  equivalenciaMedida: EquivalenciaMedida = new EquivalenciaMedida();
  medidaPrecio: MedidaPrecio = new MedidaPrecio();
  productoBodega: ProductoBodega = new ProductoBodega();
  productoProveedor: ProductoProveedor = new ProductoProveedor();

  medidaEquivalenteSeleccionada: EquivalenciaMedida = new EquivalenciaMedida();
  productoActualizar: Producto = new Producto();
  productoBuscar: Producto = new Producto();

  productos: Producto[];
  tiposGastos: TipoGasto[] = [];
  segmentos: Segmento[] = [];
  impuestos: Impuesto[] = [];
  categoriasProductos: CategoriaProducto[] = [];
  proveedores: Proveedor[] = [];
  precios: Precio[] = [];
  tablaPrecios: Precio[] = [];
  medidas: Medida[] = [];
  medidasPrecios: MedidaPrecio[] = [];
  arrayCantidadMedidas: number[] = [];
  medidasEquivalentes: EquivalenciaMedida[] = [];

  //Validacion de formulario
  formKardexInicial = new UntypedFormGroup({
    controlSaldoInicial: new UntypedFormControl('', [Validators.required]),
    controlCostoTotal: new UntypedFormControl('', [Validators.required])
  });
  get controlSaldoInicial(): any {
    return this.formKardexInicial.get('controlSaldoInicial');
  }
  get controlCostoTotal(): any {
    return this.formKardexInicial.get('controlCostoTotal');
  }
  setValue() {
    this.formKardexInicial.setValue({ controlSaldoInicial: true, controlCostoTotal: this.kardexInicial.costoPromedio });
  }

  getErrorMessage() {
    if (this.controlSaldoInicial.hasError('required')) {
      return 'Valor inválido';
    }
    if (this.controlCostoTotal.hasError('required')) {
      return 'Valor inválido';
    }
    return 'Error';
  }
  // Variables para las tablas
  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Producto) => `${row.codigo}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Producto) => `${row.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida Kardex', celda: (row: Producto) => `${row.medida.descripcion}` },
    { nombreColumna: 'categoriaProducto', cabecera: 'Categoria', celda: (row: Producto) => `${row.categoriaProducto.descripcion}` },
    { nombreColumna: 'tipoGasto', cabecera: 'Tipo Gasto', celda: (row: Producto) => `${row.tipoGasto.descripcion}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Producto) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Producto>;
  clickedRows = new Set<Producto>();
  
  cabeceraPrecioSugerido: string[] = ['medida', 'segmento', 'costo', 'margenGanancia', 'precioSinIva', 'precioVentaPublico'];
  cabeceraPrecioVenta: string[] = ['precioVentaPublicoManual', 'utilidad', 'utilidadPorcentaje'];

  observablePrecios: BehaviorSubject<Precio[]> = new BehaviorSubject<Precio[]>([]);
  datos: any = [];
  controls: UntypedFormArray[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G")
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N")
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, public dialog: MatDialog, private sesionService: SesionService, private productoService: ProductoService, 
    private tipoGastoService: TipoGastoService, private impuestoService: ImpuestoService, private router: Router,
    private segmentoService: SegmentoService, private categoriaProductoService: CategoriaProductoService, 
    private medidaService: MedidaService, private equivalenciaMedidaService: EquivalenciaMedidaService,
    private proveedorService: ProveedorService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarCategoria();
    this.consultarImpuesto();
    this.consultarTipoGasto();
    this.consultarMedida();
    this.consultarSegmento();
    this.consultarProveedor();
  }

  consultarCategoria(){
    this.categoriaProductoService.consultar().subscribe({
      next: res => {
        this.categoriasProductos = res.resultado as CategoriaProducto[];
        this.producto.categoriaProducto.id = this.categoriasProductos[0].id;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarImpuesto(){
    this.impuestoService.consultar().subscribe({
      next: res => {
        this.impuestos = res.resultado as Impuesto[];
        this.producto.impuesto.id = this.impuestos[0].id;
        this.impuesto = this.impuestos[0];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarTipoGasto(){
    this.tipoGastoService.consultar().subscribe({
      next: res => {
        this.tiposGastos = res.resultado as TipoGasto[];
        this.producto.tipoGasto.id = this.tiposGastos[0].id;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarMedida(){
    this.medidaService.consultarActivos().subscribe({
      next: res => {
        this.medidas = res.resultado as Medida[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarSegmento(){
    this.segmentoService.consultar().subscribe({
      next: res => {
        this.segmentos = res.resultado as Segmento[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarProveedor() {
    this.proveedorService.consultar().subscribe({
      next: (res) => {
        this.proveedores = res.resultado as Proveedor[];
        console.log(this.proveedores);
      },
      error: (err) => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    });
  }

  // CRUD
  nuevo(event){
    if (event != null)
      event.preventDefault();
    this.producto.estado = valores.activo;
    this.producto.consignacion = valores.no;
    this.producto = new Producto();
    this.precio = new Precio();
    this.kardexInicial = new Kardex();
    this.kardexFinal = new Kardex();
    this.tablaPrecios = [];
    this.medidasPrecios = [];
    this.datos = [];
    this.controls = [];
    this.observablePrecios = new BehaviorSubject<Precio[]>([]);
    this.producto.categoriaProducto = this.categoriasProductos[0];
    this.producto.impuesto = this.impuestos[0];
    this.producto.tipoGasto = this.tiposGastos[0];
    this.abrirPanelPrecios = [];
    this.abrirPanelNuevo = true;
    this.abrirPanelPrecio = false;
    this.abrirPanelAdmin = false;
    this.deshabilitarOtrasMedidas = true;
    this.deshabilitarImpuesto = false;
    this.deshabilitarSaldoInicial = false;
    this.formKardexInicial.get('controlSaldoInicial').enable();
    this.formKardexInicial.get('controlCostoTotal').enable();
    this.clickedRows.clear();
  }

  crear(event: any) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormularioProducto())
      return;
    this.producto.precios = this.tablaPrecios;
    //this.productoProveedor.proveedor = this.proveedores[0];
    //this.producto.productosProveedores.push(this.productoProveedor);
    console.log(this.producto);
    this.productoService.crear(this.producto).subscribe({
      next: (res) => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        //this.producto = res.resultado as Producto;
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
    if (!this.validarFormularioProducto())
      return;
    this.producto.precios = this.tablaPrecios;
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
  borrarFiltro() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSource.filter = '';
  }

  // Para la Edición
  seleccion(productoSeleccionado: Producto) {
    if (!this.clickedRows.has(productoSeleccionado)) {
      this.nuevo(null);
      this.clickedRows.add(productoSeleccionado);
      this.producto = productoSeleccionado;
      this.construirProducto(this.producto);
    } else {
      this.nuevo(null);
    }
  }

  construirProducto(productoSeleccionado: Producto) {
    let productoId = 0;
    this.productoService.currentMessage.subscribe(message => productoId = message);
    if (productoSeleccionado.id != 0) {
      this.construirInfoKardex(productoSeleccionado.kardexs);
      this.construirMedidasPrecios(productoSeleccionado.precios);
      this.obtenerMedidasEquivalentes(productoSeleccionado.medida.id);
      this.deshabilitarOtrasMedidas = false;
      //this.actualizar_precios();
    }
  }

  construirInfoKardex(kardex: Kardex[]) {
    this.medidaService.consultar().subscribe({
      next: (res) => {
        this.medidas = res.resultado as Medida[];
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
    this.kardexInicial.cantidad = kardex[0].cantidad;
    this.kardexInicial.costoPromedio = kardex[0].costoPromedio;
    this.deshabilitarMedida();
    let ultimoKardex = kardex.length - 1;
    this.kardexFinal.cantidad = kardex[ultimoKardex].cantidad;
    this.kardexFinal.costoPromedio = kardex[ultimoKardex].costoPromedio;
    this.kardexFinal.costoTotal = kardex[ultimoKardex].costoTotal;
    // Esta linea da problemas, hay que eliminar proveedor de kardex
    //this.producto.kardexs[0].proveedor = new Proveedor;
  }

  deshabilitarMedida() {
    this.deshabilitarImpuesto = true;
    this.deshabilitarSaldoInicial = true;
    this.formKardexInicial.get('controlSaldoInicial').disable();
    this.formKardexInicial.get('controlCostoTotal').disable();
  }

  construirMedidasPrecios(precios: Precio[]) {
    if (precios.length > 0) {
      this.abrirPanelPrecios = [];
      this.ordenarAsc(precios, 'id');
      this.tablaPrecios = precios;
      this.medidaPrecio = new MedidaPrecio();
      this.medidaPrecio.medida = precios[0].medida;
      //Hace un barrido de la tabla precios y lo guarda en medida_precio para visualizar por grupos
      for (let i = 0; i < precios.length; i++) {
        if (this.medidaPrecio.medida.id == precios[i].medida.id) {
          this.medidaPrecio.precios.push(precios[i]);
          if (i == precios.length - 1) {
            this.medidasPrecios.push(this.medidaPrecio);
            this.observablePrecios = new BehaviorSubject(this.medidaPrecio.precios);
            this.datos.push(this.observablePrecios);
            this.activarControles(this.datos.length - 1);
            this.nuevoAbrirPanelPrecios();
          }
        }
        else {
          this.nuevoAbrirPanelPrecios();
          this.medidasPrecios.push(this.medidaPrecio);
          this.observablePrecios = new BehaviorSubject(this.medidaPrecio.precios);
          this.datos.push(this.observablePrecios);
          this.activarControles(this.datos.length - 1);
          this.medidaPrecio = new MedidaPrecio();
          this.medidaPrecio.medida = precios[i].medida;
          this.medidaPrecio.precios.push(precios[i]);
        }
      }
    }
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  medidaSeleccionada(event: number) {
    this.medidaService.obtener(event).subscribe({
      next: (res) => {
        this.producto.medida = res.resultado as Medida;
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
  });
  }

  impuestoSeleccionado(event: number) {
    this.impuestoService.obtener(event).subscribe(
      res => {
        this.impuesto = res.resultado as Impuesto;
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );

  }

  cargarSaldoInicial() {
    if (this.producto.categoriaProducto.id == 1) { //Para bienes
      if (this.producto.medida.id == 0) {
        Swal.fire(error, mensajes.error_medida, error_swal);
        return;
      }
      if (this.kardexInicial.cantidad == 0) {
        Swal.fire({ title: warning, text: mensajes.mensaje_kardex_inicial, icon: warning_swal, showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: si_seguro
        }).then((result) => {
          if (result.isConfirmed) {
            this.crearKardexPrecios();
          } else {
            return;
          }
        })
      } else {
        this.crearKardexPrecios();
      }
    } else { // Para Sevicios y A.F.
      if (this.precioServicioAF == 0) {
        Swal.fire(error, mensajes.error_precio, error_swal);
        return;
      }
      // Obtengo medida Unidad
      this.medidaService.obtener(13).subscribe(
        res => {
          this.producto.medida = res.resultado as Medida;
          this.crearKardexPrecios();
        },
        err => {
          Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        }
      );
      this.kardexInicial.cantidad = 1;
      this.kardexInicial.costoPromedio = Number((this.precioServicioAF * 100 / (100 + this.impuesto.porcentaje)).toFixed(4));
      
    }
  }

  crearKardexPrecios() {
    if (this.kardexInicial.cantidad < 0 || this.kardexInicial.cantidad == null) {
      Swal.fire(error, mensajes.error_cantidad, error_swal);
      return;
    }
    if (this.kardexInicial.costoPromedio < 0 || this.kardexInicial.costoPromedio == null) {
      Swal.fire(error, mensajes.error_costo_unitario, error_swal);
      return;
    }
    this.kardexInicial.costoTotal = Number((this.kardexInicial.cantidad * this.kardexInicial.costoPromedio).toFixed(2));
// Falta Crear y traer de la tabla operaciones_kardex
    this.kardexInicial.operacion = otras.operacionInicialKardex;
    this.kardexFinal = this.kardexInicial;
    this.producto.stockTotal = this.kardexInicial.cantidad;
    this.producto.kardexs.push(this.kardexInicial);
    this.crearBodega();
    this.llenarTablaPrecios(this.producto.medida);
    //this.actualizar_precios();
    Swal.fire('Bien!', 'El kardex fue inicializado', 'success')
    this.deshabilitarMedida();
    this.deshabilitarOtrasMedidas = false;
    this.obtenerMedidasEquivalentes(this.producto.medida.id);
  }

  crearBodega(){
    this.productoBodega.producto.id = this.producto.id;
    this.productoBodega.bodega.id = 1; // Bodega MATRIZ
    this.productoBodega.cantidad = this.kardexInicial.cantidad;
    this.producto.productosBodegas.push(this.productoBodega);
  };

  llenarTablaPrecios(medida: Medida) {
    let costo: number = 0;
    this.medidaPrecio = new MedidaPrecio();
    if (medida.id == this.producto.medida.id) {
      costo = Number((this.kardexFinal.costoPromedio));
    } else {
      costo = Number((this.kardexFinal.costoPromedio / this.medidaEquivalenteSeleccionada.equivalencia).toFixed(4));
    }
    this.calcularPrecios(medida, costo);
    this.nuevoAbrirPanelPrecios();
    this.medidaPrecio.medida = medida;
    this.medidaPrecio.precios = this.precios;
    this.medidasPrecios.push(this.medidaPrecio);
    this.observablePrecios = new BehaviorSubject(this.medidaPrecio.precios);
    this.datos.push(this.observablePrecios);
    this.activarControles(this.datos.length - 1);
  }

  calcularPrecios(medida: Medida, costo: number) {
    this.precios = [];
    for (let i = 0; i < this.segmentos.length; i++) {
      let precio = new Precio();
      precio.costo = costo;
      precio.margenGanancia = this.segmentos[i].margenGanancia;
      precio.precioSinIva = Number((precio.costo / (1 - precio.margenGanancia / 100)).toFixed(4));
      precio.precioVentaPublico = Number((precio.precioSinIva + (precio.precioSinIva * this.impuesto.porcentaje / 100)).toFixed(4));
      precio.precioVentaPublicoManual = precio.precioVentaPublico;
      precio.utilidad = Number((precio.precioSinIva - precio.costo).toFixed(4));
      precio.utilidadPorcentaje = Number(((precio.utilidad / precio.precioSinIva) * 100).toFixed(2));
      precio.medida = medida;
      precio.segmento = this.segmentos[i];
      //precio.producto.id = this.producto.id;
      this.precios.push(precio);
      this.tablaPrecios.push(precio);
    }
  }

  nuevoAbrirPanelPrecios() {
    // Para cerrar todos los paneles antes de abrir el ultimo, soluciona error
    if (this.abrirPanelPrecios.length > 0) {
      for (let i = 0; i < this.abrirPanelPrecios.length; i++) {
        this.abrirPanelPrecios[i] = false;
      }
    }
    this.abrirPanelPrecios.push(true);
  }

  actualizarAbrirPanel(){
    if (this.abrirPanelPrecios.length > 0) {
      for (let i = 0; i < this.abrirPanelPrecios.length; i++) {
        if (i == this.abrirPanelPrecios.length-1){
          this.abrirPanelPrecios[i] = true;
        } else {
        this.abrirPanelPrecios[i] = false;
        }
      }
    }
  }

  cambiarAbrirPanelPrecios(index: number){
    if (this.abrirPanelPrecios.length > 0) {
      for (let i = 0; i < this.abrirPanelPrecios.length; i++) {
        if (i == index){
          this.abrirPanelPrecios[i] = true;
        } else {
        this.abrirPanelPrecios[i] = false;
        }
      }
    }
  }

  agregarPrecio() {
    if (this.kardexFinal.costoPromedio < 0) {
      Swal.fire(error, mensajes.error_costo, error_swal);
      return;
    }
    if (this.medidaEquivalenteSeleccionada.id == 0) {
      Swal.fire(error, mensajes.error_medida, error_swal);
      return;
    }
    this.llenarTablaPrecios(this.medidaEquivalenteSeleccionada.medidaEqui);
    this.eliminarMedidaEquivalente(this.medidaEquivalenteSeleccionada.medidaEqui);
  }
 
  eliminarMedidaPrecio(i: number){
    this.medidasPrecios.splice(i,1);
    this.observablePrecios = new BehaviorSubject(this.medidaPrecio.precios);
    this.datos.splice(i, 1);
    this.controls.splice(i, 1);
    this.abrirPanelPrecios.splice(i, 1);
    this.actualizarAbrirPanel();
    this.obtenerMedidasEquivalentes(this.producto.medida.id);
    this.actualizarTablaPrecios();  
  }

  activarControles(i: number) {
    const toGroups = this.datos[i].value.map((entity:any) => {
      return new UntypedFormGroup({
        margenGanancia: new UntypedFormControl(entity.margenGanancia, Validators.required),
        precioVentaPublicoManual: new UntypedFormControl(entity.precioVentaPublicoManual, Validators.required),
      }, { updateOn: "blur" });
      
    });
    this.controls.push(new UntypedFormArray(toGroups));
  }

  actualizarControles(i: number) {
    const toGroups = this.datos[i].value.map((entity:any) => {
      return new UntypedFormGroup({
        margenGanancia: new UntypedFormControl(entity.margenGanancia, Validators.required),
        precioVentaPublicoManual: new UntypedFormControl(entity.precioVentaPublicoManual, Validators.required),
      }, { updateOn: "blur" });
      
    });
    this.controls[i]=(new UntypedFormArray(toGroups));
  }

  actualizarCalculosPrecios(i: number, index: number, field: string) {
    const control = this.getControl(i, index, field);
    if (control.valid) {
      this.update(i, index, field, control.value);
      //this.actualizarPrecios(field);
    }
  }

  getControl(i: number, index: number, fieldName: string) {
    const a = this.controls[i].at(index).get(fieldName) as UntypedFormControl;
    return a;
  }

  update(i: number, index: number, field: string, value: number) {
    this.medidasPrecios[i].precios = this.medidasPrecios[i].precios.map((e, i) => {
      if (index === i) {
        if (field == 'margenGanancia') {
          return {
            ...e, // Divide los elementos del Array como argumentos individuales y contatena
            [field]: Number(value),
            ["precioSinIva"]: Number((e.costo / (1 - (Number(value) / 100))).toFixed(4)),
            ["precioVentaPublico"]: Number((Number((e.costo / (1 - (Number(value) / 100))).toFixed(4)) + (Number((e.costo / (1 - (Number(value) / 100))).toFixed(4)) * (this.impuesto.porcentaje / 100))).toFixed(4)),
            ["precioVentaPublicoManual"]: Number((Number((e.costo / (1 - (Number(value) / 100))).toFixed(4)) + (Number((e.costo / (1 - (Number(value) / 100))).toFixed(4)) * (this.impuesto.porcentaje / 100))).toFixed(4)),
            ["utilidad"]: Number(((Number((Number((e.costo / (1 - (Number(value) / 100))).toFixed(4)) + (Number((e.costo / (1 - (Number(value) / 100))).toFixed(4)) * (this.impuesto.porcentaje / 100))).toFixed(4)) * 100 / (100 + this.impuesto.porcentaje)) - e.costo).toFixed(4)),
            ["utilidadPorcentaje"]: Number((Number(((Number((Number((e.costo / (1 - (Number(value) / 100))).toFixed(4)) + (Number((e.costo / (1 - (Number(value) / 100))).toFixed(4)) * (this.impuesto.porcentaje / 100))).toFixed(4)) * 100 / (100 + this.impuesto.porcentaje)) - e.costo).toFixed(2)) / (Number((Number((e.costo / (1 - (Number(value) / 100))).toFixed(4)) + (Number((e.costo / (1 - (Number(value) / 100))).toFixed(4)) * (this.impuesto.porcentaje / 100))).toFixed(4)) * 100 / (100 + this.impuesto.porcentaje)) * 100).toFixed(2))
          }
        }
        if (field == 'precioVentaPublicoManual') {
          return {
            ...e,
            [field]: Number(value),
            //["precioVentaPublicoManual"]: Number(value),
            ["utilidad"]: Number(((Number(value) * 100 / (100 + this.impuesto.porcentaje)) - e.costo).toFixed(4)),
            ["utilidadPorcentaje"]: Number((Number(((Number(value) * 100 / (100 + this.impuesto.porcentaje)) - e.costo).toFixed(2)) / (Number(value) * 100 / (100 + this.impuesto.porcentaje)) * 100).toFixed(2))
          }
        }
      }
      return e;
    });
    this.datos[i].next(this.medidasPrecios[i].precios);
    this.actualizarControles(i);
    this.actualizarTablaPrecios();    
  }

  actualizarTablaPrecios(){
    this.tablaPrecios = [];
    for (let j = 0; j < this.medidasPrecios.length; j++){
      for (let k = 0; k < this.medidasPrecios[j].precios.length; k++) {
      this.tablaPrecios.push(this.medidasPrecios[j].precios[k]);
      }
    }
  }

  obtenerMedidasEquivalentes(medidaId: number) {
    this.equivalenciaMedidaService.obtenerMedidasEquivalentes(medidaId).subscribe({
      next: res => {
        this.medidasEquivalentes = res.resultado as EquivalenciaMedida[];
        //console.log(this.medidasEquivalentes);
        if (this.medidasPrecios.length > 1) {
          this.actualizarMedidasEquivalentes()
        }
        else {
          this.eliminarMedidaEquivalente(this.producto.medida);
        }
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  eliminarMedidaEquivalente(medidaAgregada: Medida) {
    for (let i = 0; i < this.medidasEquivalentes.length; i++) {
      if (this.medidasEquivalentes[i].medidaEqui.id == medidaAgregada.id) {
        this.medidasEquivalentes.splice(i, 1);
      }
    }
  }

  actualizarMedidasEquivalentes() {
    for (let i = 0; i < this.medidasPrecios.length; i++) {
      for (let j = 0; j < this.medidasEquivalentes.length; j++) {
        if (this.medidasEquivalentes[j].medidaEqui.id == this.medidasPrecios[i].medida.id) {
          this.medidasEquivalentes.splice(j, 1);
        }
      }
    }
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
    if (!this.deshabilitarSaldoInicial) {
      Swal.fire(error, mensajes.error_saldo_inicial, error_swal);
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