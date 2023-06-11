import { Component, OnInit, HostListener, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { GrupoProductoService } from '../../../servicios/inventario/grupo-producto.service';
import { GrupoProducto } from '../../../modelos/inventario/grupo-producto';
import { CuentaContable } from '../../../modelos/contabilidad/cuenta-contable';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriaProducto } from 'src/app/modelos/inventario/categoria-producto';
import { CategoriaProductoService } from 'src/app/servicios/inventario/categoria-producto.service';

@Component({
  selector: 'app-grupo-producto',
  templateUrl: './grupo-producto.component.html',
  styleUrls: ['./grupo-producto.component.scss']
})
export class GrupoProductoComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  editarGrupoProducto: boolean = true;
  deshabilitarPresentacion: boolean = false;
  verInputSeccion: boolean = false;

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  grupoProducto = new GrupoProducto();
  gruposProductos: GrupoProducto[];
  categoriasProductos: CategoriaProducto[];

  grupos: string[] = [];
  controlGrupo = new UntypedFormControl();
  filtroGrupos: Observable<string[]> = new Observable<string[]>();

  subgrupos: string[] = [];
  controlSubgrupo = new UntypedFormControl();
  filtroSubgrupos: Observable<string[]> = new Observable<string[]>();

  secciones: string[] = [];
  controlSeccion = new UntypedFormControl();
  filtroSecciones: Observable<string[]> = new Observable<string[]>();

  lineas: string[] = [];
  controlLinea = new UntypedFormControl();
  filtroLineas: Observable<string[]> = new Observable<string[]>();

  sublineas: string[] = [];
  controlSublinea = new UntypedFormControl();
  filtroSublineas: Observable<string[]> = new Observable<string[]>();

  columnas: any[] = [
    { nombreColumna: 'categoria', cabecera: 'Categoría', celda: (row: GrupoProducto) => `${row.categoriaProducto.descripcion}` },
    { nombreColumna: 'grupo', cabecera: 'Grupo', celda: (row: GrupoProducto) => `${row.grupo}` },
    { nombreColumna: 'subgrupo', cabecera: 'Subgrupo', celda: (row: GrupoProducto) => `${row.subgrupo}` },
    { nombreColumna: 'seccion', cabecera: 'Sección', celda: (row: GrupoProducto) => `${row.seccion}` },
    { nombreColumna: 'linea', cabecera: 'Línea', celda: (row: GrupoProducto) => `${row.linea}` },
    { nombreColumna: 'sublinea', cabecera: 'Sublínea', celda: (row: GrupoProducto) => `${row.sublinea}` },
    { nombreColumna: 'presentacion', cabecera: 'Presentación', celda: (row: GrupoProducto) => `${row.presentacion}` },
    { nombreColumna: 'cuenta', cabecera: 'Cuenta', celda: (row: GrupoProducto) => `${row.cuentaContable != null ? row.cuentaContable.cuenta : new CuentaContable()}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GrupoProducto) => `${row.estado}` },
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<GrupoProducto>;
  clickedRows = new Set<GrupoProducto>();

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

  constructor(private renderer: Renderer2, public dialog: MatDialog, private grupoProductoService: GrupoProductoService, private categoriaProductoService: CategoriaProductoService,
    private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.consultar();
    this.consultarGrupos();
    this.consultarCategoriasProductos();
    this.filtrosAutocomplete();
  }

  filtrosAutocomplete() {
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

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.grupoProducto = new GrupoProducto();
    this.controlGrupo.setValue(valores.vacio);
    this.controlSubgrupo.setValue(valores.vacio);
    this.controlSeccion.setValue(valores.vacio);
    this.controlLinea.setValue(valores.vacio);
    this.controlSublinea.setValue(valores.vacio);
    this.verInputSeccion = false;
    this.clickedRows.clear();
    this.grupoProducto.categoriaProducto.id = 1;
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.grupoProductoService.crear(this.grupoProducto).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
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
    this.grupoProductoService.actualizar(this.grupoProducto).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.grupoProductoService.activar(this.grupoProducto).subscribe({
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
    this.grupoProductoService.inactivar(this.grupoProducto).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.grupoProductoService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.gruposProductos = res.resultado as GrupoProducto[]
        this.llenarDataSource(this.gruposProductos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarDataSource(gruposProductos : GrupoProducto[]){
    this.dataSource = new MatTableDataSource(gruposProductos);
    this.dataSource.filterPredicate = (data: GrupoProducto, filter: string): boolean =>
      data.categoriaProducto.descripcion.includes(filter) || data.grupo.includes(filter) || data.subgrupo.includes(filter) ||
      data.seccion.includes(filter) || data.linea.includes(filter) || data.sublinea.includes(filter) || 
      data.presentacion.includes(filter) || data.cuentaContable.cuenta.includes(filter) || data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

consultarGrupos() {
    this.grupoProductoService.consultarPorEmpresaYEstado(this.empresa.id, valores.activo).subscribe({
      next: res => {
        this.grupos = res.resultado as string[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarCategoriasProductos() {
    this.categoriaProductoService.consultar().subscribe({
      next: res => {
        this.categoriasProductos = res.resultado as CategoriaProducto[];
        this.grupoProducto.categoriaProducto.id = 1;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccion(grupoProducto: GrupoProducto) {
    if (!this.clickedRows.has(grupoProducto)) {
      this.clickedRows.clear();
      this.clickedRows.add(grupoProducto);
      this.grupoProducto = { ...grupoProducto };
      this.llenarGrupoProducto();
    } else {
      this.nuevo(null);
    }
  }

  llenarGrupoProducto() {
    if (this.grupoProducto.categoriaProducto.id == 1){
      this.controlGrupo.setValue(this.grupoProducto.grupo);
      this.controlSubgrupo.setValue(this.grupoProducto.subgrupo);
      this.controlSeccion.setValue(this.grupoProducto.seccion);
      this.controlLinea.setValue(this.grupoProducto.linea);
      this.controlSublinea.setValue(this.grupoProducto.sublinea);
    } else {
      this.controlGrupo.setValue(this.grupoProducto.grupo);
      this.controlSubgrupo.setValue(this.grupoProducto.subgrupo);
      this.controlSeccion.setValue(this.grupoProducto.seccion);
    }
    this.validarCategoria();
  }

  validarCategoria() {
    if (this.grupoProducto.categoriaProducto.id == 1) { // Si categoria = Bien
      this.controlLinea.enable();
      this.controlSublinea.enable();
      this.deshabilitarPresentacion = false;
      this.verInputSeccion = false;
    } else {
      this.controlLinea.disable();
      this.controlSublinea.disable();
      this.deshabilitarPresentacion = true;
      this.verInputSeccion = true;
      this.borrarControles('seccion');
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

  // Metodos para los autocomplete
  private filtroGrupo(value: string): string[] {
    // Actua como que el valor digitado fuera el seleccionado
    this.seleccionarGrupo();
    if (this.grupos.length > 0) {
      return this.grupos.filter(grupo => grupo.includes(value));
    }
    return [];
  }
  async seleccionarGrupo() {
    if (this.controlGrupo.value != null) {
      await this.grupoProductoService.consultarSubgruposAsync(this.controlGrupo.value).then(
        res => {
          this.subgrupos = res.resultado as string[];
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );

      if (this.editarGrupoProducto) {
        if (this.controlGrupo.value != this.grupoProducto.grupo) {
          this.grupoProducto.grupo = this.controlGrupo.value;
          this.borrarControles('grupo');
        }
      }
    }
  }

  private filtroSubgrupo(value: string): string[] {
    this.seleccionarSubgrupo();
    if (this.subgrupos.length > 0) {
      return this.subgrupos.filter(subgrupo => subgrupo.includes(value));
    }
    return [];
  }
  async seleccionarSubgrupo() {
    if (this.controlSubgrupo.value != null) {
      await this.grupoProductoService.consultarSeccionesAsync(this.grupoProducto.grupo, this.controlSubgrupo.value).then(
        res => {
          this.secciones = res.resultado as string[];
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
    if (this.controlSubgrupo.value != null && this.editarGrupoProducto) {
      if (this.controlSubgrupo.value != this.grupoProducto.subgrupo) {
        this.grupoProducto.subgrupo = this.controlSubgrupo.value;
        this.borrarControles('subgrupo');
      }
    }
  }

  private filtroSeccion(value: string): string[] {
    this.seleccionarSeccion();
    if (this.secciones.length > 0) {
      return this.secciones.filter(seccion => seccion.includes(value));
    }
    return [];
  }
  async seleccionarSeccion() {
    if (this.controlSeccion.value != null) {
      await this.grupoProductoService.consultarLineasAsync(this.grupoProducto.grupo, this.grupoProducto.subgrupo, this.controlSeccion.value).then(
        res => {
          this.lineas = res.resultado as string[];
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
    if (this.controlSeccion.value != null && this.editarGrupoProducto) {
      if (this.controlSeccion.value != this.grupoProducto.seccion) {
        this.grupoProducto.seccion = this.controlSeccion.value;
        this.borrarControles('seccion');
      }
    }
  }

  private filtroLinea(value: string): string[] {
    this.seleccionarLinea();
    if (this.lineas.length > 0) {
      return this.lineas.filter(linea => linea.includes(value));
    }
    return [];
  }
  async seleccionarLinea() {
    if (this.controlLinea.value != null) {
      await this.grupoProductoService.consultarSublineasAsync(this.grupoProducto.grupo, this.grupoProducto.subgrupo, this.grupoProducto.seccion, this.controlLinea.value).then(
        res => {
          this.sublineas = res.resultado as string[];
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
    if (this.controlLinea.value != null && this.editarGrupoProducto) {
      if (this.controlLinea.value != this.grupoProducto.linea) {
        this.grupoProducto.linea = this.controlLinea.value;
        this.borrarControles('linea');
      }
    }
  }

  private filtroSublinea(value: string): string[] {
    this.seleccionarSublinea();
    if (this.sublineas.length > 0) {
      return this.sublineas.filter(sublinea => sublinea.includes(value));
    }
    return [];
  }
  seleccionarSublinea() {
    if (this.controlSublinea.value != null && this.editarGrupoProducto) {
      if (this.controlSublinea.value != this.grupoProducto.sublinea) {
        this.grupoProducto.sublinea = this.controlSublinea.value;
        this.borrarControles('sublinea');
      }
    }
  }

  borrarControles(controlModificado: string) {
    if (controlModificado == 'grupo') {
      this.controlSubgrupo.setValue('');
      this.grupoProducto.seccion = '';
      this.controlSeccion.setValue('');
      this.controlLinea.setValue('');
      this.controlSublinea.setValue('');
      this.grupoProducto.presentacion = "";
    }
    if (controlModificado == 'subgrupo') {
      this.grupoProducto.seccion = '';
      this.controlSeccion.setValue('');
      this.controlLinea.setValue('');
      this.controlSublinea.setValue('');
      this.grupoProducto.presentacion = "";
    }
    if (controlModificado == 'seccion') {
      this.controlLinea.setValue('');
      this.controlSublinea.setValue('');
      this.grupoProducto.presentacion = "";
    }
    if (controlModificado == 'linea') {
      this.controlSublinea.setValue('');
      this.grupoProducto.presentacion = "";
    }
    if (controlModificado == 'sublinea') {
      this.grupoProducto.presentacion = "";
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  validarFormulario(): boolean {
    //validar que los campos esten llenos antes de guardar
    if (this.grupoProducto.cuentaContable.cuenta == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.grupoProducto.categoriaProducto.id == 1){ //Si en Bien
      if (this.controlGrupo.value == valores.vacio || this.controlSubgrupo.value == valores.vacio || this.controlSeccion.value == valores.vacio) {
        Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
        return false;
      }
      if (this.controlLinea.value == valores.vacio || this.controlSublinea.value == valores.vacio || this.grupoProducto.presentacion == valores.vacio) {
        Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
        return false;
      } 
    } else { // Si es servicio o AF
      if (this.controlGrupo.value == valores.vacio || this.controlSubgrupo.value == valores.vacio || this.grupoProducto.seccion == valores.vacio) {
        Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
        return false;
      }
    }
    return true;
  }

  dialogoCuentasContables(): void {
    const dialogRef = this.dialog.open(DialogoGrupoProductoCuentaContableComponent, {
      width: '80%'
      //data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(this.grupoProducto.cuentaContable, result as CuentaContable);
      }
    });
  }
}

@Component({
  selector: 'dialogo-grupo-producto-cuenta-contable',
  templateUrl: 'dialogo-grupo-producto-cuenta-contable.component.html',
})
export class DialogoGrupoProductoCuentaContableComponent {

  constructor(public dialogRef: MatDialogRef<DialogoGrupoProductoCuentaContableComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: CuentaContable) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  cuentaContableSeleccionado(event: any) {
    this.data = event;
  }
} 