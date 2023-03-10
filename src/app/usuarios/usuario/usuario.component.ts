import { Component, OnInit, ElementRef, Renderer2  } from '@angular/core';
import { valores, mensajes, preguntas, imagenes, validarSesion, exito_swal, error_swal, exito, error } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { ImagenService } from '../../servicios/administracion/imagen.service'
import { md5 } from '../../servicios/administracion/md5.service';

import { Usuario } from '../../modelos/usuario/usuario';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Perfil } from '../../modelos/usuario/perfil';
import { PerfilService } from '../../servicios/usuario/perfil.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Estacion } from 'src/app/modelos/usuario/estacion';
import { EstacionService } from 'src/app/servicios/usuario/estacion.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})

export class UsuarioComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  ocultarContrasena: boolean = true;
  ocultarContrasena2: boolean = true;
  cambiarContrasena: boolean = true;

  sesion: Sesion = null;
  usuario: Usuario = new Usuario();

  usuarios: Usuario[];
  perfiles: Perfil[] = [];
  estaciones: Estacion[] = [];
  preguntas: any[] = preguntas;

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Usuario) => `${row.codigo}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificación', celda: (row: Usuario) => `${row.identificacion}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Usuario) => `${row.nombre}` },
    { nombreColumna: 'apodo', cabecera: 'Usuario', celda: (row: Usuario) => `${row.apodo}` },
    { nombreColumna: 'perfil', cabecera: 'Perfil', celda: (row: Usuario) => `${row.perfil.descripcion}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Usuario) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Usuario>;
  clickedRows = new Set<Usuario>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private usuarioService: UsuarioService, private perfilService: PerfilService, private estacionService: EstacionService, 
            private imagenService: ImagenService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.usuario.avatar64 = imagenes.avatar_usuario;
    this.consultar();
    this.consultarPerfiles();
    this.consultarEstaciones();
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
    this.usuarioService.consultar().subscribe({
      next: res => {
        this.usuarios = res.resultado as Usuario[]
        this.llenarTabla(this.usuarios);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
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

  consultarPerfiles() {
    this.perfilService.consultarActivos().subscribe({
      next: res => {
        this.perfiles = res.resultado as Perfil[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarEstaciones() {
    this.estacionService.consultarActivos().subscribe({
      next: res => {
        this.estaciones = res.resultado as Estacion[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
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

  capturarFile(event: any): any {
    const archivoCapturado = event.target.files[0];
    this.imagenService.convertirBase64(archivoCapturado).then((imagen: any) => {
      this.usuario.avatar64 = imagen.base64;
    });
  }

  encriptarContrasena(){
    this.usuario.contrasena = md5(this.usuario.contrasena);
    this.usuario.confirmarContrasena = md5(this.usuario.confirmarContrasena);
  }

  // VALIDACIONES
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
    let arroba = this.usuario.correo.includes("@");
    if (!arroba) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_invalido });
    }
  }

  validarFormulario(): boolean {
    //validar que los campos esten llenos antes de guardar
    if (this.usuario.identificacion == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.usuario.nombre == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.usuario.correo == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_correo });
      return false;
    }
    if (this.usuario.perfil.descripcion == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.usuario.estacion.descripcion == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.usuario.pregunta == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.usuario.respuesta == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.usuario.avatar64 == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_imagen });
      return false;
    }
    return true;
  }


}
