import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { valores, mensajes, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { Parametro } from '../../../modelos/configuracion/parametro';
import { ParametroService } from '../../../servicios/configuracion/parametro.service';
import { Sesion } from '../../../modelos/acceso/sesion';
import { SesionService } from '../../../servicios/acceso/sesion.service';
import { md5 } from '../../../servicios/administracion/md5.service';

import { Usuario } from '../../../modelos/acceso/usuario';
import { UsuarioService } from '../../../servicios/acceso/usuario.service';
import { Empresa } from '../../../modelos/acceso/empresa';
import { EmpresaService } from '../../../servicios/acceso/empresa.service';
import { Estacion } from '../../../modelos/acceso/estacion';


@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {

  imagenes = environment.imagenes;
  avatares = valores.avatares;

  minContrasena: number = 8;
  ip: string;
  contrasena: string = valores.vacio;

  ocultarContrasena: boolean = true;
  ocultarNuevaContrasena: boolean = true;
  ocultarConfirmarContrasena: boolean = true;
  cambiarContrasena: boolean = false;
  multiEmpresa: boolean = false;

  sesion = new Sesion();
  usuario: Usuario = new Usuario();
  empresa: Empresa = new Empresa();
  estacion: Estacion = new Estacion();

  empresas: Empresa[] = [];

  urlLogo: string = valores.vacio;
  urlEmpresa: string = valores.vacio;
  urlIcoempresa: string = "./assets/icons/icoempresa.png";
  urlIcousuario: string = "./assets/icons/icousuario.png";
  urlIcocontrasenia: string = "./assets/icons/icocontrasenia.png";

  formGroupContrasena = new FormGroup(
    {
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(this.minContrasena)]),
      confirmPassword: new UntypedFormControl('', [Validators.required])
    },
    [this.MatchValidator('password', 'confirmPassword')]
  );

  constructor(private parametroService: ParametroService, private sesionService: SesionService, private usuarioService: UsuarioService, 
    private empresaService: EmpresaService, private router: Router, public dialog: MatDialog, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.spinnerService.show();
    this.obtenerLogo();
    this.consultarEmpresas();
    this.obtenerEstacion();
    this.spinnerService.hide();
  }

  obtenerLogo() {
    let tipo = "LOGO";
    this.parametroService.obtenerPorTipo(tipo).subscribe({
      next: res => {
        let parametro = res.resultado as Parametro;
        this.urlLogo = environment.imagenes + valores.logos + parametro.nombre;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarEmpresas(){
    this.empresaService.consultar().subscribe({
      next: res => {
        this.empresas = res.resultado as Empresa[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }
  obtenerEstacion(){
    // Aqui el codigo para obtener la estación segun la IP y nombre del PC
    // sesion.estacion = estacion obtenida
  }

  nuevo(){
    this.contrasena = valores.vacio;
    this.ocultarContrasena = true;
    this.ocultarNuevaContrasena = true;
    this.ocultarConfirmarContrasena = true;
    this.cambiarContrasena = false;
    this.multiEmpresa = false;
  
    this.sesion = new Sesion();
    this.usuario = new Usuario();
    this.empresa = new Empresa();
    this.estacion = new Estacion();
  }

  iniciarSesion() {
    if (this.contrasena != valores.vacio && this.sesion.usuario.contrasena == md5(this.contrasena)){
      this.sesionService.crear(this.sesion).subscribe({
        next: res => {
          this.sesion = res.resultado as Sesion;
          this.sesionService.setSesion(this.sesion);
          Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
          this.navegarExito();
        },
        error: err => {
          Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
          this.navegarError();
        }
      });
    } else {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_contrasena });
    }  
  }

  obtenerPorApodo() {
    this.spinnerService.show();
    this.usuarioService.obtenerPorApodoYEstado(this.sesion.usuario.apodo, valores.estadoActivo).subscribe({
      next: res => {
        this.sesion.usuario = res.resultado as Usuario;
        this.usuario = this.sesion.usuario;
        this.multiEmpresa = this.sesion.usuario.perfil.multiempresa == valores.si? true: false;
        if (this.sesion.usuario.cambiarContrasena == valores.si) {
          this.cambiarContrasena = true;
        }
        this.spinnerService.hide();
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
        this.spinnerService.hide();
      }
    });
  }

  crearNuevaContrasena(){
    if (this.contrasena != valores.vacio && this.sesion.usuario.contrasena==md5(this.contrasena)){
      this.usuario.contrasena = md5(this.formGroupContrasena.get('password').value);
      this.usuario.confirmarContrasena = md5(this.formGroupContrasena.get('confirmPassword').value);
      this.usuario.cambiarContrasena = valores.no;
      this.usuarioService.actualizar(this.usuario).subscribe({
        next: res => {
          Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
          this.nuevo();
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    } else {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_contrasena });
    }  
  }

  navegarExito() {
    this.router.navigateByUrl('/main');
  }
  navegarError() {
    this.router.navigateByUrl('/index');
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

  openDialog(): void {
    const dialogRef = this.dialog.open(CambioCredencialesComponent, {
      width: '50%',
      data: this.sesion.usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      this.sesion.usuario = result;
    });
  }
  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }
}

@Component({
  selector: 'cambio-credenciales',
  templateUrl: 'cambio-credenciales.component.html',
})
export class CambioCredencialesComponent {

  sesion = new Sesion();
  repetir_contrasena: string;

  constructor(
    public dialogRef: MatDialogRef<CambioCredencialesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}