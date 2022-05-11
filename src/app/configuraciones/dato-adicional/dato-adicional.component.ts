import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as util from '../../util';
import * as constantes from '../../constantes';
import Swal from 'sweetalert2';
import { DatoAdicionalService } from '../../servicios/dato-adicional.service';
import { DatoAdicional } from '../../modelos/dato-adicional';
import { Sesion } from 'src/app/modelos/sesion';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-dato-adicional',
  templateUrl: './dato-adicional.component.html',
  styleUrls: ['./dato-adicional.component.scss']
})
export class DatoAdicionalComponent implements OnInit {

  abrirPanelNuevoDatoAdicional = true;
  abrirPanelAdminDatoAdicional = false;

  sesion: Sesion=null;
  datoAdicional= new DatoAdicional();
  datosAdicionales: DatoAdicional[];

  columnasDatoAdicional: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: DatoAdicional) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: DatoAdicional) => `${row.codigo}` },
    { nombreColumna: 'tipo', cabecera: 'Tipo', celda: (row: DatoAdicional) => `${row.tipo}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: DatoAdicional) => `${row.nombre}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: DatoAdicional) => `${row.abreviatura} %` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: DatoAdicional) => `${row.estado}` }
  ];
  cabeceraDatoAdicional: string[] = this.columnasDatoAdicional.map(titulo => titulo.nombreColumna);
  dataSourceDatoAdicional: MatTableDataSource<DatoAdicional>;
  clickedRows = new Set<DatoAdicional>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private datoAdicionalService: DatoAdicionalService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultar();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminar(null);
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.datoAdicional = new DatoAdicional();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.datoAdicionalService.crear(this.datoAdicional).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.datoAdicional=res.resultado as DatoAdicional;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.datoAdicionalService.actualizar(this.datoAdicional).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.datoAdicional=res.resultado as DatoAdicional;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.datoAdicionalService.eliminarPersonalizado(this.datoAdicional).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.datoAdicionalService.consultar().subscribe(
      res => {
        this.datosAdicionales = res.resultado as DatoAdicional[]
        this.dataSourceDatoAdicional = new MatTableDataSource(this.datosAdicionales);
        this.dataSourceDatoAdicional.paginator = this.paginator;
        this.dataSourceDatoAdicional.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(datoAdicional: DatoAdicional) {
    if (!this.clickedRows.has(datoAdicional)){
      this.clickedRows.clear();
      this.clickedRows.add(datoAdicional);
      this.datoAdicional = datoAdicional;
    } else {
      this.clickedRows.clear();
      this.datoAdicional = new DatoAdicional();
    }
  }

  filtroDatoAdicional(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceDatoAdicional.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceDatoAdicional.paginator) {
      this.dataSourceDatoAdicional.paginator.firstPage();
    }
  }

}
