import { Component, OnInit, HostListener} from '@angular/core';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { PlazoCreditoService } from '../../servicios/plazo-credito.service';
import { PlazoCredito } from '../../modelos/plazo-credito';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plazo-credito',
  templateUrl: './plazo-credito.component.html',
  styleUrls: ['./plazo-credito.component.scss']
})
export class PlazoCreditoComponent implements OnInit {

  abrirPanelNuevoPlazoCredito = true;
  abrirPanelAdminPlazoCredito = false;

  sesion: Sesion=null;
  plazoCredito= new PlazoCredito();
  plazosCreditos: PlazoCredito[];

  columnasPlazoCredito: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: PlazoCredito) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: PlazoCredito) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: PlazoCredito) => `${row.descripcion}` },
    { nombreColumna: 'plazo', cabecera: 'Plazo', celda: (row: PlazoCredito) => `${row.plazo}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: PlazoCredito) => `${row.estado}` }
  ];
  cabeceraPlazoCredito: string[] = this.columnasPlazoCredito.map(titulo => titulo.nombreColumna);
  dataSourcePlazoCredito: MatTableDataSource<PlazoCredito>;
  clickedRows = new Set<PlazoCredito>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private plazoCreditoService: PlazoCreditoService,
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
    this.plazoCredito = new PlazoCredito();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.plazoCreditoService.crear(this.plazoCredito).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.plazoCredito=res.resultado as PlazoCredito;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.plazoCreditoService.actualizar(this.plazoCredito).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.plazoCredito=res.resultado as PlazoCredito;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.plazoCreditoService.eliminarPersonalizado(this.plazoCredito).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.plazoCreditoService.consultar().subscribe(
      res => {
        this.plazosCreditos = res.resultado as PlazoCredito[]
        this.dataSourcePlazoCredito = new MatTableDataSource(this.plazosCreditos);
        this.dataSourcePlazoCredito.paginator = this.paginator;
        this.dataSourcePlazoCredito.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(plazoCredito: PlazoCredito) {
    if (!this.clickedRows.has(plazoCredito)){
      this.clickedRows.clear();
      this.clickedRows.add(plazoCredito);
      this.plazoCredito = plazoCredito;
    } else {
      this.clickedRows.clear();
      this.plazoCredito = new PlazoCredito();
    }
  }

  filtroPlazoCredito(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePlazoCredito.filter = filterValue.trim().toUpperCase();
    if (this.dataSourcePlazoCredito.paginator) {
      this.dataSourcePlazoCredito.paginator.firstPage();
    }
  }
}
