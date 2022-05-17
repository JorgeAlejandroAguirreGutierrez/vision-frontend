import { Component, OnInit, Type, Inject } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { GrupoProducto } from '../../modelos/grupo-producto';
import { Producto } from '../../modelos/producto';
import { TipoGasto } from '../../modelos/tipo-gasto';
import { TipoGastoService } from '../../servicios/tipo-gasto.service';
import { Impuesto } from '../../modelos/impuesto';
import { ImpuestoService } from '../../servicios/impuesto.service';
import { Medida } from '../../modelos/medida';
import { MedidaService } from '../../servicios/medida.service';
import { Precio } from '../../modelos/precio';
import { SegmentoService } from '../../servicios/segmento.service';
import { Segmento } from '../../modelos/segmento';
import { ProductoService } from '../../servicios/producto.service';
import { CategoriaProductoService } from '../../servicios/categoria-producto.service';
import { CategoriaProducto } from '../../modelos/categoria-producto';
import { Router } from '@angular/router';
import { Kardex } from '../../modelos/kardex';
import { MedidaPrecio } from '../../modelos/medida-precio';
import { EquivalenciaMedidaService } from '../../servicios/equivalencia-medida.service';
import { EquivalenciaMedida } from '../../modelos/equivalencia-medida'
import { Proveedor } from '../../modelos/proveedor';
import { Bodega } from '../../modelos/bodega';
import { ProductoBodega } from '../../modelos/producto-bodega';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})

export class ProductoComponent implements OnInit {

  ComponenteProducto: Type<any> = ProductoComponent;

  abrirPanelPrecios: boolean[] = [];
  abrirPanelNuevoProducto: boolean = true;
  abrirPanelNuevoPrecio: boolean = false;
  abrirPanelAdminProducto: boolean = false;
  //verAcordeonPrecios: boolean = false;
  deshabilitarImpuesto: boolean = false;
  deshabilitarOtrasMedidas: boolean = true;
  deshabilitarSaldoInicial: boolean = false;

  sesion: Sesion = null;
  bodega: Bodega = new Bodega();
  productoBodega: ProductoBodega = new ProductoBodega();
  producto: Producto = new Producto();
  precio: Precio = new Precio();
  medida: Medida = new Medida();
  impuesto: Impuesto = new Impuesto();
  medidaPrecio: MedidaPrecio = new MedidaPrecio();
  kardexInicial: Kardex = new Kardex();
  kardexFinal: Kardex = new Kardex();

  medidaEquivalenteSeleccionada: EquivalenciaMedida = new EquivalenciaMedida();
  productoActualizar: Producto = new Producto();
  productoBuscar: Producto = new Producto();

  cantidadMedidas: number = 0;
  precioServicioAF: number = 0;
  activo: string;
  productos: Producto[];
  tiposGastos: TipoGasto[] = [];
  segmentos: Segmento[] = [];
  impuestos: Impuesto[] = [];
  categoriasProductos: CategoriaProducto[] = [];
  precios: Precio[] = [];
  tablaPrecios: Precio[] = [];
  medidas: Medida[] = [];
  medidasPrecios: MedidaPrecio[] = [];
  arrayCantidadMedidas: number[] = [];
  medidasEquivalentes: EquivalenciaMedida[] = [];

  //Validacion de formulario
  formKardexInicial = new FormGroup({
    controlSaldoInicial: new FormControl('', [Validators.required]),
    controlCostoTotal: new FormControl('', [Validators.required])
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
  // Variables para las tablas
  equivalenciaMedida: EquivalenciaMedida = new EquivalenciaMedida();

  cabeceraPrecioSugerido: string[] = ['medida', 'segmento', 'costo', 'margenGanancia', 'precioSinIva', 'precioVentaPublico'];
  cabeceraPrecioVenta: string[] = ['precioVentaPublicoManual', 'utilidad', 'utilidadPorcentaje'];

  observablePrecios: BehaviorSubject<Precio[]> = new BehaviorSubject<Precio[]>([]);
  datos: any = [];
  controls: FormArray[] = [];

  columnasProducto: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Producto) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Producto) => `${row.codigo}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Producto) => `${row.nombre}` },
    { nombreColumna: 'tipoGasto', cabecera: 'Tipo Gasto', celda: (row: Producto) => `${row.tipoGasto.nombre}` },
    { nombreColumna: 'categoriaProducto', cabecera: 'Categoria', celda: (row: Producto) => `${row.tipoGasto.nombre}` }, // cambiar a categoria_producto
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Producto) => `${row.estado}` }
  ];
  cabeceraProducto: string[] = this.columnasProducto.map(titulo => titulo.nombreColumna);
  dataSourceProducto: MatTableDataSource<Producto>;
  clickedRows = new Set<Producto>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private sesionService: SesionService, private productoService: ProductoService, 
    private tipoGastoService: TipoGastoService, private impuestoService: ImpuestoService, private router: Router,
    private segmentoService: SegmentoService, private categoriaProductoService: CategoriaProductoService, 
    private medidaService: MedidaService, private equivalenciaMedidaService: EquivalenciaMedidaService) { }

  getErrorMessage() {
    if (this.controlSaldoInicial.hasError('required')) {
      return 'Valor inválido';
    }
    if (this.controlCostoTotal.hasError('required')) {
      return 'Valor inválido';
    }
    return 'Error';
  }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultar();
    this.categoriaProductoService.consultar().subscribe(
      res => {
        this.categoriasProductos = res.resultado as CategoriaProducto[];
        this.producto.categoriaProducto.id = this.categoriasProductos[0].id;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.impuestoService.consultar().subscribe(
      res => {
        this.impuestos = res.resultado as Impuesto[];
        this.producto.impuesto.id = this.impuestos[0].id;
        this.impuesto = this.impuestos[0];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.tipoGastoService.consultar().subscribe(
      res => {
        this.tiposGastos = res.resultado as TipoGasto[];
        this.producto.tipoGasto.id = this.tiposGastos[0].id;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.medidaService.consultar().subscribe(
      res => {
        this.medidas = res.resultado as Medida[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.segmentoService.consultar().subscribe(
      res => {
        this.segmentos = res.resultado as Segmento[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  /*nuevo(event) {
    if (event != null)
      event.preventDefault();
    let indice_tab_activo = this.tab_activo();
    this.tabService.removeTab(indice_tab_activo);
    this.tabService.addNewTab(ProductoComponent, constantes.tab_crear_producto);
  }*/

  crear(event: any) {
    if (event != null)
      event.preventDefault();
    if (this.producto.grupoProducto.id == 0) {
      Swal.fire(constantes.error, constantes.error_grupo_producto, constantes.error_swal);
      return;
    }
    if (this.producto.nombre == '') {
      Swal.fire(constantes.error, constantes.error_nombre_producto, constantes.error_swal);
      return;
    }
    if (this.producto.medidaKardex.id == 0) {
      Swal.fire(constantes.error, constantes.error_medida_kardex, constantes.error_swal);
      return;
    }
    if (!this.deshabilitarSaldoInicial) {
      Swal.fire(constantes.error, constantes.error_saldo_inicial, constantes.error_swal);
      return;
    }

    this.producto.precios = this.tablaPrecios;
    this.bodega.id 
    this.producto.productosBodegas.push(); 
    console.log(this.producto);
    this.productoService.crear(this.producto).subscribe({
      next: (res) => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.producto = res.resultado as Producto;
        this.limpiar();
        this.consultar();
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  limpiar() {
    this.producto = new Producto();
    this.producto.estado = 'ACTIVO';
    this.producto.consignacion = false;
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
    this.abrirPanelNuevoProducto = true;
    this.abrirPanelNuevoPrecio = false;
    this.abrirPanelAdminProducto = false;
    this.deshabilitarOtrasMedidas = true;
    this.deshabilitarImpuesto = false;
    this.deshabilitarSaldoInicial = false;
    this.formKardexInicial.get('controlSaldoInicial').enable();
    this.formKardexInicial.get('controlCostoTotal').enable();
    this.clickedRows.clear();
  }

  actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    if (this.producto.grupoProducto.id == 0) {
      Swal.fire(constantes.error, constantes.error_grupo_producto, constantes.error_swal);
      return;
    }
    if (this.producto.nombre == '') {
      Swal.fire(constantes.error, constantes.error_nombre_producto, constantes.error_swal);
      return;
    }
    if (this.producto.impuesto.id == 0) {
      Swal.fire(constantes.error, constantes.error_impuesto, constantes.error_swal);
      return;
    }
    if (this.producto.tipoGasto.id == 0) {
      Swal.fire(constantes.error, constantes.error_tipo_gasto, constantes.error_swal);
      return;
    }
    if (this.producto.categoriaProducto.id == 0) {
      Swal.fire(constantes.error, constantes.error_tipo_producto, constantes.error_swal);
      return;
    }
    this.producto.precios = this.tablaPrecios;
    console.log(this.producto);
    this.productoService.actualizar(this.producto).subscribe({
      next: (res) => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
        this.consultar();
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.productoService.eliminar(this.producto).subscribe({
      next: (res) => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.consultar();
      },
      error: (err) => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    });
  }

  consultar() {
    this.productoService.consultar().subscribe(
      res => {
        this.productos = res.resultado as Producto[];
        this.llenarDataSourceProducto(this.productos);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  llenarDataSourceProducto(productos: Producto[]) {
    this.dataSourceProducto = new MatTableDataSource(productos);
    this.dataSourceProducto.filterPredicate = (data: Producto, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.nombre.toUpperCase().includes(filter) || data.tipoGasto.nombre.toUpperCase().includes(filter) ||
      data.categoriaProducto.descripcion.toUpperCase().includes(filter) || data.estado.toUpperCase().includes(filter);
    this.dataSourceProducto.paginator = this.paginator;
    this.dataSourceProducto.paginator.firstPage();
    this.dataSourceProducto.sort = this.sort;
  }

  filtroProducto(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProducto.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceProducto.paginator) {
      this.dataSourceProducto.paginator.firstPage();
    }
  }

  // Para la Edición
  seleccionTablaProducto(productoSeleccionado: Producto) {
    if (!this.clickedRows.has(productoSeleccionado)) {
      this.limpiar();
      this.clickedRows.add(productoSeleccionado);
      this.producto = productoSeleccionado;
      //console.log(this.producto);
      this.construirProducto(this.producto);
    } else {
      this.limpiar();
    }
  }

  construirProducto(productoSeleccionado: Producto) {
    let productoId = 0;
    this.productoService.currentMessage.subscribe(message => productoId = message);
    if (productoSeleccionado.id != 0) {
      this.construirInfoKardex(productoSeleccionado.kardexs);
      this.construirMedidasPrecios(productoSeleccionado.precios);
      this.buscarMedidasEquivalentes(productoSeleccionado.medidaKardex.id);
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
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
    this.kardexInicial.cantidad = kardex[0].cantidad;
    this.kardexInicial.costoPromedio = kardex[0].costoPromedio;
    this.deshabilitarMedidaKardex();
    let ultimoKardex = kardex.length - 1;
    this.kardexFinal.cantidad = kardex[ultimoKardex].cantidad;
    this.kardexFinal.costoPromedio = kardex[ultimoKardex].costoPromedio;
    this.kardexFinal.costoTotal = kardex[ultimoKardex].costoTotal;
    // Esta linea da problemas, hay que eliminar proveedor de kardex
    this.producto.kardexs[0].proveedor = new Proveedor;
  }

  deshabilitarMedidaKardex() {
    this.deshabilitarImpuesto = true;
    this.deshabilitarSaldoInicial = true;
    this.formKardexInicial.get('controlSaldoInicial').disable();
    this.formKardexInicial.get('controlCostoTotal').disable();
  }

  construirMedidasPrecios(precios: Precio[]) {
    if (precios.length > 0) {
      this.abrirPanelPrecios = [];
      this.ordenarAsc(precios, 'id')
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

  borrarNombreProducto() {
    this.producto.nombre = '';
  }

  medidaSeleccionada(event: number) {
    //console.log(event);
    this.medidaService.obtener(event).subscribe({
      next: (res) => {
        this.producto.medidaKardex = res.resultado as Medida;
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      }
  });
  }

  impuestoSeleccionado(event: number) {
    this.impuestoService.obtener(event).subscribe(
      res => {
        this.impuesto = res.resultado as Impuesto;
        //console.log(this.porcentaje_impuesto);
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );

  }

  cargarSaldoInicial() {
    if (this.producto.categoriaProducto.id == 1) { //Para bienes
      if (this.producto.medidaKardex.id == 0) {
        Swal.fire(constantes.error, constantes.error_medida, constantes.error_swal);
        return;
      }
      //console.log(this.kardex_inicial.cantidad);
      if (this.kardexInicial.cantidad == 0) {
        Swal.fire({
          title: constantes.advertencia, text: constantes.mensaje_kardex_inicial, icon: constantes.advertencia_swal,
          showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: constantes.si_seguro
        }).then((result) => {
          if (result.isConfirmed) {
            this.crearKardexPrecios();
          } else {
            //console.log("No crear");
            return;
          }
        })
      } else {
        this.crearKardexPrecios();
      }
    } else { // Para Sevicios y A.F.
      if (this.precioServicioAF == 0) {
        Swal.fire(constantes.error, constantes.error_precio, constantes.error_swal);
        return;
      }
      // Obtengo medida Unidad
      this.medidaService.obtener(13).subscribe(
        res => {
          this.producto.medidaKardex = res.resultado as Medida;
          this.crearKardexPrecios();
          //console.log(this.producto.medidaKardex);
        },
        err => {
          Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
        }
      );
      this.kardexInicial.cantidad = 1;
      this.kardexInicial.costoPromedio = Number((this.precioServicioAF * 100 / (100 + this.impuesto.porcentaje)).toFixed(4));
      
    }
  }

  crearKardexPrecios() {
    if (this.kardexInicial.cantidad < 0 || this.kardexInicial.cantidad == null) {
      Swal.fire(constantes.error, constantes.error_cantidad, constantes.error_swal);
      return;
    }
    if (this.kardexInicial.costoPromedio < 0 || this.kardexInicial.costoPromedio == null) {
      Swal.fire(constantes.error, constantes.error_costo_unitario, constantes.error_swal);
      return;
    }
    this.kardexInicial.costoTotal = Number((this.kardexInicial.cantidad * this.kardexInicial.costoPromedio).toFixed(2));
// Falta Crear y traer de la tabla operaciones_kardex
    this.kardexInicial.operacion = constantes.operacion_inicial_kardex;
    this.kardexFinal = this.kardexInicial;
    this.producto.stockTotal = this.kardexInicial.cantidad;
    this.producto.kardexs.push(this.kardexInicial);
    this.crearBodega();
    this.llenarTablaPrecios(this.producto.medidaKardex);
    //this.actualizar_precios();
    Swal.fire('Bien!', 'El kardex fue inicializado', 'success')
    this.deshabilitarMedidaKardex();
    this.deshabilitarOtrasMedidas = false;
    this.buscarMedidasEquivalentes(this.producto.medidaKardex.id);
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
    if (medida.id == this.producto.medidaKardex.id) {
      costo = Number((this.kardexFinal.costoPromedio));
    } else {
      costo = Number((this.kardexFinal.costoPromedio / this.medidaEquivalenteSeleccionada.equivalencia).toFixed(4));
    }
    this.calcularPrecios(medida, costo);
    this.nuevoAbrirPanelPrecios();
    this.medidaPrecio.medida = medida;
    this.medidaPrecio.precios = this.precios;
    this.medidasPrecios.push(this.medidaPrecio);
    //console.log(this.medidasPrecios);
    this.observablePrecios = new BehaviorSubject(this.medidaPrecio.precios);
    this.datos.push(this.observablePrecios);
    //console.log(this.datos);
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
      //console.log(this.abrirPanelPrecios);
    }
  }

  cambiarAbrirPanelPrecios(index: number){
    //console.log("Abierto: " + index);
    if (this.abrirPanelPrecios.length > 0) {
      for (let i = 0; i < this.abrirPanelPrecios.length; i++) {
        if (i == index){
          this.abrirPanelPrecios[i] = true;
        } else {
        this.abrirPanelPrecios[i] = false;
        }
      }
      //console.log(this.abrirPanelPrecios);
    }
  }

  agregarPrecio() {
    if (this.kardexFinal.costoPromedio < 0) {
      Swal.fire(constantes.error, constantes.error_costo, constantes.error_swal);
      return;
    }
    if (this.medidaEquivalenteSeleccionada.id == 0) {
      Swal.fire(constantes.error, constantes.error_medida, constantes.error_swal);
      return;
    }
    this.llenarTablaPrecios(this.medidaEquivalenteSeleccionada.medida2);
    this.eliminarMedidaEquivalente(this.medidaEquivalenteSeleccionada.medida2);
  }
 
  eliminarMedidaPrecio(i: number){
    //console.log(i);
    //console.log(this.medidasPrecios);
    this.medidasPrecios.splice(i,1);
    this.observablePrecios = new BehaviorSubject(this.medidaPrecio.precios);
    this.datos.splice(i, 1);
    this.controls.splice(i, 1);
    this.abrirPanelPrecios.splice(i, 1);
    this.actualizarAbrirPanel();
    this.buscarMedidasEquivalentes(this.producto.medidaKardex.id);
    this.actualizarTablaPrecios();  
    //console.log(this.medidasPrecios);
    //console.log(this.tablaPrecios);
  }

  activarControles(i: number) {
    const toGroups = this.datos[i].value.map((entity:any) => {
      //console.log(entity.precioVentaPublicoManual);
      return new FormGroup({
        margenGanancia: new FormControl(entity.margenGanancia, Validators.required),
        precioVentaPublicoManual: new FormControl(entity.precioVentaPublicoManual, Validators.required),
      }, { updateOn: "blur" });
      
    });
    this.controls.push(new FormArray(toGroups));
    //console.log(this.controls);
  }

  actualizarControles(i: number) {
    const toGroups = this.datos[i].value.map((entity:any) => {
      return new FormGroup({
        margenGanancia: new FormControl(entity.margenGanancia, Validators.required),
        precioVentaPublicoManual: new FormControl(entity.precioVentaPublicoManual, Validators.required),
      }, { updateOn: "blur" });
      
    });
    this.controls[i]=(new FormArray(toGroups));
  }

  actualizarCalculosPrecios(i: number, index: number, field: string) {
    const control = this.getControl(i, index, field);
    if (control.valid) {
      this.update(i, index, field, control.value);
      //this.actualizarPrecios(field);
    }
  }

  getControl(i: number, index: number, fieldName: string) {
    const a = this.controls[i].at(index).get(fieldName) as FormControl;
    //console.log('a');
    //console.log(a);
    return a; //this.controls[i].at(index).get(fieldName) as FormControl;
  }

  update(i: number, index: number, field: string, value: number) {
    //console.log(i, index, field, value);
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
/*
  actualizar_precios(fieldName) {
    for (let i = 0; i < this.medidas_precios.length; i++) {
      for (let j = 0; j < this.medidas_precios[i].precios.length; j++) {
        this.medidas_precios[i].precios[j].precio_sin_iva = Number((this.medidas_precios[i].precios[j].costo / (1 - (this.medidas_precios[i].precios[j].margen_ganancia / 100))).toFixed(4));
        //this.medidas_precios[i].precios[j].precio_venta_publico = Number(this.producto.medidas_precios[i].precios[j].precio_venta_publico.toFixed(2));
        //console.log(this.porcentaje_impuesto.porcentaje);
        this.medidas_precios[i].precios[j].precio_venta_publico = Number((this.medidas_precios[i].precios[j].precio_sin_iva + (this.medidas_precios[i].precios[j].precio_sin_iva * (this.porcentaje_impuesto.porcentaje / 100))).toFixed(4));
        //console.log(this.medidas_precios[i].precios[j].precio_venta_publico);
        //this.medidas_precios[i].precios[j].precio_venta_publico_iva = Number(this.producto.medidas_precios[i].precios[j].precio_venta_publico_iva.toFixed(2));
        if (fieldName == 'margen_ganancia') {
          this.medidas_precios[i].precios[j].precio_venta_publico_manual = this.medidas_precios[i].precios[j].precio_venta_publico;
        } else {
          this.medidasPrecios[i].precios[j].precioVentaPublicoManual = this.medidasPrecios[i].precios[j].precioVentaPublicoManual;
        }
        this.medidasPrecios[i].precios[j].utilidad = Number(((this.medidasPrecios[i].precios[j].precioVentaPublicoManual * 100 / (100 + this.producto.impuesto.porcentaje)) - this.medidasPrecios[i].precios[j].costo).toFixed(2));
        //this.medidas_precios[i].precios[j].utilidad = Number(this.producto.medidas_precios[i].precios[j].utilidad.toFixed(2));
        this.medidasPrecios[i].precios[j].utilidadPorcentaje = Number((this.medidasPrecios[i].precios[j].utilidad / (this.medidasPrecios[i].precios[j].precioVentaPublicoManual * 100 / (100 + this.producto.impuesto.porcentaje)) * 100).toFixed(2));
        //this.medidas_precios[i].precios[j].utilidad_porcentaje = Number(this.producto.medidas_precios[i].precios[j].utilidad_porcentaje.toFixed(2));
      }
    }
  }*/

  buscarMedidasEquivalentes(medidaKardexId: number) {
    // cambiar por producto.medida_kardex.id
    //console.log(medida_kardex_id);
    this.equivalenciaMedidaService.buscarMedidasEquivalentes(medidaKardexId).subscribe(
      res => {
        this.medidasEquivalentes = res.resultado as EquivalenciaMedida[];
        //console.log(this.medidasEquivalentes);
        //console.log('med_pre', this.medidas_precios);
        if (this.medidasPrecios.length > 1) {
          this.actualizarMedidasEquivalentes()
        }
        else {
          this.eliminarMedidaEquivalente(this.producto.medidaKardex);
          //console.log(this.medidas_equivalentes);
        }
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  eliminarMedidaEquivalente(medidaAgregada: Medida) {
    //console.log(this.medidas_equivalentes.length);
    for (let i = 0; i < this.medidasEquivalentes.length; i++) {
      if (this.medidasEquivalentes[i].medida2.id == medidaAgregada.id) {
        this.medidasEquivalentes.splice(i, 1);
        //console.log('elim', this.medidas_equivalentes);
      }
    }
  }

  actualizarMedidasEquivalentes() {
    //console.log(this.medidas_equivalentes);
    //console.log(this.medidas_precios);
    for (let i = 0; i < this.medidasPrecios.length; i++) {
      for (let j = 0; j < this.medidasEquivalentes.length; j++) {
        if (this.medidasEquivalentes[j].medida2.id == this.medidasPrecios[i].medida.id) {
          this.medidasEquivalentes.splice(j, 1);
          //console.log('elim_act', this.medidas_equivalentes);
        }
      }
    }
  }

  recargar() {
    let actual = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([actual]);
    });
  }

  grupoSeleccionado(event: any) {
    //console.log(event);
    let grupoProductoRecibido = event.grupoProductoSeleccionado as GrupoProducto;
    this.producto.grupoProducto = grupoProductoRecibido;
    //console.log(grupoProductoRecibido.codigo);
  }

  dialogoGruposProductos(): void {
    //console.log('El dialogo para selección de grupo producto fue abierto');
    const dialogRef = this.dialog.open(DialogoGrupoProductoComponent, {
      width: '80%',
      // Para enviar datos
      //data: { usuario: this.usuario, clave: this.clave, grupo_producto_recibido: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('El dialogo para selección de grupo producto fue cerrado');
      if (result) {
        this.producto.grupoProducto = result as GrupoProducto;
        this.producto.nombre = this.producto.grupoProducto.linea + constantes.espacio +
          this.producto.grupoProducto.sublinea + constantes.espacio + this.producto.grupoProducto.presentacion;
        //this.ver_acordeon_precios = true;
        //this.usuario = result;
        //console.log(this.producto.grupo_producto);
      }
    });
  }

}

@Component({
  selector: 'dialogo-grupo-producto',
  templateUrl: 'dialogo-grupo-producto.component.html',
})
export class DialogoGrupoProductoComponent {

  gruposProductos: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogoGrupoProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GrupoProducto) { }

  onNoClick(): void {
    this.dialogRef.close();
    //console.log('El dialogo para selección de grupo producto fue cancelado');
    this.data = new GrupoProducto;
  }

  grupoSeleccionado(event: any) {
    //console.log(event);
    if (event && event.id != 0) {
      this.data = event.grupoProductoSeleccionado as GrupoProducto;
      //this.producto.grupo_producto = grupoProductoRecibido;
      //console.log(this.data.codigo);
    } else {
      this.data = new GrupoProducto;
    }
  }
}