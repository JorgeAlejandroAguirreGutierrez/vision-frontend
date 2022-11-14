import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Parametro } from '../../modelos/configuracion/parametro';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Usuario } from '../../modelos/usuario/usuario';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Empresa } from '../../modelos/usuario/empresa';
import { EmpresaService } from '../../servicios/usuario/empresa.service';
import { ParametroService } from '../../servicios/configuracion/parametro.service';
import { valores, exito, exito_swal, error, error_swal } from '../../constantes';
import { environment } from '../../../environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {

  minContrasena = 8;

  ocultarContrasena: boolean = true;
  ocultarNuevaContrasena: boolean = true;
  ocultarConfirmarContrasena: boolean = true;
  cambiarContrasena: boolean = false;
  multiEmpresa: boolean = false;

  sesion = new Sesion();

  usuario = new Usuario();
  empresa = new Empresa();
  empresas: Empresa[] = [];

  urlLogo: string = "";
  urlEmpresa: string = "";
  urlIcoempresa: string = environment.prefijoUrlImagenes + "iconos/icoempresa.png";
  urlIcousuario: string = environment.prefijoUrlImagenes + "iconos/icousuario.png";
  urlIcocontrasenia: string = environment.prefijoUrlImagenes + "iconos/icocontrasenia.png";

  formGroupContrasena = new FormGroup(
    {
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(this.minContrasena)]),
      confirmPassword: new UntypedFormControl('', [Validators.required])
    },
    [ this.MatchValidator('password', 'confirmPassword') ]
  );

  constructor(private sesionService: SesionService, private usuarioService: UsuarioService, private empresaService: EmpresaService,
    private parametroService: ParametroService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerEmpresa();
    this.obtenerParametro();
    this.consultarEmpresas();
  }

  iniciarSesion() {
    this.sesionService.obtenerIP().subscribe({
      next: res => {
        this.sesion.sesionIp = res;
        this.sesionService.crear(this.sesion).subscribe(
          res => {
            this.sesion = res.resultado as Sesion;
            this.sesionService.setSesion(this.sesion);
            Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
            this.navegarExito();
          },
          err => {
            Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
            this.navegarError();
          }
        );
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  navegarExito() {
    this.router.navigateByUrl('/main');
  }
  navegarError() {
    this.router.navigateByUrl('/index');
  }

  activarSesion() {

  }

  consultarEmpresas() {
    this.empresaService.consultar().subscribe(
      res => {
        this.empresas = res.resultado as Empresa[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  obtenerEmpresa() {
    let empresaId = 1;
    this.empresaService.obtener(empresaId).subscribe({
      next: res => {
        let empresa = res.resultado as Empresa
        this.urlEmpresa = environment.prefijoUrlImagenes + "logos/" + empresa.logo;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  obtenerParametro() {
    let parametro = new Parametro();
    parametro.tipo = 'LOGO';
    this.parametroService.obtenerTipo(parametro).subscribe(
      res => {
        parametro = res.resultado as Parametro;
        this.urlLogo = environment.prefijoUrlImagenes + parametro.nombre;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  buscarUsuario() {
    //Pasar el apodo
    this.usuarioService.buscar(this.sesion.usuario).subscribe({
      next: res => {
        this.usuario = res.resultado as Usuario
        if (this.usuario.cambiarContrasena == valores.si) {
          this.cambiarContrasena = true;
        } else {
          if (this.usuario.perfil.multiempresa == valores.si) {
            this.multiEmpresa = true;
            this.obtenerEmpresa(); //Obtener empresas de la tabla Estacion_Usuario y mostrar en el combo
          } else {
            this.multiEmpresa = false;
            // Obtener empresa desde la estacion que estoy iniciando sesion
          }
        }
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  // PARA VALIDACION DE CONFIRMACIÓN DE CONTRASEÑA
  MatchValidator(source: string, target: string): ValidatorFn {
    //console.log(source);
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
      data: this.usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      this.usuario = result;
    });
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