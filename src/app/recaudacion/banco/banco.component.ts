import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { TabService } from '../../servicios/componente/tab/tab.service';
import Swal from 'sweetalert2';
import { validarSesion, exito, exito_swal, error, error_swal, valores } from '../../constantes';
import { Banco } from '../../modelos/recaudacion/banco';
import { BancoService } from '../../servicios/recaudacion/banco.service';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { Router } from '@angular/router';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.scss']
})
export class BancoComponent implements OnInit {

  activo = valores.activo;
  inactivo = valores.inactivo;
  banco = new Banco();
  bancos: Banco[] = [];
  sesion: Sesion=null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;
  edicion: boolean = true;
  abrirPanelNuevo : boolean= true;
  abrirPanelAdmin : boolean = false;

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Codigo', celda: (row: Banco) => `${row.codigo}` },
    { nombreColumna: 'tipo', cabecera: 'Tipo', celda: (row: Banco) => `${row.tipo}` },
    { nombreColumna: 'nombre', cabecera: 'Descripción', celda: (row: Banco) => `${row.nombre}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: Banco) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Banco) => `${row.estado}` }
  ];

  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Banco>;
  observable: BehaviorSubject<MatTableDataSource<Banco>> = new BehaviorSubject<MatTableDataSource<Banco>>(null);
  clickedRows = new Set<Banco>();

  constructor(private renderer: Renderer2, private sesionService: SesionService, private router: Router, private tabService: TabService,private bancoService: BancoService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.banco = new Banco();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
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
    this.ordenarAsc(bancos, 'codigo');
    this.dataSource = new MatTableDataSource(bancos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.observable.next(this.dataSource);
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  seleccion(banco: Banco) {
    if (!this.clickedRows.has(banco)) {
      this.clickedRows.clear();
      this.clickedRows.add(banco);
      this.banco = banco;
      this.edicion = false;
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.banco = new Banco();
    this.edicion = true;
    this.clickedRows.clear();
    this.borrarFiltro();
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

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 71) //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 78) //ASHIFT + N
      this.nuevo(null);
  }

}
