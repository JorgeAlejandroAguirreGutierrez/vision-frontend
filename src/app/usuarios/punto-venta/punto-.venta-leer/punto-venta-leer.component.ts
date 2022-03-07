import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/sesion';
import { SesionService } from '../../../servicios/sesion.service';
import Swal from 'sweetalert2';
import { TabService } from "../../../componentes/services/tab.service";
import { PuntoVenta } from '../../../modelos/punto-venta';
import { PuntoVentaService } from '../../../servicios/punto-venta.service';
import { PuntoVentaComponent } from '../punto-venta.component';
import * as constantes from '../../../constantes';



@Component({
  selector: 'app-punto-venta-leer',
  templateUrl: './punto-venta-leer.component.html',
  styleUrls: ['./punto-venta-leer.component.scss']
})
export class PuntoVentaLeerComponent implements OnInit {

  collapsed = true;
  ComponentePuntoVenta: Type<any> = PuntoVentaComponent;

  sesion: Sesion;

  constructor(private puntoVentaService: PuntoVentaService, private tabService: TabService,
    private sesionService: SesionService, private router: Router) { }

  puntosVentas: PuntoVenta[];
  puntoVenta: PuntoVenta;
  puntoVentaBuscar: PuntoVenta = new PuntoVenta();


  ngOnInit() {
    this.consultar();
    this.sesion = this.sesionService.getSesion();
  }

  consultar() {
    this.puntoVentaService.consultar().subscribe(
      res => {
        this.puntosVentas = res.resultado as PuntoVenta[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event: any) {
    if (event != null)
      event.preventDefault();
    this.puntoVentaService.buscar(this.puntoVentaBuscar).subscribe(
      res => {
        this.puntosVentas = res.resultado as PuntoVenta[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccion(puntoVenta: PuntoVenta) {
    this.puntoVenta = puntoVenta;
  }

  nuevo(event : any) {
    if (event != null)
      event.preventDefault();
  }

  actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    if (this.puntoVenta != null) {
      this.puntoVentaService.enviar(this.puntoVenta.id);
      this.tabService.addNewTab(this.ComponentePuntoVenta, 'Actualizar Punto Venta');
    } else {
      Swal.fire(constantes.error, "Selecciona un Punto de Venta", constantes.error_swal);
    }
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.puntoVentaService.eliminar(this.puntoVenta).subscribe(
      res => {
          Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
          this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  cambiarBuscarCodigo() {
    this.buscar(null);
  }

  cambiarBuscarDescripcion() {
    this.buscar(null);
  }

  cambiarBuscarAbreviatura() {
    this.buscar(null);
  }

}
