import { Component, OnInit, HostListener, Type, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { TabService } from '../../componentes/services/tab.service';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { GrupoProducto } from '../../modelos/grupo-producto';
import { GrupoProductoService } from '../../servicios/grupo-producto.service';
import { CategoriaProductoService } from '../../servicios/categoria-producto.service';
import { CategoriaProducto } from '../../modelos/categoria-producto';
import { PresentacionBien } from '../../modelos/presentacion-bien';
import { MovimientoContable } from '../../modelos/movimiento-contable';
import { MovimientoContableService } from '../../servicios/movimiento-contable.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  usuario: string;
  clave: string;
}

@Component({
  selector: 'app-grupo-producto',
  templateUrl: './grupo-producto.component.html',
  styleUrls: ['./grupo-producto.component.scss']
})
export class GrupoProductoComponent implements OnInit {

  abrirPanelNuevoGrupo: boolean = true;
  abrirPanelAdminGrupo: boolean = false;
  deshabilitarPresentacion: boolean = false;

  usuario: string = "";
  clave: string = "";

  sesion: Sesion;
  estado: string = "ACTIVO";
  categoriasProductos: CategoriaProducto[] = [];

  grupoProducto:GrupoProducto = new GrupoProducto();
  presentacionBien:PresentacionBien = new PresentacionBien();
  movimientoContable:MovimientoContable = new MovimientoContable();

  ComponenteGrupoProducto: Type<any> = GrupoProductoComponent;
  gruposProductos: GrupoProducto[];
  grupoProductoBuscar: GrupoProducto = new GrupoProducto();
  movimientoContableBuscar: MovimientoContable = new MovimientoContable();

  grupos: string[] = [];
  seleccionGrupo = new FormControl();
  filtroGrupos: Observable<string[]> = new Observable<string[]>();

  subgrupos: string[] = [];
  seleccionSubgrupo = new FormControl();
  filtroSubgrupos: Observable<string[]> = new Observable<string[]>();

  secciones: string[] = [];
  seleccionSeccion = new FormControl();
  filtroSecciones: Observable<string[]> = new Observable<string[]>();

  lineas: string[] = [];
  seleccionLinea = new FormControl();
  filtroLineas: Observable<string[]> = new Observable<string[]>();

  sublineas: string[] = [];
  seleccionSublinea = new FormControl();
  filtroSublineas: Observable<string[]> = new Observable<string[]>();

  presentaciones: string[] = [];
  seleccionPresentacion = new FormControl();
  filtroPresentaciones: Observable<string[]> = new Observable<string[]>();

  //cabeceraGrupoProducto: string[] = ['id', 'grupo', 'subgrupo', 'seccion', 'linea', 'sublinea', 'presentacion'];
  dataSourceGrupoProducto: MatTableDataSource<GrupoProducto>;
  clickedRows = new Set<GrupoProducto>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private sesionService: SesionService, private router: Router, private tabService: TabService,
    private grupoProductoService: GrupoProductoService, private categoriaProductoService: CategoriaProductoService,
    private movimientoContableService: MovimientoContableService) { }

  async ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.construirGrupoProducto();
    this.consultar();
    console.log(this.gruposProductos);
    this.categoriaProductoService.consultar().subscribe(
      res => {
        this.categoriasProductos = res.resultado as CategoriaProducto[];
        this.grupoProducto.categoriaProducto = this.categoriasProductos[0]; // Falta el .id
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
    await this.consultarGruposAsync();
    this.filtroGrupos = this.seleccionGrupo.valueChanges
      .pipe(
        startWith(''),
        map(grupo => this.filtroGrupo(grupo))
      );

    this.filtroSubgrupos = this.seleccionSubgrupo.valueChanges
      .pipe(
        startWith(''),
        map(subgrupo => this.filtroSubgrupo(subgrupo))
      );

    this.filtroSecciones = this.seleccionSeccion.valueChanges
      .pipe(
        startWith(''),
        map(seccion => this.filtroSeccion(seccion))
      );

    this.filtroLineas = this.seleccionLinea.valueChanges
      .pipe(
        startWith(''),
        map(linea => this.filtroLinea(linea))
      );

    this.filtroSublineas = this.seleccionSublinea.valueChanges
      .pipe(
        startWith(''),
        map(sublinea => this.filtroSublinea(sublinea))
      );
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

  construirGrupoProducto() {
    let presentacionProductoId = 0;
    this.grupoProductoService.currentMessage.subscribe(message => presentacionProductoId = message);
    if (presentacionProductoId != 0) {
      this.grupoProductoService.obtener(presentacionProductoId).subscribe(
        res => {
          this.grupoProducto = res.resultado as GrupoProducto
          this.grupoProductoService.enviar(0);
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
      );
    }
  }

  async consultarGruposAsync() {
    await this.grupoProductoService.consultarGruposAsync().then(
      res => {
        this.grupos = res.resultado as string[];
      },
      err => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message });
      }
    );
  }

  nuevo(event: any) {
    if (event != null)
      event.preventDefault();
    this.grupoProducto = new GrupoProducto();
  }

  borrar(event: any){
    if (event!=null)
      event.preventDefault();
      if(this.grupoProducto.id!=0){
        let id=this.grupoProducto.id;
        let codigo=this.grupoProducto.codigo;
        this.grupoProducto=new GrupoProducto();
        this.grupoProducto.id=id;
        this.grupoProducto.codigo=codigo;
      }
      else{
        this.grupoProducto=new GrupoProducto();
      }
  }

  crear(event: any) {
    if (event != null)
      event.preventDefault();
    this.grupoProductoService.crear(this.grupoProducto).subscribe(
      res => {
        this.grupoProducto = res.resultado as GrupoProducto;
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        let indice_tab_activo = constantes.tab_activo(this.tabService);
        //this.tabService.removeTab(indice_tab_activo);
        this.tabService.addNewTab(GrupoProductoComponent, constantes.tab_crear_grupo_producto);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    this.grupoProductoService.actualizar(this.grupoProducto).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.grupoProducto = res.resultado as GrupoProducto;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  eliminar(grupo_producto: GrupoProducto) {
    this.grupoProductoService.eliminar(grupo_producto).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.grupoProducto = res.resultado as GrupoProducto
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  consultar() {
    this.grupoProductoService.consultar().subscribe(
      res => {
        this.gruposProductos = res.resultado as GrupoProducto[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  async consultarAsync() {
    await this.grupoProductoService.consultarAsync().then(
      res => {
        this.gruposProductos = res.resultado as GrupoProducto[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  llenarDataSourceGrupoProducto(grupos_productos : GrupoProducto[]){
    this.dataSourceGrupoProducto = new MatTableDataSource(grupos_productos);
    this.dataSourceGrupoProducto.filterPredicate = (data: GrupoProducto, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.grupo.toUpperCase().includes(filter) || data.subgrupo.toUpperCase().includes(filter) ||
      data.seccion.toUpperCase().includes(filter) || data.linea.toUpperCase().includes(filter) || data.sublinea.toUpperCase().includes(filter) || data.presentacion.toUpperCase().includes(filter);
    this.dataSourceGrupoProducto.paginator = this.paginator;
    this.dataSourceGrupoProducto.sort = this.sort;
  }

  grupoSeleccionado(event: any){
    console.log(event);
    let grupoProductoRecibido = event.grupoProductoSeleccionado as GrupoProducto;
    this.grupoProducto = grupoProductoRecibido;
    console.log(grupoProductoRecibido.codigo);
  }

  actualizarLeer(event: any) {
    if (event != null)
      event.preventDefault();
    if (this.grupoProducto != null) {
      this.grupoProductoService.enviar(this.grupoProducto.id);
      let indiceTabActivo = constantes.tab_activo(this.tabService);
      //this.tabService.removeTab(indiceTabActivo);
      this.tabService.addNewTab(this.ComponenteGrupoProducto, 'Actualizar Tabla de Grupo de Producto');
    } else {
      Swal.fire(constantes.error, "Selecciona un Grupo de Producto", constantes.error_swal);
    }
  }

  eliminarLeer(event: any) {
    if (event != null)
      event.preventDefault();
    this.grupoProductoService.eliminar(this.grupoProducto).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event: any) {
    if (event != null)
      event.preventDefault();
    this.grupoProductoService.buscar(this.grupoProductoBuscar).subscribe(
      res => {
        this.gruposProductos = res.resultado as GrupoProducto[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }
  // Para el buscador de la tabla
  filtroGrupoProducto(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGrupoProducto.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceGrupoProducto.paginator) {
      this.dataSourceGrupoProducto.paginator.firstPage();
    }
  }

  validarCategoria() {
    if (this.grupoProducto.categoriaProducto.id != 1) {
      this.deshabilitarPresentacion = true;
      this.seleccionLinea.disable();
      this.seleccionSublinea.disable();
    } else {
      this.deshabilitarPresentacion = false;
      this.seleccionLinea.enable();
      this.seleccionSublinea.enable();
    }
  }

  seleccion(grupoSeleccionado: GrupoProducto) {
    if (!this.clickedRows.has(grupoSeleccionado)) {
      this.clickedRows.clear();
      this.clickedRows.add(grupoSeleccionado);
      this.grupoProducto = grupoSeleccionado;
    } else {
      this.clickedRows.clear();
      this.grupoProducto = new GrupoProducto();
    }
  }

  cambiarBuscarGrupo() {
    this.buscar(null);
  }

  // Metodos para los autocomplete
  private filtroGrupo(value: string): string[] {
    this.grupoProducto.grupo = value.toUpperCase();
    // Actua como que el valor digitado fuera el seleccionado
    this.seleccionarGrupo();
    if (this.grupos.length > 0) {
      const filterValue = value.toLowerCase();
      return this.grupos.filter(grupo => grupo.toLowerCase().includes(filterValue));
    }
    return [];
  }
  async seleccionarGrupo() {
    if (this.seleccionGrupo.value!=null){
      this.grupoProducto.grupo = this.seleccionGrupo.value.toUpperCase();
    }
    await this.grupoProductoService.consultarSubgruposAsync(this.grupoProducto.grupo).then(
      res => {
        this.subgrupos = res.resultado as string[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
    this.limpiarFormulario('grupo');
  }

  private filtroSubgrupo(value: string): string[] {
    this.grupoProducto.subgrupo = value.toUpperCase();
    this.seleccionarSubgrupo();
    if (this.subgrupos.length > 0) {
      const filterValue = value.toLowerCase();
      return this.subgrupos.filter(subgrupo => subgrupo.toLowerCase().includes(filterValue));
    }
    return [];
  }
  async seleccionarSubgrupo() {
    if (this.seleccionSubgrupo.value!=null){
      this.grupoProducto.subgrupo = this.seleccionSubgrupo.value.toUpperCase();
    }
    await this.grupoProductoService.consultarSeccionesAsync(this.grupoProducto.grupo, this.grupoProducto.subgrupo).then(
      res => {
        this.secciones = res.resultado as string[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
    this.limpiarFormulario('subgrupo');
  }

  private filtroSeccion(value: string): string[] {
    this.grupoProducto.seccion = value.toUpperCase();
    this.seleccionarSeccion();
    if (this.secciones.indexOf(value) > -1) { // Si encuentra la sección
      //this.consultarMovimientoContable(); //
    }
    if (this.secciones.length > 0) {
      const filterValue = value.toLowerCase();
      return this.secciones.filter(seccion => seccion.toLowerCase().includes(filterValue));
    }
    return [];
  }
  async seleccionarSeccion() {
    if (this.seleccionSeccion.value!=null){
      this.grupoProducto.seccion = this.seleccionSeccion.value.toUpperCase();
    }
    await this.grupoProductoService.consultarLineasAsync(this.grupoProducto.grupo, this.grupoProducto.subgrupo, this.grupoProducto.seccion).then(
      res => {
        this.lineas = res.resultado as string[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
    this.limpiarFormulario('seccion');
    //this.consultarMovimientoContable();
  }

  consultarMovimientoContable() {
    this.grupoProductoService.consultarMovimientoContable(this.grupoProducto.grupo, this.grupoProducto.subgrupo, this.grupoProducto.seccion).subscribe(
      res => {
        //this.grupo_producto.movimiento_contable = res.resultado as MovimientoContable;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  private filtroLinea(value: string): string[] {
    this.grupoProducto.linea = value.toUpperCase();
    this.seleccionarLinea();
    if (this.lineas.length > 0) {
      const filterValue = value.toLowerCase();
      return this.lineas.filter(linea => linea.toLowerCase().includes(filterValue));
    }
    return [];
  }
  async seleccionarLinea() {
    if (this.seleccionLinea.value!=null){
      this.grupoProducto.linea = this.seleccionLinea.value.toUpperCase();
    }
    await this.grupoProductoService.consultarSublineasAsync(this.grupoProducto.grupo, this.grupoProducto.subgrupo, this.grupoProducto.seccion, this.grupoProducto.linea).then(
      res => {
        this.sublineas = res.resultado as string[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
    this.limpiarFormulario('linea');
  }

  private filtroSublinea(value: string): string[] {
    this.grupoProducto.sublinea = value.toUpperCase();
    this.seleccionarSublinea();
    if (this.lineas.length > 0) {
      const filterValue = value.toLowerCase();
      return this.sublineas.filter(sublinea => sublinea.toLowerCase().includes(filterValue));
    }
    return [];
  }
  async seleccionarSublinea() {
    if (this.seleccionSublinea.value!=null){
      this.grupoProducto.sublinea = this.seleccionSublinea.value.toUpperCase();
    }
    await this.grupoProductoService.consultarPresentacionesAsync(this.grupoProducto.grupo, this.grupoProducto.subgrupo, this.grupoProducto.seccion, this.grupoProducto.linea, this.grupoProducto.sublinea).then(
      res => {
        this.presentaciones = res.resultado as string[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
    this.limpiarFormulario('sublinea');
  }

  limpiarFormulario(formularioModificado: String) {
    if (formularioModificado == 'grupo') {
      this.seleccionSubgrupo.setValue('');
    }
    if (formularioModificado == 'subgrupo') {
      this.seleccionSeccion.setValue('');
    }
    if (formularioModificado == 'seccion') {
      this.seleccionLinea.setValue('');
    }
    if (formularioModificado == 'linea') {
      this.seleccionSublinea.setValue('');
    }
    if (formularioModificado == 'sublinea') {
      this.seleccionPresentacion.setValue('');
    }
  }

  dialogoMovimientosContables(): void {
    const dialogRef = this.dialog.open(DialogoMovimientoContableComponent, {
      width: '80%',
      data: { usuario: this.usuario, clave: this.clave }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El dialogo para cambio de contraseña fue cerrado');
      this.usuario = result;
    });
  }
}

@Component({
  selector: 'dialogo-movimiento-contable',
  templateUrl: 'dialogo-movimiento-contable.component.html',
})
export class DialogoMovimientoContableComponent {

  sesion = new Sesion();
  repetirContrasena: string;

  constructor(
    public dialogRef: MatDialogRef<DialogoMovimientoContableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}