import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { validarSesion, exito, exito_swal, error, error_swal, valores } from '../../../constantes';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Banco } from '../../../modelos/caja-banco/banco';
import { BancoService } from '../../../servicios/caja-banco/banco.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Empresa } from 'src/app/modelos/usuario/empresa';

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.scss']
})
export class BancoComponent implements OnInit {

  activo = valores.activo;
  inactivo = valores.inactivo;

  edicion: boolean = true;
  abrirPanelNuevo : boolean= true;
  abrirPanelAdmin : boolean = true;

  sesion: Sesion = null;
  empresa: Empresa = null;
  banco: Banco = new Banco();

  bancos: Banco[] = [];


  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Codigo', celda: (row: Banco) => `${row.codigo}` },
    { nombreColumna: 'ruc', cabecera: 'Ruc', celda: (row: Banco) => `${row.ruc}` },
    { nombreColumna: 'abreviatura', cabecera: 'Nombre Corto', celda: (row: Banco) => `${row.abreviatura}` },
    { nombreColumna: 'subsistema', cabecera: 'Subsistema', celda: (row: Banco) => `${row.subsistema}` },
    { nombreColumna: 'calificacion', cabecera: 'Calificación', celda: (row: Banco) => `${row.calificacion}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Banco) => `${row.estado}` }
  ];

  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Banco>;
  observable: BehaviorSubject<MatTableDataSource<Banco>> = new BehaviorSubject<MatTableDataSource<Banco>>(null);
  clickedRows = new Set<Banco>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, private sesionService: SesionService, private router: Router, 
    private bancoService: BancoService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultar();
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.banco = new Banco();
    this.clickedRows.clear();
    this.edicion = true;
    this.borrarFiltro();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.banco.empresa = this.empresa;
    this.bancoService.crear(this.banco).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.banco=res.resultado as Banco;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.edicion = true;
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.bancoService.actualizar(this.banco).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.banco=res.resultado as Banco;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.bancoService.activar(this.banco).subscribe({
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
    this.bancoService.inactivar(this.banco).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.bancoService.consultar().subscribe({
      next: res => {
        this.bancos = res.resultado as Banco[]
        this.llenarTablaCalificacionCliente(this.bancos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaCalificacionCliente(bancos: Banco[]) {
    this.dataSource = new MatTableDataSource(bancos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.observable.next(this.dataSource);
  }

  seleccion(banco: Banco) {
    if (!this.clickedRows.has(banco)) {
      this.clickedRows.clear();
      this.clickedRows.add(banco);
      this.banco = banco;
      this.edicion = false;
    } else {
      this.nuevo(null);
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  borrarFiltro() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSource.filter = '';
  }

}
