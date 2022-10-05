import { Component, HostListener, OnInit } from '@angular/core';
import { PuntoVentaService } from '../../servicios/usuario/punto-venta.service';
import { PuntoVenta } from '../../modelos/usuario/punto-venta';
import Swal from 'sweetalert2';
import { validarSesion, exito_swal, error_swal, exito, error } from '../../constantes';
import { TabService } from '../../componentes/services/tab.service';
import { Establecimiento } from '../../modelos/usuario/establecimiento';
import { EstablecimientoService } from '../../servicios/usuario/establecimiento.service';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-punto-venta',
  templateUrl: './punto-venta.component.html',
  styleUrls: ['./punto-venta.component.scss']
})
export class PuntoVentaComponent implements OnInit {

  puntoVenta= new PuntoVenta();
  establecimientos: Establecimiento[]=[];
  sesion: Sesion;

  constructor(private tabService: TabService,private puntoVentaService: PuntoVentaService, private establecimientoService: EstablecimientoService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarEstablecimientos();
    this.construirPuntoVenta();
    
  }

  nuevo(event: any) {
    if (event!=null)
      event.preventDefault();
    this.puntoVenta = new PuntoVenta();
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    this.puntoVentaService.crear(this.puntoVenta).subscribe(
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
    this.puntoVentaService.actualizar(this.puntoVenta).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.puntoVenta=res.resultado as PuntoVenta;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  async construirPuntoVenta() {
    let puntoVentaId=0;
    this.puntoVentaService.currentMessage.subscribe(message => puntoVentaId = message);
    if (puntoVentaId!= 0) {
      await this.puntoVentaService.obtenerAsync(puntoVentaId).then(
        res => {
          Object.assign(this.puntoVenta, res.resultado as PuntoVenta);
          this.puntoVentaService.enviar(0);
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }

  consultarEstablecimientos(){
    this.establecimientoService.consultar().subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.establecimientos=res.resultado as Establecimiento[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
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
