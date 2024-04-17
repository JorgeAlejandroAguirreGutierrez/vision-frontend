import { Component, OnInit } from '@angular/core';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../../../constantes';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

import { Sesion } from 'src/app/modelos/acceso/sesion';
import { SesionService } from 'src/app/servicios/acceso/sesion.service';
import { Empresa } from 'src/app/modelos/acceso/empresa';
import { ReporteCaja } from 'src/app/modelos/reporte/reporte-caja';
import { ReporteCajaService } from 'src/app/servicios/reporte/reporte-caja.service';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.scss']
})
export class CajaComponent implements OnInit {

  abrirPanelPeriodo: boolean = true;
  abrirPanelDetalle: boolean = true;
  abrirPanelResumen: boolean = true;

  hoy = new Date();
  fechaInicio: Date = new Date();
  fechaFinal: Date = new Date();

  sesion: Sesion = null;
  empresa: Empresa = null;
  reporteCaja = new ReporteCaja();

  constructor(private reporteCajaService: ReporteCajaService, private sesionService: SesionService, private datepipe: DatePipe, private router: Router) { }

  ngOnInit(): void {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
  }

  obtener(){
    let fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    let fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteCajaService.obtener(this.sesion.usuario.apodo, fechaInicio, fechaFinal, this.empresa.id).subscribe({
      next: res => {
        this.reporteCaja = res.resultado as ReporteCaja;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  pdf(event){
    if (event != null)
      event.preventDefault();
    let fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    let fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteCajaService.pdf(this.sesion.usuario.apodo, fechaInicio, fechaFinal, this.empresa.id);
  }

  excel(event){
    if (event != null)
      event.preventDefault();
    let fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    let fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteCajaService.excel(this.sesion.usuario.apodo, fechaInicio, fechaFinal, this.empresa.id);
  }
}
