import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ReporteVenta } from 'src/app/modelos/reporte/reporte-venta';
import { ReporteVentaService } from 'src/app/servicios/reporte/reporte-venta.service';
import Swal from 'sweetalert2';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { Empresa } from 'src/app/modelos/usuario/empresa';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reporte-venta',
  templateUrl: './reporte-venta.component.html',
  styleUrls: ['./reporte-venta.component.scss']
})
export class ReporteVentaComponent implements OnInit {

  reporteVenta = new ReporteVenta();
  sesion: Sesion = null;
  empresa: Empresa = null;
  fechaInicio: string = null;
  fechaFinal: string = null;

  hoy = new Date();
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(private reporteVentaService: ReporteVentaService, private sesionService: SesionService, private datepipe: DatePipe, private router: Router, 
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }


  ngOnInit(): void {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
  }

  obtener(){
    this.fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    this.fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteVentaService.obtener(this.sesion.usuario.apodo, this.fechaInicio, this.fechaFinal, this.empresa.id).subscribe({
      next: res => {
        this.reporteVenta = res.resultado as ReporteVenta;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  pdf(event){
    this.fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    this.fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteVentaService.pdf(this.sesion.usuario.apodo, this.fechaInicio, this.fechaFinal, this.empresa.id);
  }

  excel(event){
    this.fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    this.fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteVentaService.excel(this.sesion.usuario.apodo, this.fechaInicio, this.fechaFinal, this.empresa.id);
  }
}
