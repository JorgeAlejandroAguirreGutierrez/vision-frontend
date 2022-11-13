import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { EmailValidator, FormControl, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';

import { Empresa } from '../../modelos/usuario/empresa';
import { EmpresaService } from '../../servicios/usuario/empresa.service';
import { EstablecimientoService } from '../../servicios/usuario/establecimiento.service';
import { Establecimiento } from '../../modelos/usuario/establecimiento';
import { Ubicacion } from '../../modelos/configuracion/ubicacion';
import { UbicacionService } from '../../servicios/configuracion/ubicacion.service';
import { Telefono } from '../../modelos/cliente/telefono';
import { Celular } from '../../modelos/cliente/celular';
import { Correo } from '../../modelos/cliente/correo';
import { Coordenada } from '../../modelos/configuracion/coordenada';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-establecimiento',
  templateUrl: './establecimiento.component.html',
  styleUrls: ['./establecimiento.component.scss']
})

export class EstablecimientoComponent implements OnInit {

  abierto: string = valores.abierto;
  cerrado: string = valores.cerrado;

  sesion: Sesion=null;
  abrirPanelAsignarEstablecimiento: boolean = true;
  abrirPanelUbicacionEstablecimiento: boolean = true;
  verBotones: boolean = false;
  deshabilitarEditarEstablecimiento: boolean = true;
  deshabilitarFiltroEstablecimientos: boolean = true;
  verActualizarEstablecimiento: boolean = false;
  verActualizarEmpresa: boolean = false;
  formularioValido: boolean = true;

  empresa: Empresa = new Empresa();
  establecimiento: Establecimiento = new Establecimiento();
  //productoProveedor: ProductoProveedor = new ProductoProveedor();

  codigoEquivalente: string = "";
  establecimientoProvincia: string = "";
  establecimientoCanton: string = "";
  establecimientoParroquia: string = "";

  //productoProveedores: ProductoProveedor[] = [];

  //Variables para los autocomplete
  empresas: Empresa[]=[];
  controlEmpresa = new UntypedFormControl();
  filtroEmpresas: Observable<Empresa[]> = new Observable<Empresa[]>();

  establecimientos: Establecimiento[] = [];
  filtroEstablecimientos: Observable<Establecimiento[]> = new Observable<Establecimiento[]>();

  telefono = new Telefono();
  celular = new Celular();
  correo = new Correo();

  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];

  correoEmpresa = new FormControl('', [Validators.email]);

  //Mapa
  latitud: number = valores.latCiudad;
  longitud: number = valores.lngCiudad;
  posicionCentral: Coordenada = new Coordenada(this.latitud, this.longitud);
  posicionGeografica: Coordenada;
  coordenadas: Coordenada[] = [];
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 12,
  };

  @ViewChild("inputFiltroEstablecimiento") inputFiltroEstablecimiento: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnasEstablecimiento: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Establecimiento) => `${row.id}`},
    { nombreColumna: 'codigo_propio', cabecera: 'Código propio', celda: (row: Establecimiento) => `${row.codigo}`},
    { nombreColumna: 'codigo_factura', cabecera: 'Código factura', celda: (row: Establecimiento) => `${row.codigoSRI}`},
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Establecimiento) => `${row.descripcion}`},
    { nombreColumna: 'direccion', cabecera: 'Dirección', celda: (row: Establecimiento) => `${row.direccion}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Establecimiento) => `${row.estado}`}
  ];
  cabeceraEstablecimiento: string[]  = this.columnasEstablecimiento.map(titulo => titulo.nombreColumna);
  dataSourceEstablecimiento: MatTableDataSource<Establecimiento>;
  clickedRowsEstablecimiento = new Set<Establecimiento>();
  
  constructor(public dialog: MatDialog, private establecimientoService: EstablecimientoService, private empresaService: EmpresaService, private sesionService: SesionService, private router: Router,
    private renderer: Renderer2, private ubicacionService: UbicacionService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarEmpresas();
    this.consultarEstablecimientos();
    this.ubicacionService.obtenerProvincias().subscribe({
      next: res => {
        this.provincias = res.resultado as Ubicacion[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
    this.filtroEmpresas = this.controlEmpresa.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(empresa => typeof empresa === 'string' ? this.filtroEmpresa(empresa) : this.empresas.slice())
      );

  }

  limpiar(){
    this.empresa = new Empresa();
    this.abrirPanelAsignarEstablecimiento = true;
    this.deshabilitarFiltroEstablecimientos = true;
    this.verBotones = false;
    this.deshabilitarEditarEstablecimiento = false;
    this.verActualizarEmpresa = false;
    this.controlEmpresa.patchValue('');
    this.establecimiento = new Establecimiento();
    this.establecimientos = [];
    this.limpiarEstablecimiento();
    this.dataSourceEstablecimiento = new MatTableDataSource();
    this.clickedRowsEstablecimiento = new Set<Establecimiento>();
    this.borrarFiltroEstablecimiento();
  };

  actualizarEmpresa(event: any){
    if (event!=null)
      event.preventDefault();
    if (this.empresa.razonSocial == valores.vacio) {
        Swal.fire(error, mensajes.error_nombre_producto, error_swal);
        return;
    }
    console.log(this.empresa);
    //this.producto.kardexs[0].proveedor = new Proveedor;
    this.empresaService.actualizar(this.empresa).subscribe({
      next: (res) => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
        //this.consultar();
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  consultarEmpresas() {
    this.empresaService.consultar().subscribe({
      next: (res) => {
        this.empresas = res.resultado as Empresa[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }
  private filtroEmpresa(value: string): Empresa[] {
    if(this.empresas.length>0) {
      const filterValue = value.toLowerCase();
      return this.empresas.filter(empresa => empresa.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verEmpresa(empresa: Empresa): string {
    return empresa && empresa.nombreComercial ? empresa.nombreComercial : '';
  }
  seleccionarEmpresa(){
    this.empresa = this.controlEmpresa.value as Empresa;
    //this.establecimiento = this.producto.productosProveedores;
    //this.verBotones = true;
    this.deshabilitarEditarEstablecimiento = false;
    if (this.establecimientos.length > 0) {
      this.deshabilitarFiltroEstablecimientos = false;
      this.llenarDataSourceEstablecimiento(this.establecimientos);
    }
  }

  // CODIGO PARA Establecimiento
  limpiarEstablecimiento(){
    this.establecimiento = new Establecimiento();
    this.deshabilitarEditarEstablecimiento = false;
    this.codigoEquivalente = "";
    this.verActualizarEstablecimiento = false;
    this.clickedRowsEstablecimiento.clear();
  }

  agregarEstablecimiento(){
    let existe: boolean;
    existe = this.existeEstablecimiento();
    if (existe) {
      Swal.fire(error, mensajes.error_producto_proveedor, error_swal);
      return;
    }
    this.establecimiento = new Establecimiento();
 /*   this.productoProveedor.producto.id = this.producto.id
    this.productoProveedor.proveedor = this.proveedor;
    this.productoProveedor.codigoEquivalente = this.codigoEquivalente;
    this.productoProveedores.push(this.productoProveedor);
    this.producto.productosProveedores = this.productoProveedores;*/
    this.llenarDataSourceEstablecimiento(this.establecimientos);
    this.verActualizarEmpresa = true;
    this.limpiarEstablecimiento();
  }

  llenarDataSourceEstablecimiento(establecimientos : Establecimiento[]){
    this.dataSourceEstablecimiento = new MatTableDataSource(establecimientos);
    this.dataSourceEstablecimiento.filterPredicate = (data: Establecimiento, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.codigoSRI.toUpperCase().includes(filter) ||
      data.descripcion.toUpperCase().includes(filter) ||data.direccion.toUpperCase().includes(filter) || data.estado.toUpperCase().includes(filter);
    this.dataSourceEstablecimiento.paginator = this.paginator;
    this.dataSourceEstablecimiento.sort = this.sort;
  }

  filtroEstablecimiento(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEstablecimiento.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceEstablecimiento.paginator) {
      this.dataSourceEstablecimiento.paginator.firstPage();
    }
  }
  borrarFiltroEstablecimiento(){
    this.renderer.setProperty(this.inputFiltroEstablecimiento.nativeElement, 'value', '');
    //Funciona, pero es mala práctica
    //this.inputFiltroProductoProveedor.nativeElement.value = '';
    this.dataSourceEstablecimiento.filter = '';
  }

  seleccionEstablecimiento(establecimientoSeleccionado: Establecimiento) {
      if (!this.clickedRowsEstablecimiento.has(establecimientoSeleccionado)){
        this.limpiarEstablecimiento();
        this.construirEstablecimiento(establecimientoSeleccionado);
      } else {
        this.limpiarEstablecimiento();  
    }
  }

  construirEstablecimiento(establecimientoSeleccionado: Establecimiento) {
    //this.productoProveedorService.currentMessage.subscribe(message => productoProveedorId = message);
    if (establecimientoSeleccionado.id != 0) {
      this.clickedRowsEstablecimiento.add(establecimientoSeleccionado);
      this.establecimiento = establecimientoSeleccionado;

      //this.codigoEquivalente = this.establecimiento.codigoEquivalente;
      this.deshabilitarEditarEstablecimiento = true;
      //this.actualizar_precios();
    }
  }

  existeEstablecimiento():boolean{
    for (let i = 0; i < this.establecimientos.length; i++) {
      if (this.establecimiento.id == this.establecimientos[i].id){
        return true;
      }
    }
    return false;
  }

  editarEstablecimiento(){
    this.verActualizarEstablecimiento = true;
    this.deshabilitarEditarEstablecimiento = false;
  }
  
  actualizarEstablecimiento(){
    this.establecimiento.codigo = this.codigoEquivalente;
    this.verActualizarEmpresa = true;
    this.limpiarEstablecimiento();
  }

  eliminarEstablecimiento(event: any, i:number) {
    if (event != null)
    event.preventDefault();
    this.establecimientos.splice(i, 1);
    this.llenarDataSourceEstablecimiento(this.establecimientos);
    //this.producto.productosProveedores = this.productoProveedores;
    if (confirm("Realmente quiere eliminar el establecimiento?")) {
    this.establecimientoService.eliminar(this.establecimiento).subscribe({
      next: (res) => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        //this.consultar();
      },
      error: (err) => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
    }
  }

  // Metodos para los autocomplete
  consultarEstablecimientos(){
    this.establecimientoService.consultar().subscribe({
      next: res => {
        this.establecimientos = res.resultado as Establecimiento[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  nuevo(event: any) {
    if (event!=null)
      event.preventDefault();
    this.establecimiento = new Establecimiento();
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    this.establecimientoService.crear(this.establecimiento).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.establecimientoService.actualizar(this.establecimiento).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.establecimiento=res.resultado as Establecimiento;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
/*
  async construirEstablecimiento() {
    let establecimientoId=0;
    this.establecimientoService.currentMessage.subscribe(message => establecimientoId = message);
    if (establecimientoId!= 0) {
      await this.establecimientoService.obtenerAsync(establecimientoId).then(
        res => {
          Object.assign(this.establecimiento, res.resultado as Establecimiento);
          this.establecimientoService.enviar(0);
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }*/

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  
  provincia(provincia: string) {
    this.establecimiento.ubicacion.provincia = provincia;
    this.ubicacionService.obtenerCantones(provincia).subscribe({
      next: res => {
        if (res.resultado != null) {
          this.cantones = res.resultado as Ubicacion[];
        } else {
          Swal.fire(error, res.mensaje, error_swal);
        }
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  canton(canton: string) {
    this.establecimiento.ubicacion.canton = canton;
    this.ubicacionService.obtenerParroquias(canton).subscribe({
      next: res => {
        if (res.resultado != null) {
          this.parroquias = res.resultado as Ubicacion[];
        } else {
          Swal.fire({ icon: error_swal, title: error, text: res.mensaje })
        }
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  parroquia(parroquia: string) {
    this.establecimiento.ubicacion.parroquia = parroquia;
  }

  agregarTelefonosCorreo(){
    if (this.telefono.numero != ""){
      this.establecimiento.telefonos.push(this.telefono);
      //console.log("telefono");
    }
    if (this.celular.numero != ""){
      this.establecimiento.celulares.push(this.celular);
    }
    if (this.correoEmpresa.value != '' && this.correoEmpresa.valid){
      this.correo.email = this.correoEmpresa.value
      this.establecimiento.correos.push(this.correo);
      //console.log("correo");
    }
  }

  crearTelefono() {
    if (this.telefono.numero.length != valores.cero) {
      this.establecimiento.telefonos.push(this.telefono);
      this.telefono = new Telefono();
    } else {
      Swal.fire(error, "Ingrese un número telefónico válido", error_swal);
    }
  }
  validarTelefono() {
    let digito = this.telefono.numero.substring(0, 1);
    if (this.telefono.numero.length != 11 || digito != "0") {
      //this.telefono.numero = valores.vacio;
      Swal.fire(error, "Telefono Invalido", error_swal);
    }
  }
  eliminarTelefono(i: number) {
    this.establecimiento.telefonos.splice(i, 1);
  }

  crearCelular() {
    if (this.celular.numero.length != valores.cero) {
      this.establecimiento.celulares.push(this.celular);
      this.celular = new Celular();
    } else {
      Swal.fire(error, "Ingrese un número de celular válido", error_swal);
    }
  }
  validarCelular() {
    let digito = this.celular.numero.substring(0, 2);
    if (this.celular.numero.length != 12 || digito != "09") {
      //this.celular.numero = valores.vacio;
      Swal.fire(error, "Celular Invalido", error_swal);
    }
  }
  eliminarCelular(i: number) {
    this.establecimiento.celulares.splice(i, 1);
  }

  getErrorMessage() {
    if (this.correoEmpresa.hasError('required')) {
      return 'Correo requerido';
    }
    return this.correoEmpresa.hasError('email') ? 'No es un correo' : '';
  }
  crearCorreo() {
    if (this.correoEmpresa.value != '' && this.correoEmpresa.valid) {
      this.correo.email = this.correoEmpresa.value;
      this.establecimiento.correos.push(this.correo);
      this.correo = new Correo();
      this.correoEmpresa.setValue('');
    } else {
      Swal.fire(error, "Ingrese un correo válido", error_swal);
    }
  }
  validarCorreo() {
    let arroba = this.correo.email.includes("@");
    if (!arroba) {
      //this.correo.email = "";
      Swal.fire(error, "Correo Invalido", error_swal);
    }
  }
  eliminarCorreo(i: number) {
    this.establecimiento.correos.splice(i, 1);
  }

  
  validarFormulario(){
    this.formularioValido = true;
    if (this.empresa.identificacion == '') {
      Swal.fire(error, mensajes.error_identificacion, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.empresa.razonSocial == '') {
      Swal.fire(error, mensajes.error_razon_social, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.establecimiento.direccion == '') {
      Swal.fire(error, mensajes.error_direccion, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.establecimiento.ubicacion.provincia == '' || this.establecimiento.ubicacion.canton == '' || this.establecimiento.ubicacion.parroquia == '') {
      Swal.fire(error, mensajes.error_ubicacion, error_swal);
      this.formularioValido = false;
      return;
    }

  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  dialogoMapas(): void {
    //console.log('El dialogo para selección de grupo producto fue abierto');
    const dialogRef = this.dialog.open(DialogoMapaEstablecimientoComponent, {
      width: '80%',
      // Para enviar datos
      //data: { usuario: this.usuario, clave: this.clave, grupo_producto_recibido: "" }
      data: this.posicionGeografica as Coordenada
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('El dialogo para selección de coordenada fue cerrado');
      console.log(result);
      if (result) {
        this.posicionGeografica = result as Coordenada;
        this.posicionCentral = this.posicionGeografica;
        this.establecimiento.latitud = this.posicionGeografica.lat;
        this.establecimiento.longitud = this.posicionGeografica.lng;
       //console.log(result);
      }
    });
  }

}

@Component({
  selector: 'dialogo-mapa-establecimiento',
  templateUrl: 'dialogo-mapa-establecimiento.component.html',
})

export class DialogoMapaEstablecimientoComponent {

  mapa: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogoMapaEstablecimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Coordenada) { }

  onNoClick(): void {
    this.dialogRef.close();
    //console.log('El dialogo para selección de coordenada fue cancelado');
    this.data = new Coordenada(0,0);
  }

  coordenadaSeleccionada(event: any) {
    //console.log(event);
    if (event && event.latitud != 0) {
      this.data = event as Coordenada;
      //this.producto.grupo_producto = grupoProductoRecibido;
      //console.log(this.data);
    } else {
      this.data = new Coordenada(0,0);
    }
  }
}
