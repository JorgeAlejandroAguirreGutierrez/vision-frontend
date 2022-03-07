import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/sesion';
import { SesionService } from '../../../servicios/sesion.service';
import Swal from 'sweetalert2';
import { TabService } from "../../../componentes/services/tab.service";
import { EstablecimientoComponent } from '../establecimiento.component';
import { EstablecimientoService } from '../../../servicios/establecimiento.service';
import { Establecimiento } from '../../../modelos/establecimiento';
import * as constantes from '../../../constantes';



@Component({
  selector: 'app-establecimiento-leer',
  templateUrl: './establecimiento-leer.component.html',
  styleUrls: ['./establecimiento-leer.component.scss']
})
export class EstablecimientoMostrarComponent implements OnInit {

  collapsed = true;
  ComponenteEstablecimiento: Type<any> = EstablecimientoComponent;

  sesion: Sesion;

  constructor(private establecimientoService: EstablecimientoService, private tabService: TabService,
    private sesionService: SesionService, private router: Router) { }

  establecimientos: Establecimiento[];
  establecimiento: Establecimiento;
  establecimientoBuscar: Establecimiento = new Establecimiento();


  ngOnInit() {
    this.consultar();
    this.sesion = this.sesionService.getSesion();
  }

  consultar() {
    this.establecimientoService.consultar().subscribe(
      res => {
        this.establecimientos = res.resultado as Establecimiento[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event: any) {
    if (event != null)
      event.preventDefault();
    this.establecimientoService.buscar(this.establecimientoBuscar).subscribe(
      res => {
        this.establecimientos = res.resultado as Establecimiento[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccion(establecimiento: Establecimiento) {
    this.establecimiento = establecimiento;
  }

  nuevo(event: any) {
    if (event != null)
      event.preventDefault();
  }

  actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    if (this.establecimiento != null) {
      this.establecimientoService.enviar(this.establecimiento.id);
      this.tabService.addNewTab(this.ComponenteEstablecimiento, 'Actualizar Genero');
    } else {
      Swal.fire(constantes.error, "Selecciona un Estado Civil", constantes.error_swal);
    }
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.establecimientoService.eliminar(this.establecimiento).subscribe(
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

  cambiarBuscarDireccion() {
    this.buscar(null);
  }

}
