import { Component, OnInit, HostListener} from '@angular/core';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { TabService } from '../../componentes/services/tab.service';
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

  sesion: Sesion;
  abrirPanelNuevoPlazoCredito = true;
  abrirPanelAdminPlazoCredito = false;

  plazoCredito= new PlazoCredito();

  plazosCreditos: PlazoCredito[];
  plazoCreditoActualizar: PlazoCredito= new PlazoCredito();
  plazoCreditoBuscar: PlazoCredito=new PlazoCredito();

  columnasPlazoCredito: string[] = ['id', 'codigo', 'descripcion', 'plazo', 'estado'];
  dataSourcePlazoCredito: MatTableDataSource<PlazoCredito>;
  clickedRows = new Set<PlazoCredito>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tabService: TabService,private plazoCreditoService: PlazoCreditoService,
    private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    util.validarSesion(this.sesion, this.sesionService, this.router);
    this.construirPlazoCredito();
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
    this.tabService.addNewTab(PlazoCreditoComponent, constantes.tab_crear_plazo_credito);
  }

  borrar(event){
    if (event!=null)
      event.preventDefault();
      if(this.plazoCredito.id!=0){
        let id=this.plazoCredito.id;
        let codigo=this.plazoCredito.codigo;
        this.plazoCredito=new PlazoCredito();
        this.plazoCredito.id=id;
        this.plazoCredito.codigo=codigo;
      }
      else{
        this.plazoCredito=new PlazoCredito();
      }
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.plazoCreditoService.crear(this.plazoCredito).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.plazoCreditoService.actualizar(this.plazoCredito).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.plazoCredito=res.resultado as PlazoCredito;
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizarLeer(event){
    if (event!=null)
      event.preventDefault();
      this.abrirPanelNuevoPlazoCredito = true;
      this.abrirPanelAdminPlazoCredito = false;
    if (this.plazoCreditoActualizar.id != 0){
      this.plazoCredito={... this.plazoCreditoActualizar};
      this.plazoCreditoActualizar=new PlazoCredito();
    }
  }

  eliminar(plazo_credito: PlazoCredito) {
    this.plazoCreditoService.eliminar(plazo_credito).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.plazoCredito=res.resultado as PlazoCredito
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminarLeer(event) {
    if (event!=null)
      event.preventDefault();
    this.plazoCreditoService.eliminar(this.plazoCredito).subscribe(
      res => {
          Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
          this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  async construirPlazoCredito() {
    let plazo_credito_id=0;
    this.plazoCreditoService.currentMessage.subscribe(message => plazo_credito_id = message);
    if (plazo_credito_id!= 0) {
      await this.plazoCreditoService.obtenerAsync(plazo_credito_id).then(
        res => {
          Object.assign(this.plazoCredito, res.resultado as PlazoCredito);
          this.plazoCreditoService.enviar(0);
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
  }

  consultar() {
    this.plazoCreditoService.consultar().subscribe(
      res => {
        this.plazosCreditos = res.resultado as PlazoCredito[];
        this.dataSourcePlazoCredito = new MatTableDataSource(this.plazosCreditos);
        this.dataSourcePlazoCredito.paginator = this.paginator;
        this.dataSourcePlazoCredito.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event) {
    if (event!=null)
      event.preventDefault();
      this.plazoCreditoService.buscar(this.plazoCreditoBuscar).subscribe(
        res => {
          this.plazosCreditos = res.resultado as PlazoCredito[]
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
      );
  }

  seleccion(plazoCreditoSeleccionado: PlazoCredito) {
    if (!this.clickedRows.has(plazoCreditoSeleccionado)){
      this.clickedRows.clear();
      this.clickedRows.add(plazoCreditoSeleccionado);
      this.plazoCredito = plazoCreditoSeleccionado;
      this.plazoCreditoActualizar=plazoCreditoSeleccionado;
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

  cambiarBuscarCodigo(){
    this.buscar(null);
  }

  cambiarBuscarDescripcion(){
    this.buscar(null);
  }

  cambiarBuscarPlazo(){
    this.buscar(null);
  }
}
