import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { valores, validarSesion, mensajes, otras, exito, exito_swal, error, error_swal } from '../../../constantes';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Paquete } from 'src/app/modelos/usuario/paquete';
import { PaqueteService } from 'src/app/servicios/usuario/paquete.service';


@Component({
  selector: 'app-paquete',
  templateUrl: './paquete.component.html',
  styleUrls: ['./paquete.component.scss']
})

export class PaqueteComponent implements OnInit {

  mensual: string = valores.mensual;
  anual: string = valores.anual;
  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;

  sesion: Sesion = null;
  paquete: Paquete = new Paquete();
  paquetes: Paquete[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Paquete) => `${row.codigo}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Paquete) => `${row.nombre}` },
    { nombreColumna: 'maximo', cabecera: 'Maximo Comp', celda: (row: Paquete) => `${row.maximo}` },
    { nombreColumna: 'valorTotal', cabecera: 'Valor Total', celda: (row: Paquete) => `$${row.valorTotal}` },
    { nombreColumna: 'valorAnual', cabecera: 'Valor Anual', celda: (row: Paquete) => `$${row.valorAnual}` },
    { nombreColumna: 'valorMaximo', cabecera: 'Valor Maximo', celda: (row: Paquete) => `$${row.valorMaximo}` },
    { nombreColumna: 'valorPuestaInicial', cabecera: 'Valor P/Inicial', celda: (row: Paquete) => `$${row.valorPuestaInicial}` },
    { nombreColumna: 'comision', cabecera: 'Comision', celda: (row: Paquete) => `$${row.comision}` }, 
    { nombreColumna: 'Tipo', cabecera: 'Tipo', celda: (row: Paquete) => `${row.tipo}` },   
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Paquete) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Paquete>;
  clickedRows = new Set<Paquete>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private router: Router,
    private sesionService: SesionService, private paqueteService: PaqueteService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultar();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && ($event.ctrlKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //SHIFT + N
      this.nuevo(null);
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.paquete = new Paquete();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.paqueteService.crear(this.paquete).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.paquete = res.resultado as Paquete;
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.paqueteService.actualizar(this.paquete).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.paquete = res.resultado as Paquete;
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.paqueteService.activar(this.paquete).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.paqueteService.inactivar(this.paquete).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.paqueteService.consultar().subscribe({
      next: res => {
        this.paquetes = res.resultado as Paquete[];
        this.llenarTabla(this.paquetes);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(paquetes: Paquete[]) {
    this.dataSource = new MatTableDataSource(paquetes);
    this.dataSource.filterPredicate = (data: Paquete, filter: string): boolean =>
      data.nombre.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  seleccion(paquete: Paquete) {
    if (!this.clickedRows.has(paquete)) {
      this.clickedRows.clear();
      this.clickedRows.add(paquete);
      this.paquete = { ...paquete };
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

  validarFormulario(): boolean {
    if (this.paquete.nombre == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.paquete.minimo == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.paquete.maximo == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.paquete.valorMinimo == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.paquete.valorMaximo == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }
}