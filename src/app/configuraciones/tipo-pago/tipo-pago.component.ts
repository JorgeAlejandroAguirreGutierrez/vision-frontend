import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { TipoPago } from '../../modelos/cliente/tipo-pago';
import { TipoPagoService } from '../../servicios/cliente/tipo-pago.service';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-tipo-pago',
  templateUrl: './tipo-pago.component.html',
  styleUrls: ['./tipo-pago.component.scss']
})
export class TipoPagoComponent implements OnInit {

  abrirPanelNuevoTipoPago = true;
  abrirPanelAdminTipoPago = false;

  sesion: Sesion=null;
  tipoPago= new TipoPago();
  tiposPagos: TipoPago[];

  columnasTipoPago: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: TipoPago) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: TipoPago) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripcion', celda: (row: TipoPago) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: TipoPago) => `${row.abreviatura}` },
  ];
  cabeceraTipoPago: string[] = this.columnasTipoPago.map(titulo => titulo.nombreColumna);
  dataSourceTipoPago: MatTableDataSource<TipoPago>;
  clickedRows = new Set<TipoPago>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tipoPagoService: TipoPagoService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoPago = new TipoPago();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoPagoService.crear(this.tipoPago).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.tipoPago=res.resultado as TipoPago;
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoPagoService.actualizar(this.tipoPago).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.tipoPago=res.resultado as TipoPago;
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.tipoPagoService.activar(this.tipoPago).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.tipoPagoService.inactivar(this.tipoPago).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.tipoPagoService.consultar().subscribe(
      res => {
        this.tiposPagos = res.resultado as TipoPago[]
        this.dataSourceTipoPago = new MatTableDataSource(this.tiposPagos);
        this.dataSourceTipoPago.paginator = this.paginator;
        this.dataSourceTipoPago.sort = this.sort;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(tipoPago: TipoPago) {
    if (!this.clickedRows.has(tipoPago)){
      this.clickedRows.clear();
      this.clickedRows.add(tipoPago);
      this.tipoPago = tipoPago;
    } else {
      this.clickedRows.clear();
      this.tipoPago = new TipoPago();
    }
  }

  filtroTipoPago(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTipoPago.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceTipoPago.paginator) {
      this.dataSourceTipoPago.paginator.firstPage();
    }
  }

}
