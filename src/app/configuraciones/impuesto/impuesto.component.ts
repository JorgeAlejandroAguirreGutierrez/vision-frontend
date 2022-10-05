import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ImpuestoService } from '../../servicios/inventario/impuesto.service';
import { Impuesto } from '../../modelos/inventario/impuesto';
import Swal from 'sweetalert2';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-impuesto',
  templateUrl: './impuesto.component.html',
  styleUrls: ['./impuesto.component.scss']
})
export class ImpuestoComponent implements OnInit {

  abrirPanelNuevoImpuesto = true;
  abrirPanelAdminImpuesto = false;

  sesion: Sesion=null;
  impuesto= new Impuesto();
  impuestos: Impuesto[];

  columnasImpuesto: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Impuesto) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Impuesto) => `${row.codigo}` },
    { nombreColumna: 'codigoNorma', cabecera: 'Codigo Norma', celda: (row: Impuesto) => `${row.codigoNorma}` },
    { nombreColumna: 'porcentaje', cabecera: 'Porcentaje', celda: (row: Impuesto) => `${row.porcentaje}` },
  ];
  cabeceraImpuesto: string[] = this.columnasImpuesto.map(titulo => titulo.nombreColumna);
  dataSourceImpuesto: MatTableDataSource<Impuesto>;
  clickedRows = new Set<Impuesto>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private impuestoService: ImpuestoService,
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
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminar(null);
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.impuesto = new Impuesto();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.impuestoService.crear(this.impuesto).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.impuesto=res.resultado as Impuesto;
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.impuestoService.actualizar(this.impuesto).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.impuesto=res.resultado as Impuesto;
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.impuestoService.eliminar(this.impuesto).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.impuestoService.consultar().subscribe(
      res => {
        this.impuestos = res.resultado as Impuesto[]
        this.dataSourceImpuesto = new MatTableDataSource(this.impuestos);
        this.dataSourceImpuesto.paginator = this.paginator;
        this.dataSourceImpuesto.sort = this.sort;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(impuesto: Impuesto) {
    if (!this.clickedRows.has(impuesto)){
      this.clickedRows.clear();
      this.clickedRows.add(impuesto);
      this.impuesto = impuesto;
    } else {
      this.clickedRows.clear();
      this.impuesto = new Impuesto();
    }
  }

  filtroImpuesto(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceImpuesto.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceImpuesto.paginator) {
      this.dataSourceImpuesto.paginator.firstPage();
    }
  }

}
