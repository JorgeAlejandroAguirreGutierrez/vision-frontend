import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { EmpresaService } from '../../servicios/empresa.service';
import { Empresa } from '../../modelos/empresa';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/sesion';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  abrirPanelNuevoEmpresa = true;
  abrirPanelAdminEmpresa = false;

  sesion: Sesion=null;
  empresa= new Empresa();
  empresas: Empresa[];

  columnasEmpresa: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Empresa) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Empresa) => `${row.codigo}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificacion', celda: (row: Empresa) => `${row.identificacion}` },
    { nombreColumna: 'razonSocial', cabecera: 'Razon Social', celda: (row: Empresa) => `${row.razonSocial}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Empresa) => `${row.estado}` }
  ];
  cabeceraEmpresa: string[] = this.columnasEmpresa.map(titulo => titulo.nombreColumna);
  dataSourceEmpresa: MatTableDataSource<Empresa>;
  clickedRows = new Set<Empresa>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private empresaService: EmpresaService,
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
    this.empresa = new Empresa();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.empresaService.crear(this.empresa).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.empresa=res.resultado as Empresa;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.empresaService.actualizar(this.empresa).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.empresa=res.resultado as Empresa;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.empresaService.eliminarPersonalizado(this.empresa).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.empresaService.consultar().subscribe(
      res => {
        this.empresas = res.resultado as Empresa[]
        this.dataSourceEmpresa = new MatTableDataSource(this.empresas);
        this.dataSourceEmpresa.paginator = this.paginator;
        this.dataSourceEmpresa.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(empresa: Empresa) {
    if (!this.clickedRows.has(empresa)){
      this.clickedRows.clear();
      this.clickedRows.add(empresa);
      this.empresa = empresa;
    } else {
      this.clickedRows.clear();
      this.empresa = new Empresa();
    }
  }

  filtroEmpresa(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEmpresa.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceEmpresa.paginator) {
      this.dataSourceEmpresa.paginator.firstPage();
    }
  }

}
