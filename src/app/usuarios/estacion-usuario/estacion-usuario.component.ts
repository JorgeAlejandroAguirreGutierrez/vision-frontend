import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { Usuario } from '../../modelos/usuario/usuario';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Empresa } from '../../modelos/usuario/empresa';
import { EmpresaService } from '../../servicios/usuario/empresa.service';
import { EstablecimientoService } from '../../servicios/usuario/establecimiento.service';
import { Establecimiento } from '../../modelos/usuario/establecimiento';
import { Estacion } from '../../modelos/usuario/estacion';
import { EstacionService } from '../../servicios/usuario/estacion.service';
import { EstacionUsuario } from '../../modelos/usuario/estacion-usuario';
import { EstacionUsuarioService } from '../../servicios/usuario/estacion-usuario.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estacion-usuario',
  templateUrl: './estacion-usuario.component.html',
  styleUrls: ['./estacion-usuario.component.scss']
})
export class EstacionUsuarioComponent implements OnInit {

  sesion: Sesion=null;
  abrirPanelAsignarEstacion: boolean = true;
  deshabilitarEditarEstacion: boolean = true;
  deshabilitarFiltroEstaciones: boolean = true;
  verOpcionActualizarUsuario: boolean = false;
  verBotonActualizarEstacion: boolean = false;
  verBotones: boolean = false;
  formularioValido: boolean = true;
  formularioEstacionValido: boolean = true;

  usuario: Usuario = new Usuario();
  empresa: Empresa = new Empresa();
  establecimiento: Establecimiento = new Establecimiento();
  estacion: Estacion = new Estacion();
  estacionUsuario: EstacionUsuario = new EstacionUsuario();

  empresas: Empresa[];
  establecimientos: Establecimiento[];
  estaciones: Estacion[] = [];
  estacionesUsuarios: EstacionUsuario[] = [];

  //Variables para los autocomplete
  usuarios: Usuario[]=[];
  controlUsuario = new UntypedFormControl();
  filtroUsuarios: Observable<Usuario[]> = new Observable<Usuario[]>();

  @ViewChild("inputFiltroEstacionUsuario") inputFiltroEstacionUsuario: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnasEstacionUsuario: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: EstacionUsuario) => `${row.estacion.id}`},
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: EstacionUsuario) => `${row.estacion.codigo}`},
    { nombreColumna: 'empresa', cabecera: 'Empresa', celda: (row: EstacionUsuario) => `${row.estacion.establecimiento.empresa.nombreComercial}`},
    { nombreColumna: 'establecimiento', cabecera: 'Establecimiento', celda: (row: EstacionUsuario) => `${row.estacion.establecimiento.codigo}`}, // cambiar por descripcion y en filtro tambien
    { nombreColumna: 'estacion', cabecera: 'Estación', celda: (row: EstacionUsuario) => `${row.estacion.descripcion}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: EstacionUsuario) => `${row.estado}`},
    { nombreColumna: 'acciones', cabecera: 'Acciones', celda: (row: any) => ''}
  ];
  cabeceraEstacionUsuario: string[]  = this.columnasEstacionUsuario.map(titulo => titulo.nombreColumna);
  dataSourceEstacionUsuario: MatTableDataSource<EstacionUsuario>;
  clickedRowsEstacionUsuario = new Set<EstacionUsuario>();
  
  constructor(private renderer: Renderer2, private sesionService: SesionService, private usuarioService: UsuarioService, private empresaService: EmpresaService, 
    private establecimientoService: EstablecimientoService, private estacionService: EstacionService, private estacionUsuarioService: EstacionUsuarioService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarUsuarios();
    this.consultarEmpresas();

    this.filtroUsuarios = this.controlUsuario.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(usuario => typeof usuario === 'string' ? this.filtroUsuario(usuario) : this.usuarios.slice())
      );
  }

  limpiar(){
    this.usuario = new Usuario();
    this.abrirPanelAsignarEstacion = true;
    this.deshabilitarFiltroEstaciones = true;
    this.verBotones = false;
    this.deshabilitarEditarEstacion = false;
    this.verOpcionActualizarUsuario = false;
    this.controlUsuario.patchValue('');
    this.estacionUsuario = new EstacionUsuario();
    this.estacionesUsuarios = [];
    this.limpiarEstacion();
    this.dataSourceEstacionUsuario = new MatTableDataSource();
    this.clickedRowsEstacionUsuario = new Set<EstacionUsuario>();
    this.borrarFiltroEstacionUsuario();
  };

  actualizarUsuario(event: any){
    if (event!=null)
      event.preventDefault();

    this.validarFormulario()
    if (!this.formularioEstacionValido)
      return;
    this.usuario.estacionesUsuarios = this.estacionesUsuarios;   
    console.log(this.usuario);
    //this.producto.kardexs[0].proveedor = new Proveedor;
    this.usuarioService.actualizar(this.usuario).subscribe({
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

  consultarUsuarios() {
    this.usuarioService.consultar().subscribe({
      next: (res) => {
        this.usuarios = res.resultado as Usuario[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }
  private filtroUsuario(value: string): Usuario[] {
    if(this.usuarios.length>0) {
      const filterValue = value.toLowerCase();
      return this.usuarios.filter(usuario => usuario.nombre.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verUsuario(usuario: Usuario): string {
    return usuario && usuario.nombre ? usuario.nombre : '';
  }
  seleccionarUsuario(){
    this.usuario = this.controlUsuario.value as Usuario;
    this.deshabilitarEditarEstacion= false;
    this.verBotones = true;
    if (this.estacionesUsuarios.length > 0) {
      this.llenarDataSourceEstacionUsuario(this.estacionesUsuarios);
    }
  }

  // CODIGO PARA ESTACIÓN
  limpiarEstacion(){
    this.estacionUsuario = new EstacionUsuario();
    this.deshabilitarEditarEstacion = false;
    this.verBotonActualizarEstacion = false;
    this.clickedRowsEstacionUsuario.clear();
  }

  agregarEstacionUsuario(){
    this.validarFormularioEstacion()
    if (!this.formularioEstacionValido)
      return;  
    //this.estacionUsuario = new EstacionUsuario();
    this.estacionUsuario.usuario.id = this.usuario.id
    console.log(this.estacionUsuario);
    this.estacionesUsuarios.push(this.estacionUsuario);
    //this.usuario.productosProveedores = this.productoProveedores;
    this.llenarDataSourceEstacionUsuario(this.estacionesUsuarios);
    this.verOpcionActualizarUsuario = true;
    this.deshabilitarFiltroEstaciones = false;
    this.limpiarEstacion();
  }

  llenarDataSourceEstacionUsuario(estacionUsuarios : EstacionUsuario[]){
    this.dataSourceEstacionUsuario = new MatTableDataSource(estacionUsuarios);
    this.dataSourceEstacionUsuario.filterPredicate = (data: EstacionUsuario, filter: string): boolean =>
      data.estacion.codigo.toUpperCase().includes(filter) || data.estacion.establecimiento.empresa.nombreComercial.toUpperCase().includes(filter) || 
      data.estacion.establecimiento.codigo.toUpperCase().includes(filter) || data.estacion.descripcion.toUpperCase().includes(filter) || data.estado.toUpperCase().includes(filter);
    this.dataSourceEstacionUsuario.paginator = this.paginator;
    this.dataSourceEstacionUsuario.sort = this.sort;
  }

  filtroEstacionUsuario(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEstacionUsuario.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceEstacionUsuario.paginator) {
      this.dataSourceEstacionUsuario.paginator.firstPage();
    }
  }
  borrarFiltroEstacionUsuario(){
    this.renderer.setProperty(this.inputFiltroEstacionUsuario.nativeElement, 'value', '');
    //Funciona, pero es mala práctica
    //this.inputFiltroProductoProveedor.nativeElement.value = '';
    this.dataSourceEstacionUsuario.filter = '';
  }

  seleccionEstacionUsuario(estacionUsuarioSeleccionado: EstacionUsuario) {
      if (!this.clickedRowsEstacionUsuario.has(estacionUsuarioSeleccionado)){
        this.limpiarEstacion();
        this.construirEstacionUsuario(estacionUsuarioSeleccionado);
      } else {
        this.limpiarEstacion();  
    }
  }

  construirEstacionUsuario(estacionUsuarioSeleccionado: EstacionUsuario) {
    //this.productoProveedorService.currentMessage.subscribe(message => productoProveedorId = message);
    if (estacionUsuarioSeleccionado.estacion.id != 0) {
      this.clickedRowsEstacionUsuario.add(estacionUsuarioSeleccionado);
      this.estacionUsuario = estacionUsuarioSeleccionado;
      this.estacion = this.estacionUsuario.estacion;
      //this.controlProveedor.patchValue(this.proveedor.razonSocial);
      //this.codigoEquivalente = this.estacionUsuario.codigoEquivalente;
      this.deshabilitarEditarEstacion = true;
      //this.actualizar_precios();
    }
  }

  existeEstacionUsuario():boolean{
    for (let i = 0; i < this.estacionesUsuarios.length; i++) {
      //if (this.estacionUsuario.estacion.id == this.usuario.estacionesUsuarios[i].estacion.id){
      if (this.estacionUsuario.estacion.id == this.estacionesUsuarios[i].estacion.id){
        return true;
      }
    }
    return false;
  }

  editarEstacionUsuario(){
    this.verBotonActualizarEstacion = true;
    this.deshabilitarEditarEstacion = false;
  }
  
  actualizarEstacionUsuario(){
    //this.productoProveedor.codigoEquivalente = this.codigoEquivalente;
    this.verOpcionActualizarUsuario = true;
    this.limpiarEstacion();
  }

  eliminarUsuario(event: any, i:number) {
    if (event != null)
    event.preventDefault();
    this.estacionesUsuarios.splice(i, 1);
    this.llenarDataSourceEstacionUsuario(this.estacionesUsuarios);
    //this.producto.productosProveedores = this.productoProveedores;
    if (confirm("Realmente quiere eliminar la estación del usuario?")) {
    this.estacionUsuarioService.eliminar(this.estacionUsuario).subscribe({
      next: (res) => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        //this.consultar();
      },
      error: (err) => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
    }
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

  consultarEstablecimientos(empresaId: number) {
    //Reemplazar la fila comentada por la siguiente
    //this.establecimientoService.buscarEmpresa(empresaId).subscribe({
    this.establecimientoService.consultar().subscribe({
      next: res => {
        //console.log("estable");
        if (res.resultado != null) {
          this.establecimientos = res.resultado as Establecimiento[];
        } else {
          Swal.fire(error, res.mensaje, error_swal);
        }
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  // Metodos para los autocomplete
  consultarEstaciones(empresaId: number){
    this.estacionService.consultar().subscribe({
      next: res => {
        this.estaciones = res.resultado as Estacion[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  validarFormularioEstacion(){
    this.formularioEstacionValido = true;
    if (this.estacionUsuario.estacion.id == 0) {
      Swal.fire(error, mensajes.error_estacion, error_swal);
      this.formularioEstacionValido = false;
      return;
    } else { 
      if (this.existeEstacionUsuario()) {
        Swal.fire(error, mensajes.error_estacion_usuario, error_swal);
        this.formularioEstacionValido = false;
        return;
      }
    }
    if (this.usuario.id == 0) {
      Swal.fire(error, mensajes.error_usuario, error_swal);
      this.formularioEstacionValido = false;
      return;
    }
  }

  validarFormulario(){
    if (this.usuario.id == 0) {
      Swal.fire(error, mensajes.error_usuario, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.usuario.nombre == valores.vacio) {
      Swal.fire(error, mensajes.error_usuario, error_swal);
      return;
    }
    if (this.estacionesUsuarios.length == 0) {
      Swal.fire(error, mensajes.error_usuario, error_swal);
      this.formularioValido = false;
      return;
    }
    // Falta validar si hay cambios en estacionUsuario
  }
}
