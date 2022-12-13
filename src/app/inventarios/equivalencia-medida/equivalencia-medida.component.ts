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

  abrirPanelNuevaEquivalencia = true;
  abrirPanelAdminEquivalencia = false;

  sesion: Sesion;
  equivalenciaMedida= new EquivalenciaMedida();
  equivalenciasMedidas: EquivalenciaMedida[];
  equivalenciaMedidaActualizar: EquivalenciaMedida=new EquivalenciaMedida();
  equivalenciaMedidaBuscar: EquivalenciaMedida=new EquivalenciaMedida();

  columnas: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: EquivalenciaMedida) => `${row.id}`},
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: EquivalenciaMedida) => `${row.codigo}`},
    { nombreColumna: 'medidaIni', cabecera: 'Medida Ini', celda: (row: EquivalenciaMedida) => `${row.medidaIni.descripcion}`},
    { nombreColumna: 'equivalencia', cabecera: 'Valor Equiv', celda: (row: EquivalenciaMedida) => `${row.equivalencia}`},
    { nombreColumna: 'medidaFin', cabecera: 'Medida Equiv', celda: (row: EquivalenciaMedida) => `${row.medidaEqui.descripcion}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: EquivalenciaMedida) => `${row.estado ? row.estado : ''}`}
  ];
  columnasEquivalenciaMedida: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSourceEquivalenciaMedida: MatTableDataSource<EquivalenciaMedida>;
  clickedRows = new Set<EquivalenciaMedida>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tabService: TabService,private equivalenciaMedidaService: EquivalenciaMedidaService, private medidaService: MedidaService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.construirEquivalenciaMedida();
    this.consultar();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  construirEquivalenciaMedida() {
    let equivalenciaMedidaId=0;
    this.equivalenciaMedidaService.currentMessage.subscribe(message => equivalenciaMedidaId = message);
    if (equivalenciaMedidaId!= 0) {
      this.equivalenciaMedidaService.obtener(equivalenciaMedidaId).subscribe(
        res => {
          Object.assign(this.equivalenciaMedida, res.resultado as EquivalenciaMedida);
          this.equivalenciaMedidaService.enviar(0);
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }

  nuevo(event: any) {
    if (event!=null)
      event.preventDefault();
    this.equivalenciaMedida = new EquivalenciaMedida();
  }

  borrar(event: any){
    if (event!=null)
      event.preventDefault();
      if(this.equivalenciaMedida.id!=0){
        let id=this.equivalenciaMedida.id;
        let codigo=this.equivalenciaMedida.codigo;
        this.equivalenciaMedida=new EquivalenciaMedida();
        this.equivalenciaMedida.id=id;
        this.equivalenciaMedida.codigo=codigo;
      }
      else{
        this.equivalenciaMedida=new EquivalenciaMedida();
      }
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    this.equivalenciaMedidaService.crear(this.equivalenciaMedida).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
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
        this.equivalenciaMedida=res.resultado as EquivalenciaMedida;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizarLeer(event: any){
    if (event!=null)
      event.preventDefault();
      this.abrirPanelNuevaEquivalencia = true;
      this.abrirPanelAdminEquivalencia = false;
    if (this.equivalenciaMedidaActualizar.id != 0){
      this.equivalenciaMedida={... this.equivalenciaMedidaActualizar};
      this.equivalenciaMedidaActualizar=new EquivalenciaMedida();
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  consultar() {
    this.equivalenciaMedidaService.consultar().subscribe(
      res => {
        this.equivalenciasMedidas = res.resultado as EquivalenciaMedida[];
        this.llenarDataSourceEquivalenciaMedida(this.equivalenciasMedidas);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  buscar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.equivalenciaMedidaService.buscar(this.equivalenciaMedidaBuscar).subscribe(
      res => {
          this.equivalenciasMedidas = res.resultado as EquivalenciaMedida[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(equivalenciaMedidaSeleccionada: EquivalenciaMedida) {
    if (!this.clickedRows.has(equivalenciaMedidaSeleccionada)){
      this.clickedRows.clear();
      this.clickedRows.add(equivalenciaMedidaSeleccionada);
      this.equivalenciaMedida = equivalenciaMedidaSeleccionada;
      this.equivalenciaMedidaActualizar=equivalenciaMedidaSeleccionada;
    } else {
      this.clickedRows.clear();
      this.equivalenciaMedida = new EquivalenciaMedida();
    }
  }

  filtroEquivalenciaMedida(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEquivalenciaMedida.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceEquivalenciaMedida.paginator) {
      this.dataSourceEquivalenciaMedida.paginator.firstPage();
    }
  }

  llenarDataSourceEquivalenciaMedida(equivalenciasMedidas : EquivalenciaMedida[]){
    this.dataSourceEquivalenciaMedida = new MatTableDataSource(equivalenciasMedidas);
    this.dataSourceEquivalenciaMedida.filterPredicate = (data: EquivalenciaMedida, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.medidaIni.descripcion.toUpperCase().includes(filter) || data.medidaEqui.descripcion.toUpperCase().includes(filter);
    this.dataSourceEquivalenciaMedida.paginator = this.paginator;
    this.dataSourceEquivalenciaMedida.sort = this.sort;
  }

  cambiarBuscarCodigo(){
    this.buscar(null);
  }

  cambiarBuscarMedida1(){
    this.buscar(null);
  }

  cambiarBuscarMedida2(){
    this.buscar(null);
  }

  cambiarBuscarEquivalencia(){
    this.buscar(null);;
  }

}
