import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { Empresa } from 'src/app/modelos/usuario/empresa';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReporteKardex } from 'src/app/modelos/reporte/reporte-kardex';
import { ReporteKardexService } from 'src/app/servicios/reporte/reporte-kardex.service';
import { Producto } from 'src/app/modelos/inventario/producto';
import { ProductoService } from 'src/app/servicios/inventario/producto.service';

@Component({
  selector: 'app-reporte-kardex',
  templateUrl: './reporte-kardex.component.html',
  styleUrls: ['./reporte-kardex.component.scss']
})
export class ReporteKardexComponent implements OnInit {

  reporteKardex = new ReporteKardex();
  sesion: Sesion = null;
  empresa: Empresa = null;
  fechaInicio: string = null;
  fechaFinal: string = null;
  productos: Producto[];
  producto : Producto = null;

  hoy = new Date();
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(private reporteKardexService: ReporteKardexService, private productoService: ProductoService, private sesionService: SesionService, private datepipe: DatePipe, private router: Router, 
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
    this.consultarProductos();
  }

  consultarProductos() {
    this.productoService.consultarPorEmpresaYEstado(this.empresa.id, valores.activo).subscribe({
      next: res => {
        this.productos = res.resultado as Producto[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    })
  }

  obtener(){
    this.fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    this.fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteKardexService.obtener(this.sesion.usuario.apodo, this.fechaInicio, this.fechaFinal, this.producto.id).subscribe({
      next: res => {
        this.reporteKardex = res.resultado as ReporteKardex;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  pdf(event){
    this.fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    this.fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteKardexService.pdf(this.sesion.usuario.apodo, this.fechaInicio, this.fechaFinal, this.producto.id);
  }

  excel(event){
    this.fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    this.fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteKardexService.excel(this.sesion.usuario.apodo, this.fechaInicio, this.fechaFinal, this.producto.id);
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }
}
