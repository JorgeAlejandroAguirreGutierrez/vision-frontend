import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { valores, mensajes, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { Producto } from '../../modelos/inventario/producto';
import { ProductoService } from '../../servicios/inventario/producto.service';
import { Bodega } from '../../modelos/inventario/bodega';
import { BodegaService } from '../../servicios/inventario/bodega.service';
import { ProductoBodega } from '../../modelos/inventario/producto-bodega';
//Solo por el error
import { Proveedor } from '../../modelos/compra/proveedor';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Sesion } from 'src/app/modelos/usuario/sesion';

@Component({
  selector: 'app-transferencia-bodega',
  templateUrl: './transferencia-bodega.component.html',
  styleUrls: ['./transferencia-bodega.component.scss']
})
export class TransferenciaBodegaComponent implements OnInit {
  
  abrirPanelAsignarBodega: boolean = true;
  deshabilitarBodegaDestino: boolean = true;
  deshabilitarFiltroBodega: boolean = true;
  verActualizarProducto = false;
  sesion: Sesion=null;
  verPanelAsignarBodega: boolean = false;

  producto: Producto = new Producto();
  bodegaOrigen: Bodega = new Bodega();
  bodegaDestino: Bodega = new Bodega();
  productoBodega: ProductoBodega = new ProductoBodega();

  //cantidadBodegaOrigen:number = 0;
  cantidadBodegaDestino: number = 0;

  productosBodegas: ProductoBodega[] = [];

  //Variables para los autocomplete
  productos: Producto[] = [];
  controlProducto = new FormControl();
  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();

  bodegas: Bodega[] = [];
  bodegasDestino: Bodega[] = [];
  controlBodegaDestino = new FormControl();
  filtroBodegasDestino: Observable<Bodega[]> = new Observable<Bodega[]>();

  @ViewChild("inputFiltroProductoBodega") inputFiltroProductoBodega: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnasProductoBodega: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: ProductoBodega) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: ProductoBodega) => `${row.codigo}` },
    { nombreColumna: 'codigo_bodega', cabecera: 'Código bodega', celda: (row: ProductoBodega) => `${row.bodega.codigo}` },
    { nombreColumna: 'nombre_bodega', cabecera: 'Nombre Bodega', celda: (row: ProductoBodega) => `${row.bodega.nombre}` },
    { nombreColumna: 'cantidad', cabecera: 'Cantidad', celda: (row: ProductoBodega) => `${row.cantidad}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones', celda: (row: any) => '' }
  ];
  cabeceraProductoBodega: string[] = this.columnasProductoBodega.map(titulo => titulo.nombreColumna);
  dataSourceProductoBodega: MatTableDataSource<ProductoBodega>;
  clickedRowsProductoBodega = new Set<ProductoBodega>();

  constructor(private renderer: Renderer2, private productoService: ProductoService, private bodegaService: BodegaService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarProductos();
    this.consultarBodegasDestino();
    this.filtroProductos = this.controlProducto.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(producto => typeof producto === 'string' ? this.filtroProducto(producto) : this.productos.slice())
      );

    this.filtroBodegasDestino = this.controlBodegaDestino.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(bodegaDestino => typeof bodegaDestino === 'string' ? this.filtroBodegaDestino(bodegaDestino) : this.bodegasDestino.slice())
      );
  }

  // CÓDIGO EN COMÚN
  limpiar() {
    this.producto = new Producto();
    this.abrirPanelAsignarBodega = true;
    this.verActualizarProducto = false;
    this.deshabilitarFiltroBodega = true;
    this.controlProducto.patchValue('');
    this.productoBodega = new ProductoBodega();
    this.productosBodegas = [];
    this.limpiarBodega();
    this.dataSourceProductoBodega = new MatTableDataSource();
    this.clickedRowsProductoBodega = new Set<ProductoBodega>();
    this.borrarFiltroProductoBodega();
  };

  actualizarProducto(event: any) {
    if (event != null)
      event.preventDefault();
    if (this.producto.nombre == '') {
      Swal.fire(error, mensajes.error_nombre_producto, error_swal);
      return;
    }
    console.log(this.producto);
    // Corregir este error
    //this.producto.kardexs[0].proveedor = new Proveedor;
    this.productoService.actualizar(this.producto).subscribe({
      next: (res) => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message });
      }
    });
  }

  consultarProductos() {
    this.productoService.consultar().subscribe({
      next: (res) => {
        this.productos = res.resultado as Producto[]
      },
      error: (err) => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    });
  }
  private filtroProducto(value: string): Producto[] {
    if (this.productos.length > 0) {
      const filterValue = value.toLowerCase();
      return this.productos.filter(producto => producto.nombre.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : '';
  }
  seleccionarProducto() {
    this.producto = this.controlProducto.value as Producto;
    this.productosBodegas = this.producto.productosBodegas;
    this.llenarDataSourceProductoBodega(this.productosBodegas);
  }

  // CODIGO PARA BODEGA
  limpiarBodega() {
    this.productoBodega = new ProductoBodega();
    this.bodegaDestino = new Bodega();
    this.bodegasDestino = this.bodegas;
    this.clickedRowsProductoBodega.clear();
    this.controlBodegaDestino.patchValue("");
    this.controlBodegaDestino.disable();
    this.cantidadBodegaDestino = 0;
    this.deshabilitarBodegaDestino = true;
  }

  agregarProductoBodega() {
    for (let i = 0; i < this.productosBodegas.length; i++) {
      if (this.productosBodegas[i].bodega.id == this.productoBodega.bodega.id) {
        if (this.cantidadBodegaDestino <= this.productosBodegas[i].cantidad) {
          this.productosBodegas[i].cantidad = this.productosBodegas[i].cantidad - this.cantidadBodegaDestino;
          this.calcularCantidadBodegaDestino(this.bodegaDestino);
          this.llenarDataSourceProductoBodega(this.productosBodegas);
          this.verActualizarProducto = true;
          this.limpiarBodega();
        } else {
          Swal.fire(error, mensajes.error_bodega_cantidad, error_swal);
          return;
        }

      }
    }
  }

  calcularCantidadBodegaDestino(bodegaModificar: Bodega) {
    if (this.existeBodega(bodegaModificar)) {
      for (let i = 0; i < this.productosBodegas.length; i++) {
        if (this.productosBodegas[i].bodega.id == bodegaModificar.id) {
          this.productosBodegas[i].cantidad = Number(this.productosBodegas[i].cantidad) + Number(this.cantidadBodegaDestino);
        }
      }
    } else {
      this.productoBodega = new ProductoBodega();
      this.productoBodega.producto.id = this.producto.id
      this.productoBodega.bodega = bodegaModificar;
      this.productoBodega.cantidad = this.cantidadBodegaDestino;
      this.productosBodegas.push(this.productoBodega);
      this.producto.productosBodegas = this.productosBodegas;
    }
  }

  existeBodega(bodega: Bodega): boolean {
    for (let i = 0; i < this.productosBodegas.length; i++) {
      if (bodega.id == this.productosBodegas[i].bodega.id) {
        return true;
      }
    }
    return false;
  }

  llenarDataSourceProductoBodega(productosBodegas: ProductoBodega[]) {
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
  borrarFiltroProductoBodega(){
    this.renderer.setProperty(this.inputFiltroProductoBodega.nativeElement, 'value', '');
    this.dataSourceProductoBodega.filter = '';
  }

  seleccionProductoBodega(productoBodegaSeleccionado: ProductoBodega) {
    if (!this.clickedRowsProductoBodega.has(productoBodegaSeleccionado)) {
      this.limpiarBodega();
      this.construirProductoBodega(productoBodegaSeleccionado);
    } else {
      this.limpiarBodega();
    }
  }

  construirProductoBodega(productoBodegaSeleccionado: ProductoBodega) {
    //this.productoProveedorService.currentMessage.subscribe(message => productoProveedorId = message);
    if (productoBodegaSeleccionado.bodega.id != 0) {
      this.clickedRowsProductoBodega.add(productoBodegaSeleccionado);
      this.productoBodega = productoBodegaSeleccionado;
      this.bodegaOrigen = this.productoBodega.bodega;
      this.consultarBodegasDestino();
      this.eliminarBodegaDestino(this.bodegaOrigen);
      this.controlBodegaDestino.enable();
      this.deshabilitarBodegaDestino = false;
      //this.actualizar_precios();
    }
  }

  eliminarBodegaDestino(bodegaSeleccionada: Bodega) {
    this.bodegasDestino = this.bodegas;
    for (let i = 0; i < this.bodegasDestino.length; i++) {
      if (this.bodegasDestino[i].id == bodegaSeleccionada.id) {
        this.bodegasDestino.splice(i, 1);
        //console.log('elim', this.bodegas);
      }
    }
  }

  eliminarBodega(i:number) {
    if (this.productosBodegas[i].cantidad == 0){ 
      if (confirm("Realmente quiere eliminar la bodega?")) {
        this.productosBodegas.splice(i, 1);
        this.llenarDataSourceProductoBodega(this.productosBodegas);
        this.producto.productosBodegas = this.productosBodegas;
      }
    } else {
      Swal.fire(error, mensajes.error_eliminar_bodega, error_swal);
      return;
    }
  }

  // Metodos para los autocomplete
  consultarBodegasDestino() {
    this.bodegaService.consultar().subscribe({
      next: (res) => {
        this.bodegas = res.resultado as Bodega[];
        //this.controlBodegaDestino.disable();
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }
  private filtroBodegaDestino(value: string): Bodega[] {
    if (this.productos.length > 0) {
      const filterValue = value.toLowerCase();
      return this.bodegasDestino.filter(bodegaDestino => bodegaDestino.nombre.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBodegaDestino(bodegaDestino: Bodega): string {
    return bodegaDestino && bodegaDestino.nombre ? bodegaDestino.nombre : '';
  }
  seleccionarBodegaDestino() {
    this.bodegaDestino = this.controlBodegaDestino.value as Bodega;
  }

}
