import { Component, HostListener, OnInit } from '@angular/core';
import { EstablecimientoService } from '../../servicios/establecimiento.service';
import { Establecimiento } from '../../modelos/establecimiento';
import Swal from 'sweetalert2';
import { TabService } from '../../componentes/services/tab.service';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { Empresa } from '../../modelos/empresa';
import { EmpresaService } from '../../servicios/empresa.service';
import { Sesion } from 'src/app/modelos/sesion';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-establecimiento',
  templateUrl: './establecimiento.component.html',
  styleUrls: ['./establecimiento.component.scss']
})
export class EstablecimientoComponent implements OnInit {

  establecimiento= new Establecimiento();
  empresas: Empresa[]=[];
  sesion: Sesion;

  constructor(private tabService: TabService,private establecimientoService: EstablecimientoService, private empresaService: EmpresaService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.construirEstablecimiento();
    this.consultarEmpresas();
  }

  nuevo(event: any) {
    if (event!=null)
      event.preventDefault();
    this.establecimiento = new Establecimiento();
  }

  consultarEmpresas(){
    this.empresaService.consultar().subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.empresas=res.resultado as Empresa[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    this.establecimientoService.crear(this.establecimiento).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.establecimientoService.actualizar(this.establecimiento).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.establecimiento=res.resultado as Establecimiento;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  async construirEstablecimiento() {
    let establecimientoId=0;
    this.establecimientoService.currentMessage.subscribe(message => establecimientoId = message);
    if (establecimientoId!= 0) {
      await this.establecimientoService.obtenerAsync(establecimientoId).then(
        res => {
          Object.assign(this.establecimiento, res.resultado as Establecimiento);
          this.establecimientoService.enviar(0);
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 71) //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 78) //ASHIFT + N
      this.nuevo(null);
  }

}
