import { Component, OnInit, ElementRef, Renderer2  } from '@angular/core';
import { valores, mensajes, preguntas, validarSesion, exito_swal, error_swal, exito, error } from '../../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { ImagenService } from '../../../servicios/administracion/imagen.service'
import { md5 } from '../../../servicios/administracion/md5.service';

import { Usuario } from '../../../modelos/usuario/usuario';
import { UsuarioService } from '../../../servicios/usuario/usuario.service';
import { Perfil } from '../../../modelos/usuario/perfil';
import { PerfilService } from '../../../servicios/usuario/perfil.service';
import { FacturaService } from '../../../servicios/venta/factura.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { EmpresaService } from '../../../servicios/usuario/empresa.service';
import { Establecimiento } from '../../../modelos/usuario/establecimiento';
import { EstablecimientoService } from '../../../servicios/usuario/establecimiento.service';
import { Estacion } from '../../../modelos/usuario/estacion';
import { EstacionService } from '../../../servicios/usuario/estacion.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})

export class UsuarioComponent implements OnInit {

  imagenes = environment.imagenes;
  avatares = valores.avatares;

  activo: string = valores.estadoActivo;
  inactivo: string = valores.estadoInactivo;
  contrasenaEncriptada: string = valores.vacio;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  ocultarContrasena: boolean = true;
  ocultarContrasena2: boolean = true;
  cambiarContrasena: boolean = true;
  perfilAdministrador: boolean = false;

  sesion: Sesion = null;
  usuario: Usuario = new Usuario();
  empresa: Empresa = new Empresa();

  usuarios: Usuario[];
  perfiles: Perfil[] = [];
  empresas: Empresa[] = [];
  establecimientos: Establecimiento[] = [];
  estaciones: Estacion[] = [];
  preguntas: any[] = preguntas;

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Usuario) => `${row.codigo}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificación', celda: (row: Usuario) => `${row.identificacion}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Usuario) => `${row.nombre}` },
    { nombreColumna: 'apodo', cabecera: 'Usuario', celda: (row: Usuario) => `${row.apodo}` },
    { nombreColumna: 'perfil', cabecera: 'Perfil', celda: (row: Usuario) => `${row.perfil.descripcion}` },
    { nombreColumna: 'establecimiento', cabecera: 'Establ', celda: (row: Usuario) => `${row.estacion.establecimiento.codigoSRI}` },
    { nombreColumna: 'estacion', cabecera: 'Pto Vta', celda: (row: Usuario) => `${row.estacion.codigoSRI}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Usuario) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Usuario>;
  clickedRows = new Set<Usuario>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private usuarioService: UsuarioService, private perfilService: PerfilService, private empresaService: EmpresaService, 
      private establecimientoService: EstablecimientoService, private estacionService: EstacionService, 
      private imagenService: ImagenService, private sesionService: SesionService, private router: Router, private facturaService: FacturaService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.validarPerfil();
    this.consultar();
    this.consultarPerfiles();
    this.consultarEmpresas();
  }

  consultarPerfiles() {
    this.perfilService.consultarPorEstado(valores.estadoActivo).subscribe({
      next: res => {
        this.perfiles = res.resultado as Perfil[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
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
  consultarEstablecimientos() {
    this.establecimientoService.consultarPorEmpresa(this.usuario.estacion.establecimiento.empresa.id).subscribe({
      next: res => {
        this.establecimientos = res.resultado as Establecimiento[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarEstaciones() {
    this.estacionService.consultarEstacionesPorEstablecimiento(this.usuario.estacion.establecimiento.id).subscribe({
      next: res => {
        this.estaciones = res.resultado as Estacion[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.usuario = new Usuario();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;    
    this.encriptarContrasena();
    this.usuarioService.crear(this.usuario).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    if (this.contrasenaEncriptada != this.usuario.contrasena){
      this.encriptarContrasena();
    }
    this.usuarioService.actualizar(this.usuario).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.usuarioService.activar(this.usuario).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.usuarioService.inactivar(this.usuario).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    if (this.perfilAdministrador){
      this.usuarioService.consultar().subscribe({
        next: res => {
          this.usuarios = res.resultado as Usuario[]
          this.llenarTabla(this.usuarios);
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    }else{
      this.usuarioService.consultarPorEmpresa(this.empresa.id).subscribe({
        next: res => {
          this.usuarios = res.resultado as Usuario[]
          this.llenarTabla(this.usuarios);
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    }
  }

  llenarTabla(usuarios: Usuario[]){
    this.dataSource = new MatTableDataSource(usuarios);
    this.dataSource.filterPredicate = (data: Usuario, filter: string): boolean =>
    data.codigo.includes(filter) || data.identificacion.includes(filter) || data.nombre.includes(filter) || 
    data.apodo.includes(filter) || data.perfil.descripcion.includes(filter) || data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(usuario: Usuario) {
    if (!this.clickedRows.has(usuario)){
      this.clickedRows.clear();
      this.clickedRows.add(usuario);
      this.usuario = { ... usuario};
      this.cambiarContrasena = this.usuario.cambiarContrasena == valores.si? true : false;
      this.contrasenaEncriptada = this.usuario.contrasena;
      this.consultarEstablecimientos();
      this.consultarEstaciones();
    } else {
      this.nuevo(null);
    }
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

  alternarCambiarContrasena(){
    this.cambiarContrasena = !this.cambiarContrasena;
    if (this.cambiarContrasena){
      this.usuario.cambiarContrasena = valores.si;
    } else {
      this.usuario.cambiarContrasena = valores.no;
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  encriptarContrasena(){
    this.usuario.contrasena = md5(this.usuario.contrasena);
    this.usuario.confirmarContrasena = md5(this.usuario.confirmarContrasena);
  }

  // VALIDACIONES
  validarIdentificacion(identificacion: string) {
    this.facturaService.validarIdentificacion(identificacion).subscribe({
      next: res => {
        if (res.resultado != '') {
            this.usuario.nombre = res.resultado;
        } 
      },
      error: err => {
        Swal.fire(error, err.error.mensaje, error_swal);
        this.usuario.identificacion = valores.vacio;
        this.usuario.nombre = valores.vacio;
      }
    });
  }

  validarContrasena(){
    if (this.usuario.contrasena != this.usuario.confirmarContrasena) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_contrasena_invalida });
    }
  }

  validarTelefono() {
    let digito = this.usuario.telefono.substring(0, 1);
    if (this.usuario.telefono.length != 11 || digito != "0") {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_invalido });
    }
  }

  validarCelular() {
    let digito = this.usuario.celular.substring(0, 2);
    if (this.usuario.celular.length != 12 || digito != "09") {
      this.usuario.celular = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_invalido });
    }
  }

  validarCorreo() {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    let validacion = expression.test(this.usuario.correo);
    if (!validacion) {
      this.usuario.correo = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_invalido });
    }
  }

  // VALIDACIONES
  validarPerfil() {
    if (this.sesion.usuario.perfil.abreviatura == 'ADM'){
      this.perfilAdministrador = true;
    }
  }

  validarFormulario(): boolean {
    //validar que los campos esten llenos antes de guardar
    if (this.usuario.identificacion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.usuario.nombre == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.usuario.correo == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_correo });
      return false;
    }
    if (this.usuario.perfil.descripcion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.usuario.estacion.descripcion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.usuario.pregunta == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.usuario.respuesta == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }
  
}
