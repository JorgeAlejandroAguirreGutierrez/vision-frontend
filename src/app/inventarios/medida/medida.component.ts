import { Component, HostListener, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { TabService } from '../../componentes/services/tab.service';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { Medida } from '../../modelos/medida';
import { MedidaService } from '../../servicios/medida.service';

@Component({
  selector: 'app-medida',
  templateUrl: './medida.component.html',
  styleUrls: ['./medida.component.scss']
})
export class MedidaComponent implements OnInit {

  sesion: Sesion;
  medida= new Medida();
  medidas: Medida[];
  ComponenteMedida: Type<any> = MedidaComponent;

  abrirPanelNuevaMedida = true;
  abrirPanelAdminMedida = false;

  //medida: Medida;
  medidaActualizar: Medida= new Medida();
  medidaBuscar: Medida=new Medida();

  columnasMedida: string[] = ['id', 'codigo', 'descripcion', 'abreviatura', 'tipo', 'estado'];
  dataSourceMedida: MatTableDataSource<Medida>;
  clickedRows = new Set<Medida>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tabService: TabService,private medidaService: MedidaService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion= this.sesionService.getSesion();
    this.construirMedida();
    this.consultar();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminarLeer(null);
  }
  
  async construirMedida() {
    let medida_id=0;
    this.medidaService.currentMessage.subscribe(message => medida_id = message);
    if (medida_id!= 0) {
      await this.medidaService.obtenerAsync(medida_id).then(
        res => {
          Object.assign(this.medida, res.resultado as Medida);
          this.medidaService.enviar(0);
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
  }

  nuevo(event: any) {
    if (event!=null)
      event.preventDefault();
    this.tabService.addNewTab(MedidaComponent, constantes.tab_crear_medida);
  }
  
  borrar(event: any){
    if (event!=null)
      event.preventDefault();
      if(this.medida.id!=0){
        let id=this.medida.id;
        let codigo=this.medida.codigo;
        this.medida=new Medida();
        this.medida.id=id;
        this.medida.codigo=codigo;
      }
      else{
        this.medida=new Medida();
      }
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    this.medidaService.crear(this.medida).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.medidaService.actualizar(this.medida).subscribe(
      res => {
        this.medida=res.resultado as Medida;
        this.consultar();
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizarLeer(event: any){
    if (event!=null)
      event.preventDefault();
      this.abrirPanelNuevaMedida = true;
      this.abrirPanelAdminMedida = false;
    if (this.medidaActualizar.id != 0){
      this.medida={... this.medidaActualizar};
      this.medidaActualizar=new Medida();
    }
  }

  eliminar(medida: Medida) {
    this.medidaService.eliminar(medida).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.medida=res.resultado as Medida
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }
  
  eliminarLeer(event: any) {
    if (event!=null)
      event.preventDefault();
    this.medidaService.eliminar(this.medida).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.consultar();  
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  consultar() {
    this.medidaService.consultar().subscribe(
      res => {
        this.medidas = res.resultado as Medida[];
        this.dataSourceMedida = new MatTableDataSource(this.medidas);
        this.dataSourceMedida.paginator = this.paginator;
        this.dataSourceMedida.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event: any) {
    if (event!=null)
      event.preventDefault();
      this.medidaService.buscar(this.medidaBuscar).subscribe(
        res => {
          this.medidas = res.resultado as Medida[]
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
      );
  }

  seleccion(medidaSeleccionada: Medida) {
    if (!this.clickedRows.has(medidaSeleccionada)){
      this.clickedRows.clear();
      this.clickedRows.add(medidaSeleccionada);
      this.medida = medidaSeleccionada;
      this.medidaActualizar=medidaSeleccionada;
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

  cambiarBuscarCodigo(){
    this.buscar(null);
  }

  cambiarBuscarCodigoNorma(){
    this.buscar(null);
  }

  cambiarBuscarDescripcion(){
    this.buscar(null);
  }

  cambiarBuscarAbreviatura(){
    this.buscar(null);
  }
}
