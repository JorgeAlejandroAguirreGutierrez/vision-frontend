import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { Empresa } from '../../modelos/empresa';
import { Parametro } from '../../modelos/parametro';
import { EmpresaService } from '../../servicios/empresa.service';
import { ParametroService } from '../../servicios/parametro.service';
import { environment } from '../../../environments/environment';
import * as constantes from '../../constantes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  usuario: string;
  clave: string;
}

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {

  usuario: string="";
  clave: string="";

  sesion = new Sesion();

  empresa= new Empresa();
  empresas: Empresa[]=[];

  urlLogo: string ="";
  urlEmpresa: string="";
  urlIcoempresa: string = environment.prefijo_url_imagenes+"iconos/icoempresa.png";
  urlIcousuario: string = environment.prefijo_url_imagenes+"iconos/icousuario.png";
  urlIcocontrasenia: string = environment.prefijo_url_imagenes+"iconos/icocontrasenia.png";

  constructor(private sesionService: SesionService, private empresaService: EmpresaService, 
    private parametroService: ParametroService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerEmpresa();
    this.obtenerParametro();
    this.consultarEmpresas();
  }

  iniciarSesion() {
    this.sesionService.obtenerIP().subscribe(
      res => {
        this.sesion.sesionIp=res;
        this.sesionService.crear(this.sesion).subscribe(
          res => {
            this.sesion=res.resultado as Sesion;
            this.sesionService.setSesion(this.sesion);
            Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
          },
          error => Swal.fire(constantes.error, error.error.mensaje, constantes.error_swal),
          () => this.navigate()
        );
      },
      error => Swal.fire(constantes.error, error.error.mensaje, constantes.error_swal),
    );
  }

  navigate() {
    this.router.navigateByUrl('/main');
  }

  activarSesion() {
    
  }

  consultarEmpresas() {
    this.empresaService.consultar().subscribe(
      res => {
        this.empresas = res.resultado as Empresa[]
      },
      error => Swal.fire(constantes.error, error.error.mensaje, constantes.error_swal)
    );
  }

  obtenerEmpresa(){
    let empresa=new Empresa();
    empresa.id=1;
    this.empresaService.obtener(empresa).subscribe(
      res => {
        empresa= res.resultado as Empresa
        this.urlEmpresa=environment.prefijo_url_imagenes+"logos/"+empresa.logo;
      },
      error => Swal.fire(constantes.error, error.error.mensaje, constantes.error_swal)
    );
  }

  obtenerParametro(){
    let parametro=new Parametro();
    parametro.tipo='LOGO';
    this.parametroService.obtenerTipo(parametro).subscribe(
      res => {
        parametro= res.resultado as Parametro;
        this.urlLogo=environment.prefijo_url_imagenes+parametro.nombre;
      },
      error => Swal.fire(constantes.error, error.error.mensaje, constantes.error_swal)
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CambioCredencialesComponent, {
      width: '50%',
      data: {usuario: this.usuario, clave: this.clave}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El dialogo para cambio de contraseña fue cerrado');
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}