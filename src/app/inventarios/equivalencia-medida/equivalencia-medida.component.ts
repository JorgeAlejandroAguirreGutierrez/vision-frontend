import { Component, OnInit, HostListener, Type } from '@angular/core';
import { TabService } from '../../componentes/services/tab.service';
import Swal from 'sweetalert2';
import { EquivalenciaMedida } from '../../modelos/inventario/equivalencia-medida';
import { EquivalenciaMedidaService } from '../../servicios/inventario/equivalencia-medida.service';
import { MedidaService } from '../../servicios/inventario/medida.service';
import { validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-equivalencia-medida',
  templateUrl: './equivalencia-medida.component.html',
  styleUrls: ['./equivalencia-medida.component.scss']
})

export class EquivalenciaMedidaComponent implements OnInit {

  abrirPanelNuevo = true;
  abrirPanelAdmin = false;

  sesion: Sesion;
  equivalenciaMedida= new EquivalenciaMedida();
  equivalenciasMedidas: EquivalenciaMedida[];
  equivalenciaMedidaActualizar: EquivalenciaMedida=new EquivalenciaMedida();
  equivalenciaMedidaBuscar: EquivalenciaMedida=new EquivalenciaMedida();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: EquivalenciaMedida) => `${row.codigo}`},
    { nombreColumna: 'medidaIni', cabecera: 'Medida Ini', celda: (row: EquivalenciaMedida) => `${row.medidaIni.descripcion}`},
    { nombreColumna: 'equivalencia', cabecera: 'Valor Equiv', celda: (row: EquivalenciaMedida) => `${row.equivalencia}`},
    { nombreColumna: 'medidaFin', cabecera: 'Medida Equiv', celda: (row: EquivalenciaMedida) => `${row.medidaEqui.descripcion}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: EquivalenciaMedida) => `${row.estado ? row.estado : ''}`}
  ];

  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<EquivalenciaMedida>;
  clickedRows = new Set<EquivalenciaMedida>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tabService: TabService,private equivalenciaMedidaService: EquivalenciaMedidaService, private medidaService: MedidaService,
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

  nuevo(event: any) {
    if (event!=null)
      event.preventDefault();
    this.equivalenciaMedida = new EquivalenciaMedida();
    this.clickedRows.clear();
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    this.equivalenciaMedidaService.crear(this.equivalenciaMedida).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.equivalenciaMedidaService.actualizar(this.equivalenciaMedida).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.equivalenciaMedidaService.activar(this.equivalenciaMedida).subscribe({
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
    this.equivalenciaMedidaService.inactivar(this.equivalenciaMedida).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  consultar() {
    this.equivalenciaMedidaService.consultar().subscribe(
      res => {
        this.equivalenciasMedidas = res.resultado as EquivalenciaMedida[]
        this.dataSource = new MatTableDataSource(this.equivalenciasMedidas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(equivalenciaMedida: EquivalenciaMedida) {
    if (!this.clickedRows.has(equivalenciaMedida)){
      this.clickedRows.clear();
      this.clickedRows.add(equivalenciaMedida);
      this.equivalenciaMedida = equivalenciaMedida;
    } else {
      this.clickedRows.clear();
      this.equivalenciaMedida = new EquivalenciaMedida();
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
