import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../../../constantes';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

import { Sesion } from 'src/app/modelos/acceso/sesion';
import { SesionService } from 'src/app/servicios/acceso/sesion.service';
import { Empresa } from 'src/app/modelos/acceso/empresa';
import { Producto } from 'src/app/modelos/inventario/producto';
import { ProductoService } from 'src/app/servicios/inventario/producto.service';
import { ReporteKardex } from 'src/app/modelos/reporte/reporte-kardex';
import { ReporteKardexService } from 'src/app/servicios/reporte/reporte-kardex.service';

@Component({
  selector: 'app-kardex-mercaderia',
  templateUrl: './kardex-mercaderia.component.html',
  styleUrls: ['./kardex-mercaderia.component.scss']
})

export class KardexMercaderiaComponent implements OnInit {

  abrirPanelPeriodo: boolean = true;
  abrirPanelDetalle: boolean = true;
  abrirPanelResumen: boolean = true;

  hoy = new Date();
  fechaInicio: Date = new Date();
  fechaFinal: Date = new Date();

  sesion: Sesion = null;
  empresa: Empresa = null;

  producto : Producto = new Producto();
  reporteKardex = new ReporteKardex();

  productos: Producto[];

  constructor(private reporteKardexService: ReporteKardexService, private productoService: ProductoService, private sesionService: SesionService, private datepipe: DatePipe, private router: Router, 
    ) {
  }

  ngOnInit(): void {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.consultarProductos();
  }

  consultarProductos() {
    this.productoService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.productos = res.resultado as Producto[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    })
  }

  obtener(){
    let fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    let fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteKardexService.obtener(this.sesion.usuario.apodo, fechaInicio, fechaFinal, this.producto.id).subscribe({
      next: res => {
        this.reporteKardex = res.resultado as ReporteKardex;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  pdf(event){
    let fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    let fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteKardexService.pdf(this.sesion.usuario.apodo, fechaInicio, fechaFinal, this.producto.id);
  }

  excel(event){
    let fechaInicio = this.datepipe.transform(this.fechaInicio, "dd-MM-yyyy");
    let fechaFinal = this.datepipe.transform(this.fechaFinal, "dd-MM-yyyy");
    this.reporteKardexService.excel(this.sesion.usuario.apodo, fechaInicio, fechaFinal, this.producto.id);
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }
}
