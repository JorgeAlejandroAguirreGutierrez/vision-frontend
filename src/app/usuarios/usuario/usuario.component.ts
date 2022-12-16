import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { UntypedFormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormGroup} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { valores, mensajes, preguntas, validarSesion, exito_swal, error_swal, exito, error } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { md5 } from '../../servicios/administracion/md5.service';

import { Usuario } from '../../modelos/usuario/usuario';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Perfil } from '../../modelos/usuario/perfil';
import { PerfilService } from '../../servicios/usuario/perfil.service';

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

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;
  contrasena2: string = valores.vacio;
  minContrasena = 8;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  edicion: boolean = true;
  ocultarContrasena: boolean = true;
  ocultarContrasena2: boolean = true;
  cambiarContrasena: boolean = false;
  formularioValido: boolean = true;

  sesion: Sesion = null;
  usuario: Usuario = new Usuario();

  usuarios: Usuario[];
  perfiles: Perfil[] = [];
  preguntas: any[] = preguntas;

  email = new UntypedFormControl('', [Validators.required, Validators.email]);
  formGroupContrasena = new FormGroup(
    {
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(this.minContrasena)]),
      confirmPassword: new UntypedFormControl('', [Validators.required])
    },
    [ this.MatchValidator('password', 'confirmPassword') ]
  );

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Usuario) => `${row.codigo}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificación', celda: (row: Usuario) => `${row.identificacion}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Usuario) => `${row.nombre}` },
    { nombreColumna: 'perfil', cabecera: 'Perfil', celda: (row: Usuario) => `${row.perfil.descripcion}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Usuario) => `${row.activo}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Usuario>;
  observable: BehaviorSubject<MatTableDataSource<Usuario>> = new BehaviorSubject<MatTableDataSource<Usuario>>(null);
  clickedRows = new Set<Usuario>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private usuarioService: UsuarioService,
    private perfilService: PerfilService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarPerfiles();
  }

  limpiar() {
    this.usuario = new Usuario();
    this.edicion = true;
    this.clickedRows.clear();
    this.borrarFiltro();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.validarFormulario();
    if (!this.formularioValido)
      return;  
    this.obtenerUsuarioControl();
    console.log(this.usuario);  
    this.usuarioService.crear(this.usuario).subscribe({
      next: res => {
        this.usuario = res.resultado as Usuario;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.usuarios.push(this.usuario);
        this.llenarTabla(this.usuarios);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.edicion = true;
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

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.usuarioService.activar(this.usuario).subscribe({
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
    this.usuarioService.inactivar(this.usuario).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
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

  llenarTabla(usuarios: Usuario[]) {
    this.ordenarAsc(usuarios, 'id');
    this.dataSource = new MatTableDataSource(usuarios);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.observable.next(this.dataSource);
  }

  llenarControlUsuario(){
    this.formGroupContrasena.get('password').value == this.usuario.contrasena;
    this.email.setValue(this.usuario.correo);
  }

  obtenerUsuarioControl(){
    this.usuario.contrasena = md5(this.formGroupContrasena.get('password').value)
    this.usuario.correo = this.email.value;
  }

  seleccion(usuario: Usuario) {
    if (!this.clickedRows.has(usuario)) {
      this.clickedRows.clear();
      this.clickedRows.add(usuario);
      this.usuario = usuario;
      this.edicion = false;
    } else {
      this.limpiar();
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

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  consultarPerfiles() {
    this.perfilService.consultar().subscribe({
      next: res => {
        this.perfiles = res.resultado as Perfil[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  cambiarSiNo(){
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

  // PARA VALIDACION DE CONFIRMACIÓN DE CONTRASEÑA
  MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { passwordMismatch: true }
        : null;
    };
  }

  /* Called on each input in either password field */
  onPasswordInput() {
    if (this.formGroupContrasena.hasError('passwordMismatch')) { // puedo pasar un parámetro
      this.formGroupContrasena.get('confirmPassword').setErrors([{ 'passwordMismatch': true }]);
    } else {
      this.formGroupContrasena.get('confirmPassword').setErrors(null);
    }
  }

  mensajeErrorContrasena() {
    if (this.formGroupContrasena.get('password').hasError('required')) {
      return 'Contraseña requerida';
    }
    return 'Mínimo ' + this.minContrasena + ' caracteres';
  }

  mensajeErrorConfirmarContrasena() {
    if (this.formGroupContrasena.get('confirmPassword').hasError('required')) {
      return 'Confirmación requerida';
    }
    if (this.formGroupContrasena.getError('passwordMismatch') && (this.formGroupContrasena.get('confirmPassword')?.touched || this.formGroupContrasena.get('confirmPassword')?.dirty)) {
      return 'Contraña no coincide';
    };
    return 'Error';
  }

  mensajeErrorCorreo() {
    if (this.email.hasError('required')) {
      return 'Correo requerido';
    }
    return this.email.hasError('email') ? 'Correo no válido' : '';
  }

  crearTelefono() {
    if (this.usuario.telefono.length != valores.cero) {
      //this.usuario.telefonos.push(this.telefono);
      //this.telefono = new Telefono();
    } else {
      Swal.fire(error, "Ingrese un número telefónico válido", error_swal);
    }
  }
  validarTelefono() {
    let digito = this.usuario.telefono.substring(0, 1);
    if (this.usuario.telefono.length != 11 || digito != "0") {
      //this.telefono.numero = valores.vacio;
      Swal.fire(error, "Telefono Invalido", error_swal);
    }
  }
  eliminarTelefono(i: number) {
    //this.usuario.telefono.splice(i, 1);
  }

  validarCelular() {
    let digito = this.usuario.celular.substring(0, 2);
    if (this.usuario.celular.length != 12 || digito != "09") {
      this.usuario.celular = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_invalido });
    }
  }

  validarFormulario(){
    this.formularioValido = true;
    if (this.usuario.apodo == '') {
      Swal.fire(error, mensajes.error_usuario, error_swal);
      this.formularioValido = false;
      return;
    } else { // cambiar idetificacion x apodo cuando esté en DB
      if ((this.usuarios.findIndex(usuario => usuario.identificacion.toUpperCase() === this.usuario.apodo.toUpperCase())) > -1){
        Swal.fire(error, mensajes.error_usuario_existe, error_swal);
        this.formularioValido = false;
        return;
      };
    }
    if (this.formGroupContrasena.get('password').value =='' || this.formGroupContrasena.get('password').invalid) {
      Swal.fire(error, mensajes.error_contrasena, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.formGroupContrasena.get('confirmPassword').value =='' || this.formGroupContrasena.get('confirmPassword').invalid) {
      Swal.fire(error, mensajes.error_confirmar_contrasena, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.usuario.identificacion == '') {
      Swal.fire(error, mensajes.error_identificacion, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.usuario.nombre == '') {
      Swal.fire(error, mensajes.error_nombre, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.email.value =='' || this.email.invalid) {
      Swal.fire(error, mensajes.error_correo_invalido, error_swal);
      this.formularioValido = false;
      return;
    }
    if (this.usuario.perfil.id == 0) {
      Swal.fire(error, mensajes.error_perfil, error_swal);
      this.formularioValido = false;
      return;
    }
  }

  capturarFile(event: any): any {
    const archivoCapturado = event.target.files[0];
    //console.log(archivoCapturado);
    this.extrarBase64(archivoCapturado).then((imagen: any) => {
      this.usuario.avatar = imagen.base;
      //console.log(imagen);
    });
  }

  extrarBase64 = async ($event: any) => new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        })
      };
      reader.onerror = error => {
        resolve({
          base: reader.result
        })
      };
    } catch (e) {
      return null;
    }
  });

}
