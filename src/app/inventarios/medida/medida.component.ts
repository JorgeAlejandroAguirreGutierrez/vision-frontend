import { Component, HostListener, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Medida } from '../../modelos/inventario/medida';
import { MedidaService } from '../../servicios/inventario/medida.service';

@Component({
  selector: 'app-medida',
  templateUrl: './medida.component.html',
  styleUrls: ['./medida.component.scss']
})
export class MedidaComponent implements OnInit {

  abrirPanelNuevoMedida = true;
  abrirPanelAdminMedida = false;

  sesion: Sesion=null;
  medida= new Medida();
  medidas: Medida[];
  
  columnasMedida: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Medida) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Medida) => `${row.codigo}` },
    { nombreColumna: 'tipo', cabecera: 'Tipo', celda: (row: Medida) => `${row.tipo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: Medida) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: Medida) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Medida) => `${row.estado}` }
  ];
  cabeceraMedida: string[] = this.columnasMedida.map(titulo => titulo.nombreColumna);
  dataSourceMedida: MatTableDataSource<Medida>;
  clickedRows = new Set<Medida>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private medidaService: MedidaService,
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
    this.medida = new Medida();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.medidaService.crear(this.medida).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.medida=res.resultado as Medida;
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.medidaService.actualizar(this.medida).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.medida=res.resultado as Medida;
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.medidaService.activar(this.medida).subscribe({
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
    this.medidaService.inactivar(this.medida).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  
  consultar() {
    this.medidaService.consultar().subscribe(
      res => {
        this.medidas = res.resultado as Medida[]
        this.dataSourceMedida = new MatTableDataSource(this.medidas);
        this.dataSourceMedida.paginator = this.paginator;
        this.dataSourceMedida.sort = this.sort;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(medida: Medida) {
    if (!this.clickedRows.has(medida)){
      this.clickedRows.clear();
      this.clickedRows.add(medida);
      this.medida = medida;
    } else {
      this.clickedRows.clear();
      this.medida = new Medida();
    }
  }

  filtroMedida(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMedida.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceMedida.paginator) {
      this.dataSourceMedida.paginator.firstPage();
    }
  }
}
