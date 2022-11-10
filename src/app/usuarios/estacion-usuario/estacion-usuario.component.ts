import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { Usuario } from '../../modelos/usuario/usuario';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Empresa } from '../../modelos/usuario/empresa';
import { EmpresaService } from '../../servicios/usuario/empresa.service';
import { EstablecimientoService } from '../../servicios/usuario/establecimiento.service';
import { Establecimiento } from '../../modelos/usuario/establecimiento';
import { Estacion } from '../../modelos/usuario/estacion';
import { EstacionService } from '../../servicios/usuario/estacion.service';
import { EstacionUsuario } from '../../modelos/usuario/estacion-usuario';
import { EstacionUsuarioService } from '../../servicios/usuario/estacion-usuario.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estacion-usuario',
  templateUrl: './estacion-usuario.component.html',
  styleUrls: ['./estacion-usuario.component.scss']
})
export class EstacionUsuarioComponent implements OnInit {

  sesion: Sesion=null;
  verBotones: boolean = false;
  abrirPanelAsignarEstacion: boolean = true;
  deshabilitarEditarEstacion: boolean = true;
  deshabilitarFiltroEstaciones: boolean = true;
  verActualizarEstacion: boolean = false;
  verActualizarUsuario: boolean = false;

  usuario: Usuario = new Usuario();
  estacion: Estacion = new Estacion();
  estacionUsuario: EstacionUsuario = new EstacionUsuario();

  codigoEquivalente: string = "";
  empresas: Empresa[];
  establecimientos: Establecimiento[];

  estacionUsuarios: EstacionUsuario[] = [];
  empresa: Empresa = new Empresa();
  establecimiento: Establecimiento = new Establecimiento();

  //Variables para los autocomplete
  usuarios: Usuario[]=[];
  controlUsuario = new UntypedFormControl();
  filtroUsuarios: Observable<Usuario[]> = new Observable<Usuario[]>();

  estaciones: Estacion[] = [];
  controlEstacion = new UntypedFormControl();
  filtroEstaciones: Observable<Estacion[]> = new Observable<Estacion[]>();

  @ViewChild("inputFiltroEstacionUsuario") inputFiltroEstacionUsuario: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnasEstacionUsuario: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: EstacionUsuario) => `${row.estacion.id}`},
    { nombreColumna: 'codigo_propio', cabecera: 'Código propio', celda: (row: EstacionUsuario) => `${row.estacion.codigo}`},
    { nombreColumna: 'estacion', cabecera: 'Estación', celda: (row: EstacionUsuario) => `${row.estacion.descripcion}`},
    //{ nombreColumna: 'codigo_local', cabecera: 'Código local', celda: (row: ProductoProveedor) => `${row.proveedor.codigo}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: EstacionUsuario) => `${row.estado}`},
    { nombreColumna: 'acciones', cabecera: 'Acciones', celda: (row: any) => ''}
  ];
  cabeceraEstacionUsuario: string[]  = this.columnasEstacionUsuario.map(titulo => titulo.nombreColumna);
  dataSourceEstacionUsuario: MatTableDataSource<EstacionUsuario>;
  clickedRowsEstacionUsuario = new Set<EstacionUsuario>();
  
  constructor(private renderer: Renderer2, private sesionService: SesionService, private usuarioService: UsuarioService, private empresaService: EmpresaService, 
    private establecimientoService: EstablecimientoService, private estacionService: EstacionService, private estacionUsuarioService: EstacionUsuarioService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.controlEstacion.disable();
    this.consultarEmpresas();
    this.consultarUsuarios();
    //this.consultarProveedores();
    this.consultarEstaciones();
    this.filtroUsuarios = this.controlUsuario.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(usuario => typeof usuario === 'string' ? this.filtroUsuario(usuario) : this.usuarios.slice())
      );

    this.filtroEstaciones = this.controlEstacion.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(estacion => typeof estacion === 'string' ? this.filtroEstacion(estacion) : this.estaciones.slice())
      );
  }

  limpiar(){
    this.usuario = new Usuario();
    this.abrirPanelAsignarEstacion = true;
    this.deshabilitarFiltroEstaciones = true;
    this.controlEstacion.disable();
    this.verBotones = false;
    this.deshabilitarEditarEstacion = false;
    this.verActualizarUsuario = false;
    this.controlUsuario.patchValue('');
    this.estacionUsuario = new EstacionUsuario();
    this.estacionUsuarios = [];
    this.limpiarEstacion();
    this.dataSourceEstacionUsuario = new MatTableDataSource();
    this.clickedRowsEstacionUsuario = new Set<EstacionUsuario>();
    this.borrarFiltroEstacionUsuario();
  };

  actualizarUsuario(event: any){
    if (event!=null)
      event.preventDefault();
    if (this.usuario.nombre == valores.vacio) {
        Swal.fire(error, mensajes.error_nombre_producto, error_swal);
        return;
    }
    console.log(this.usuario);
    //this.producto.kardexs[0].proveedor = new Proveedor;
    this.usuarioService.actualizar(this.usuario).subscribe({
      next: (res) => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
        //this.consultar();
      },
      error: (err) => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  consultarUsuarios() {
    this.usuarioService.consultar().subscribe({
      next: (res) => {
        this.usuarios = res.resultado as Usuario[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }
  private filtroUsuario(value: string): Usuario[] {
    if(this.usuarios.length>0) {
      const filterValue = value.toLowerCase();
      return this.usuarios.filter(usuario => usuario.nombre.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verUsuario(usuario: Usuario): string {
    return usuario && usuario.nombre ? usuario.nombre : '';
  }
  seleccionarUsuario(){
    this.usuario = this.controlUsuario.value as Usuario;
    //this.productoProveedores = this.usuario.productosProveedores;
    this.verBotones = true;
    this.controlEstacion.enable();
    this.deshabilitarEditarEstacion = false;
    if (this.estacionUsuarios.length > 0) {
      this.llenarDataSourceEstacionUsuario(this.estacionUsuarios);
    }
  }

  // CODIGO PARA PROVEEDOR
  limpiarEstacion(){
    this.estacion = new Estacion();
    this.controlEstacion.patchValue("");
    this.controlEstacion.enable();
    this.deshabilitarEditarEstacion = false;
    this.codigoEquivalente = "";
    this.verActualizarEstacion = false;
    this.clickedRowsEstacionUsuario.clear();
  }

  agregarEstacionUsuario(){
    let existe: boolean;
    existe = this.existeEstacionUsuario();
    if (existe) {
      Swal.fire(error, mensajes.error_producto_proveedor, error_swal);
      return;
    }
    this.estacionUsuario = new EstacionUsuario();
    this.estacionUsuario.usuario.id = this.usuario.id
    this.estacionUsuario.estacion = this.estacion;
    //this.estacionUsuario.codigoEquivalente = this.codigoEquivalente;
    this.estacionUsuarios.push(this.estacionUsuario);
    //this.usuario.productosProveedores = this.productoProveedores;
    this.llenarDataSourceEstacionUsuario(this.estacionUsuarios);
    this.verActualizarUsuario = true;
    this.limpiarEstacion();
  }

  llenarDataSourceEstacionUsuario(estacionUsuarios : EstacionUsuario[]){
    this.dataSourceEstacionUsuario = new MatTableDataSource(estacionUsuarios);
    this.dataSourceEstacionUsuario.filterPredicate = (data: EstacionUsuario, filter: string): boolean =>
      data.estacion.codigo.toUpperCase().includes(filter) || data.estacion.descripcion.toUpperCase().includes(filter) ||
      data.estacion.estado.toUpperCase().includes(filter);
    this.dataSourceEstacionUsuario.paginator = this.paginator;
    this.dataSourceEstacionUsuario.sort = this.sort;
  }

  filtroEstacionUsuario(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEstacionUsuario.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceEstacionUsuario.paginator) {
      this.dataSourceEstacionUsuario.paginator.firstPage();
    }
  }
  borrarFiltroEstacionUsuario(){
    this.renderer.setProperty(this.inputFiltroEstacionUsuario.nativeElement, 'value', '');
    //Funciona, pero es mala práctica
    //this.inputFiltroProductoProveedor.nativeElement.value = '';
    this.dataSourceEstacionUsuario.filter = '';
  }

  seleccionEstacionUsuario(estacionUsuarioSeleccionado: EstacionUsuario) {
      if (!this.clickedRowsEstacionUsuario.has(estacionUsuarioSeleccionado)){
        this.limpiarEstacion();
        this.construirEstacionUsuario(estacionUsuarioSeleccionado);
      } else {
        this.limpiarEstacion();  
    }
  }

  construirEstacionUsuario(estacionUsuarioSeleccionado: EstacionUsuario) {
    //this.productoProveedorService.currentMessage.subscribe(message => productoProveedorId = message);
    if (estacionUsuarioSeleccionado.estacion.id != 0) {
      this.clickedRowsEstacionUsuario.add(estacionUsuarioSeleccionado);
      this.estacionUsuario = estacionUsuarioSeleccionado;
      this.estacion = this.estacionUsuario.estacion;
      //this.controlProveedor.patchValue(this.proveedor.razonSocial);
      this.controlEstacion.patchValue({descripcion: this.estacion.descripcion});
      this.controlEstacion.disable();
      //this.codigoEquivalente = this.estacionUsuario.codigoEquivalente;
      this.deshabilitarEditarEstacion = true;
      //this.actualizar_precios();
    }
  }

  existeEstacionUsuario():boolean{
    for (let i = 0; i < this.usuario.estacionesUsuarios.length; i++) {
      if (this.estacion.id == this.usuario.estacionesUsuarios[i].estacion.id){
        return true;
      }
    }
    return false;
  }

  editarEstacionUsuario(){
    this.verActualizarEstacion = true;
    this.deshabilitarEditarEstacion = false;
  }
  
  actualizarEstacionUsuario(){
    //this.productoProveedor.codigoEquivalente = this.codigoEquivalente;
    this.verActualizarUsuario = true;
    this.limpiarEstacion();
  }

  eliminarUsuario(event: any, i:number) {
    if (event != null)
    event.preventDefault();
    this.estacionUsuarios.splice(i, 1);
    this.llenarDataSourceEstacionUsuario(this.estacionUsuarios);
    //this.producto.productosProveedores = this.productoProveedores;
    if (confirm("Realmente quiere eliminar la estación del usuario?")) {
    this.estacionUsuarioService.eliminar(this.estacionUsuario).subscribe({
      next: (res) => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        //this.consultar();
      },
      error: (err) => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
    }
  }

  // Metodos para los autocomplete
  consultarProveedores(){
    this.estacionService.consultar().subscribe(
      res => {
        this.estaciones = res.resultado as Estacion[];
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }
  private filtroEstacion(value: string): Estacion[] {
    if(this.usuarios.length>0) {
      const filterValue = value.toLowerCase();
      return this.estaciones.filter(estacion => estacion.descripcion.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verProveedor(estacion: Estacion): string {
    return estacion && estacion.descripcion ? estacion.descripcion : '';
  } 
  seleccionarEstacion(){
    this.estacion = this.controlEstacion.value as Estacion;
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  consultarEmpresas() {
    this.empresaService.consultar().subscribe({
      next: (res) => {
        this.empresas = res.resultado as Empresa[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  consultarEstaciones(){
    this.estacionService.consultar().subscribe(
      res => {
        //Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.estaciones=res.resultado as Estacion[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarEstablecimientos(establecimientoId: number) {
    //this.establecimiento.ubicacion.provincia = provincia;
    //this.establecimientoService.obtener(establecimientoId).subscribe({
    this.establecimientoService.consultar().subscribe({
      next: res => {
        console.log("estable");
        if (res.resultado != null) {
          this.establecimientos = res.resultado as Establecimiento[];
        } else {
          Swal.fire(error, res.mensaje, error_swal);
        }
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
}
