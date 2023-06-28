import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-reporte-venta',
  templateUrl: './reporte-venta.component.html',
  styleUrls: ['./reporte-venta.component.scss']
})
export class ReporteVentaComponent implements OnInit {

  abrirPanelNuevo: boolean = true;
  verReporteDashboard: boolean = true;
  verReporteFormulario: boolean = false;
  verReporteTablas: boolean = false;
  verReporteTopografia: boolean = false;
  verReporteContacto: boolean = false;
  
  reporteCliente: number = 0;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }


  ngOnInit(): void {
  }

  
  verReporte(nombre: string){
    this.iniciarVistaReporte();
    if (nombre == 'DASHBOARD'){
      this.verReporteDashboard = true;
      return;
    }
    if (nombre == 'FORMULARIO'){
      this.verReporteFormulario = true;
      return;
    }
    if (nombre == 'TOPOGRAFIA'){
      this.verReporteTopografia = true;
      return;
    }
    if (nombre == 'CONTACTO'){
      this.verReporteContacto = true;
      return;
    }
  }

  iniciarVistaReporte(){
    this.verReporteDashboard = false;
    this.verReporteFormulario = false;
    this.verReporteTablas = false;
    this.verReporteTopografia = false;
    this.verReporteContacto = false;
  }

  nuevo(event){}

  crear(event){
  }

  actualizar(event) {
  }
}
