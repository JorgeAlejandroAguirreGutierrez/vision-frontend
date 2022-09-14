import { Component, OnInit, HostListener, Type, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import * as constantes from '../../constantes';
import * as util from '../../util';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { GrupoProducto } from '../../modelos/grupo-producto';
import { GrupoProductoService } from '../../servicios/grupo-producto.service';
import { CategoriaProductoService } from '../../servicios/categoria-producto.service';
import { CategoriaProducto } from '../../modelos/categoria-producto';
import { PresentacionBien } from '../../modelos/presentacion-bien';
import { MovimientoContable } from '../../modelos/movimiento-contable';
import { MovimientoContableService } from '../../servicios/movimiento-contable.service';

import { TabService } from '../../componentes/services/tab.service';

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

  estadoActivo: string = constantes.estadoActivo;
  estadoInactivo: string = constantes.estadoInactivo;

  abrirPanelNuevoGrupo: boolean = true;
  abrirPanelAdminGrupo: boolean = false;
  deshabilitarPresentacion: boolean = false;
  editarGrupoProducto: boolean = true;

  usuario: string = "";
  clave: string = "";

  sesion: Sesion;
  estado: string = "ACTIVO";
  categoriasProductos: CategoriaProducto[] = [];

  grupoProducto: GrupoProducto = new GrupoProducto();
  presentacionBien: PresentacionBien = new PresentacionBien();
  movimientoContable: MovimientoContable = new MovimientoContable();

  ComponenteGrupoProducto: Type<any> = GrupoProductoComponent;
  gruposProductos: GrupoProducto[];
  grupoProductoBuscar: GrupoProducto = new GrupoProducto();
  movimientoContableBuscar: MovimientoContable = new MovimientoContable();

  grupos: string[] = [];
  controlGrupo = new FormControl();
  filtroGrupos: Observable<string[]> = new Observable<string[]>();

  subgrupos: string[] = [];
  controlSubgrupo = new FormControl();
  filtroSubgrupos: Observable<string[]> = new Observable<string[]>();

  secciones: string[] = [];
  controlSeccion = new FormControl();
  filtroSecciones: Observable<string[]> = new Observable<string[]>();

  lineas: string[] = [];
  controlLinea = new FormControl();
  filtroLineas: Observable<string[]> = new Observable<string[]>();

  sublineas: string[] = [];
  controlSublinea = new FormControl();
  filtroSublineas: Observable<string[]> = new Observable<string[]>();

  presentaciones: string[] = [];
  controlPresentacion = new FormControl();
  filtroPresentaciones: Observable<string[]> = new Observable<string[]>();

  //cabeceraGrupoProducto: string[] = ['id', 'grupo', 'subgrupo', 'seccion', 'linea', 'sublinea', 'presentacion'];
  dataSourceGrupoProducto: MatTableDataSource<GrupoProducto>;
  clickedRows = new Set<GrupoProducto>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private sesionService: SesionService, private router: Router, private tabService: TabService,
    private grupoProductoService: GrupoProductoService, private categoriaProductoService: CategoriaProductoService,
    private movimientoContableService: MovimientoContableService) { }

  @HostListener('window:keypress', ['$event'])
    keyEvent($event: KeyboardEvent) {
      if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
        this.crear(null);
      if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
        this.nuevo(null);
      if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
        this.eliminarLeer(null);
  }

  async ngOnInit() {
    this.sesion = util.validarSesion(this.sesionService, this.router);
    this.construirGrupoProducto();
    this.consultarGrupoProductos();
    //console.log(this.gruposProductos);
    this.categoriaProductoService.consultar().subscribe({
      next: res => {
        this.categoriasProductos = res.resultado as CategoriaProducto[];
        this.grupoProducto.categoriaProducto.id = this.categoriasProductos[0].id;
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
    await this.consultarGruposAsync();
    this.filtroGrupos = this.controlGrupo.valueChanges
      .pipe(
        startWith(''),
        map(grupo => this.filtroGrupo(grupo))
      );

    this.filtroSubgrupos = this.controlSubgrupo.valueChanges
      .pipe(
        startWith(''),
        map(subgrupo => this.filtroSubgrupo(subgrupo))
      );

    this.filtroSecciones = this.controlSeccion.valueChanges
      .pipe(
        startWith(''),
        map(seccion => this.filtroSeccion(seccion))
      );

    this.filtroLineas = this.controlLinea.valueChanges
      .pipe(
        startWith(''),
        map(linea => this.filtroLinea(linea))
      );

    this.filtroSublineas = this.controlSublinea.valueChanges
      .pipe(
        startWith(''),
        map(sublinea => this.filtroSublinea(sublinea))
      );
  }

  limpiar() {
    if (this.grupoProducto.id != 0) {
      let id = this.grupoProducto.id;
      let codigo = this.grupoProducto.codigo;
      this.grupoProducto = new GrupoProducto();
      this.grupoProducto.id = id;
      this.grupoProducto.codigo = codigo;
    }
    else {
      this.clickedRows.clear();
      this.grupoProducto = new GrupoProducto();
    }
    this.grupoProducto.categoriaProducto.id = this.categoriasProductos[0].id;
    this.habilitarControles();
    this.editarGrupoProducto = true;
    this.controlGrupo.setValue('');
    this.controlSubgrupo.setValue('');
    this.controlSeccion.setValue('');
    this.controlLinea.setValue('');
    this.controlSublinea.setValue('');
    this.controlPresentacion.setValue('');

  }

  borrar(formularioModificado: String) {
    if (this.editarGrupoProducto) {
      if (formularioModificado == 'grupo') {
        this.controlSubgrupo.setValue('');
      }
      if (formularioModificado == 'subgrupo') {
        this.controlSeccion.setValue('');
      }
      if (formularioModificado == 'seccion') {
        this.controlLinea.setValue('');
      }
      if (formularioModificado == 'linea') {
        this.controlSublinea.setValue('');
      }
      if (formularioModificado == 'sublinea') {
        this.controlPresentacion.setValue('');
      }
    }
  }

  nuevo(event: any) {
    if (event != null)
      event.preventDefault();
    this.grupoProducto = new GrupoProducto();
  }

  crear(event: any) {
    if (event != null)
      event.preventDefault();
    this.grupoProductoService.crear(this.grupoProducto).subscribe(
      res => {
        this.grupoProducto = res.resultado as GrupoProducto;
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  editar() {
    this.habilitarControles();
    this.validarCategoria();
    this.editarGrupoProducto = true;
  }

  actualizar(event: any) {
    if (event != null)
      event.preventDefault();
    this.grupoProductoService.actualizar(this.grupoProducto).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.grupoProducto = res.resultado as GrupoProducto;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizarLeer(event: any) {
    if (event != null)
      event.preventDefault();
    if (this.grupoProducto != null) {
      this.grupoProductoService.enviar(this.grupoProducto.id);
    } else {
      Swal.fire(constantes.error, "Selecciona un Grupo de Producto", constantes.error_swal);
    }
  }

  eliminar(grupo_producto: GrupoProducto) {
    this.grupoProductoService.eliminar(grupo_producto).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.grupoProducto = res.resultado as GrupoProducto
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminarLeer(event: any) {
    if (event != null)
      event.preventDefault();
    this.grupoProductoService.eliminar(this.grupoProducto).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.consultarGrupoProductos();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarGrupoProductos() {
    this.grupoProductoService.consultar().subscribe(
      res => {
        this.gruposProductos = res.resultado as GrupoProducto[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  async consultarAsync() {
    await this.grupoProductoService.consultarAsync().then(
      res => {
        this.gruposProductos = res.resultado as GrupoProducto[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  llenarDataSourceGrupoProducto(grupos_productos: GrupoProducto[]) {
    this.dataSourceGrupoProducto = new MatTableDataSource(grupos_productos);
    this.dataSourceGrupoProducto.filterPredicate = (data: GrupoProducto, filter: string): boolean =>
      data.codigo.toUpperCase().includes(filter) || data.grupo.toUpperCase().includes(filter) || data.subgrupo.toUpperCase().includes(filter) ||
      data.seccion.toUpperCase().includes(filter) || data.linea.toUpperCase().includes(filter) || data.sublinea.toUpperCase().includes(filter) || data.presentacion.toUpperCase().includes(filter);
    this.dataSourceGrupoProducto.paginator = this.paginator;
    this.dataSourceGrupoProducto.sort = this.sort;
  }

  seleccion(event: any) {
    //console.log(event.grupoProductoSeleccionado);
    this.grupoProducto = event.grupoProductoSeleccionado as GrupoProducto;
    if (this.grupoProducto.id != 0) {
      this.llenarGrupoProducto();
      this.inhabilitarControles();
      this.editarGrupoProducto = false;
    } else {
      this.limpiar();
    }
    //console.log(this.grupoProducto.codigo);
  }

  llenarGrupoProducto() {
    console.log(this.categoriasProductos[0]);
    this.grupoProducto.categoriaProducto = this.categoriasProductos[0]; //Aumentar en la base de datos
    this.controlGrupo.setValue(this.grupoProducto.grupo);
    this.controlSubgrupo.setValue(this.grupoProducto.subgrupo);
    this.controlSeccion.setValue(this.grupoProducto.seccion);
    this.controlLinea.setValue(this.grupoProducto.linea);
    this.controlSublinea.setValue(this.grupoProducto.sublinea);
  }

  buscar(event: any) {
    if (event != null)
      event.preventDefault();
    this.grupoProductoService.buscar(this.grupoProductoBuscar).subscribe(
      res => {
        this.gruposProductos = res.resultado as GrupoProducto[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  inhabilitarControles(){
    this.controlGrupo.disable();
    this.controlSubgrupo.disable();
    this.controlSeccion.disable();
    this.controlLinea.disable();
    this.controlSublinea.disable();
    this.deshabilitarPresentacion = true;
  }

  habilitarControles(){
    this.controlGrupo.enable();
    this.controlSubgrupo.enable();
    this.controlSeccion.enable();
  }

  validarCategoria() {
    if (this.grupoProducto.categoriaProducto.id == 1) { // Si categoria en = Bien
      this.controlLinea.enable();
      this.controlSublinea.enable();
      this.deshabilitarPresentacion = false;
    } else {
      this.controlLinea.disable();
      this.controlSublinea.disable();
      this.deshabilitarPresentacion = true;
    }
  }

  // Para el buscador de la tabla
  filtroGrupoProducto(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGrupoProducto.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceGrupoProducto.paginator) {
      this.dataSourceGrupoProducto.paginator.firstPage();
    }
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
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
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }

  async consultarGruposAsync() {
    await this.grupoProductoService.consultarGruposAsync().then(
      res => {
        this.grupos = res.resultado as string[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
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
    if (this.controlGrupo.value != null) {
      this.grupoProducto.grupo = this.controlGrupo.value.toUpperCase();
    }
    await this.grupoProductoService.consultarSubgruposAsync(this.grupoProducto.grupo).then(
      res => {
        this.subgrupos = res.resultado as string[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.borrar('grupo');
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
    if (this.controlSubgrupo.value != null) {
      this.grupoProducto.subgrupo = this.controlSubgrupo.value.toUpperCase();
    }
    await this.grupoProductoService.consultarSeccionesAsync(this.grupoProducto.grupo, this.grupoProducto.subgrupo).then(
      res => {
        this.secciones = res.resultado as string[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.borrar('subgrupo');
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
    if (this.controlSeccion.value != null) {
      this.grupoProducto.seccion = this.controlSeccion.value.toUpperCase();
    }
    await this.grupoProductoService.consultarLineasAsync(this.grupoProducto.grupo, this.grupoProducto.subgrupo, this.grupoProducto.seccion).then(
      res => {
        this.lineas = res.resultado as string[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.borrar('seccion');
    //this.consultarMovimientoContable();
  }

  consultarMovimientoContable() {
    this.grupoProductoService.consultarMovimientoContable(this.grupoProducto.grupo, this.grupoProducto.subgrupo, this.grupoProducto.seccion).subscribe(
      res => {
        //this.grupo_producto.movimiento_contable = res.resultado as MovimientoContable;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
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
    if (this.controlLinea.value != null) {
      this.grupoProducto.linea = this.controlLinea.value.toUpperCase();
    }
    await this.grupoProductoService.consultarSublineasAsync(this.grupoProducto.grupo, this.grupoProducto.subgrupo, this.grupoProducto.seccion, this.grupoProducto.linea).then(
      res => {
        this.sublineas = res.resultado as string[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.borrar('linea');
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
    if (this.controlSublinea.value != null) {
      this.grupoProducto.sublinea = this.controlSublinea.value.toUpperCase();
    }
    await this.grupoProductoService.consultarPresentacionesAsync(this.grupoProducto.grupo, this.grupoProducto.subgrupo, this.grupoProducto.seccion, this.grupoProducto.linea, this.grupoProducto.sublinea).then(
      res => {
        this.presentaciones = res.resultado as string[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.borrar('sublinea');
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