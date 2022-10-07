import { Component, HostListener, OnInit } from '@angular/core';
import { EstablecimientoService } from '../../servicios/usuario/establecimiento.service';
import { Establecimiento } from '../../modelos/usuario/establecimiento';
import Swal from 'sweetalert2';
import { TabService } from '../../componentes/services/tab.service';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { Empresa } from '../../modelos/configuracion/empresa';
import { EmpresaService } from '../../servicios/configuracion/empresa.service';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
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
    this.sesion=validarSesion(this.sesionService, this.router);
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
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.empresas=res.resultado as Empresa[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
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
