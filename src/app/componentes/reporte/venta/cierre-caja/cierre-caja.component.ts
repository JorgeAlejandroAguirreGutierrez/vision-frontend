import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../../../constantes';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { Empresa } from 'src/app/modelos/usuario/empresa';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReporteCajaService } from 'src/app/servicios/reporte/reporte-caja.service';
import { ReporteCaja } from 'src/app/modelos/reporte/reporte-caja';

@Component({
  selector: 'app-cierre-caja',
  templateUrl: './cierre-caja.component.html',
  styleUrls: ['./cierre-caja.component.scss']
})
export class CierreCajaComponent implements OnInit {

  reporteCaja = new ReporteCaja();
  sesion: Sesion = null;
  empresa: Empresa = null;
  fechaInicio: string = null;
  fechaFinal: string = null;
  billete100: number = valores.cero;
  billete50: number = valores.cero;
  billete20: number = valores.cero;
  billete10: number = valores.cero;
  billete5: number = valores.cero;
  billete2: number = valores.cero;
  billete1: number = valores.cero;
  moneda1: number = valores.cero;
  moneda050: number = valores.cero;
  moneda025: number = valores.cero;
  moneda010: number = valores.cero;
  moneda005: number = valores.cero;
  moneda001: number = valores.cero;


  hoy = new Date();
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(private reporteCajaService: ReporteCajaService, private sesionService: SesionService, private datepipe: DatePipe, private router: Router, 
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
    this.reporteCajaService.obtener(this.sesion.usuario.apodo, this.fechaInicio, this.fechaFinal, this.empresa.id,
      this.billete100, this.billete50, this.billete20, this.billete10, this.billete5, this.billete2, this.billete1,
      this.moneda1, this.moneda050, this.moneda025, this.moneda010, this.moneda005, this.moneda001).subscribe({
      next: res => {
        this.reporteCaja = res.resultado as ReporteCaja;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  pdf(event){
    this.fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    this.fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteCajaService.pdf(this.sesion.usuario.apodo, this.fechaInicio, this.fechaFinal, this.empresa.id,
      this.billete100, this.billete50, this.billete20, this.billete10, this.billete5, this.billete2, this.billete1,
      this.moneda1, this.moneda050, this.moneda025, this.moneda010, this.moneda005, this.moneda001);
  }

  excel(event){
    this.fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    this.fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteCajaService.excel(this.sesion.usuario.apodo, this.fechaInicio, this.fechaFinal, this.empresa.id,
      this.billete100, this.billete50, this.billete20, this.billete10, this.billete5, this.billete2, this.billete1,
      this.moneda1, this.moneda050, this.moneda025, this.moneda010, this.moneda005, this.moneda001);
  }
}
