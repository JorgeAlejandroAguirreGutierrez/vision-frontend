import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import {UntypedFormControl, Validators} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { valores, mensajes, validarSesion, exito_swal, error_swal, exito, error } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { TabService } from '../../componentes/services/tab.service';

import { Usuario } from '../../modelos/usuario/usuario';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Perfil } from '../../modelos/usuario/perfil';
import { PerfilService } from '../../servicios/usuario/perfil-service.service';
import { PuntoVenta } from '../../modelos/usuario/punto-venta';
import { PuntoVentaService } from '../../servicios/usuario/punto-venta.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})

export class UsuarioComponent implements OnInit {

  sesion: Sesion = null;

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;
  contrasena2: string = valores.vacio;

  abrirPanelNuevoUsuario: boolean = true;
  abrirPanelAdminUsuario: boolean = false;
  editarUsuario: boolean = true;
  hide: boolean = true;

  usuario: Usuario = new Usuario();
  usuarios: Usuario[];
  perfiles: Perfil[]=[];
  puntosVentas: PuntoVenta[]=[];

  email = new UntypedFormControl('', [Validators.required, Validators.email]);

  columnasUsuario: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Usuario) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Usuario) => `${row.codigo}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificación', celda: (row: Usuario) => `${row.identificacion}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Usuario) => `${row.nombre}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Usuario) => `${row.activo}` }
  ];
  cabeceraUsuario: string[] = this.columnasUsuario.map(titulo => titulo.nombreColumna);
  dataSourceUsuario: MatTableDataSource<Usuario>;
  observableDSUsuario: BehaviorSubject<MatTableDataSource<Usuario>> = new BehaviorSubject<MatTableDataSource<Usuario>>(null);
  clickedRows = new Set<Usuario>();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroUsuario") inputFiltroUsuario: ElementRef;

  constructor(private renderer: Renderer2, private tabService: TabService,private usuarioService: UsuarioService, 
    private perfilService: PerfilService, private puntoVentaService: PuntoVentaService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarUsuarios();
    this.consultarPerfiles();
    this.consultarPuntosVentas();
    //this.construirUsuario();
    
  }

  limpiar() {
    this.usuario = new Usuario();
    this.editarUsuario = true;
    this.clickedRows.clear();
    this.borrarFiltroUsuario();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.usuarioService.crear(this.usuario).subscribe({
      next: res => {
        this.usuario = res.resultado as Usuario;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.usuarios.push(this.usuario);
        this.llenarTablaUsuario(this.usuarios);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarUsuario = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.usuarioService.actualizar(this.usuario).subscribe({
      next: res => {
        this.usuario = res.resultado as Usuario;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.usuarioService.eliminarPersonalizado(this.usuario).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarUsuarios() {
    this.usuarioService.consultar().subscribe({
      next: res => {
        this.usuarios = res.resultado as Usuario[]
        this.llenarTablaUsuario(this.usuarios);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaUsuario(usuarios: Usuario[]) {
    this.ordenarAsc(usuarios, 'id');
    this.dataSourceUsuario = new MatTableDataSource(usuarios);
    this.dataSourceUsuario.paginator = this.paginator;
    this.dataSourceUsuario.sort = this.sort;
    this.observableDSUsuario.next(this.dataSourceUsuario);
  }

  seleccion(usuario: Usuario) {
    if (!this.clickedRows.has(usuario)) {
      this.clickedRows.clear();
      this.clickedRows.add(usuario);
      this.usuario = usuario;
      this.editarUsuario = false;
    } else {
      this.limpiar();
    }
  }

  filtroUsuario(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUsuario.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceUsuario.paginator) {
      this.dataSourceUsuario.paginator.firstPage();
    }
  }
  borrarFiltroUsuario() {
    this.renderer.setProperty(this.inputFiltroUsuario.nativeElement, 'value', '');
    this.dataSourceUsuario.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  async construirUsuario() {
    let usuarioId=0;
    this.usuarioService.currentMessage.subscribe(message => usuarioId = message);
    if (usuarioId!= 0) {
      await this.usuarioService.obtenerAsync(usuarioId).then(
        res => {
          Object.assign(this.usuario, res.resultado as Usuario);
          this.usuarioService.enviar(0);
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }

  consultarPerfiles(){
    this.perfilService.consultar().subscribe(
      res => {
        //Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.perfiles=res.resultado as Perfil[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarPuntosVentas(){
    this.puntoVentaService.consultar().subscribe(
      res => {
        //Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.puntosVentas=res.resultado as PuntoVenta[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Ingrese un valor';
    }
    return this.email.hasError('email') ? 'Correo no válido' : '';
  }

  validarCelular() {
    let digito = this.usuario.celular.substr(0, 2);
    if (this.usuario.celular.length != 12 || digito != "09") {
      this.usuario.celular = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_invalido });
    }
  }
}
