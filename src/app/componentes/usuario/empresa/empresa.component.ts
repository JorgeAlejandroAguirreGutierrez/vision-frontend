import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { valores, validarSesion, mensajes, imagenes, otras, exito, exito_swal, error, error_swal } from '../../../constantes';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { ImagenService } from '../../../servicios/administracion/imagen.service'

import { Empresa } from '../../../modelos/usuario/empresa';
import { EmpresaService } from '../../../servicios/usuario/empresa.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})

export class EmpresaComponent implements OnInit {

  si: string = valores.si;
  no: string = valores.no;
  activo: string = valores.estadoActivo;
  inactivo: string = valores.estadoInactivo;

  certificado = null;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  ocultarContrasena: boolean = true;
  deshabilitarIdentificacion: boolean = false;
  perfilAdministrador: boolean = false;

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();

  empresas: Empresa[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Empresa) => `${row.codigo}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificacion', celda: (row: Empresa) => `${row.identificacion}` },
    { nombreColumna: 'razonSocial', cabecera: 'Razon Social', celda: (row: Empresa) => `${row.razonSocial}` },
    { nombreColumna: 'nombreComercial', cabecera: 'Nombre Comercial', celda: (row: Empresa) => `${row.nombreComercial}` },
    { nombreColumna: 'obligado', cabecera: 'Oblig.', celda: (row: Empresa) => `${row.obligadoContabilidad}` },
    { nombreColumna: 'especial', cabecera: 'Espec.', celda: (row: Empresa) => `${row.especial}` },
    { nombreColumna: 'retencion', cabecera: 'Ag. Ret.', celda: (row: Empresa) => `${row.agenteRetencion}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Empresa) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Empresa>;
  clickedRows = new Set<Empresa>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private router: Router, private imagenService: ImagenService,
    private sesionService: SesionService, private empresaService: EmpresaService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa.logo64 = imagenes.logo_empresa;
    this.validarPerfil();
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
    this.empresa = new Empresa();
    this.empresa.logo64 = imagenes.logo_empresa;
    this.deshabilitarIdentificacion = false;
    this.clickedRows.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.empresaService.crear(this.empresa).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.empresa = res.resultado as Empresa;
        this.subirCertificado();
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
    this.empresaService.actualizar(this.empresa).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.empresa = res.resultado as Empresa;
        this.subirCertificado();
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.empresaService.activar(this.empresa).subscribe({
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
    this.empresaService.inactivar(this.empresa).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.empresaService.consultar().subscribe({
      next: res => {
        this.empresas = res.resultado as Empresa[];
        if (!this.perfilAdministrador) {
          this.empresas = this.empresas.filter(empresa => empresa.identificacion.includes(this.sesion.empresa.identificacion));
        }
        this.llenarTabla(this.empresas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(empresas: Empresa[]) {
    this.dataSource = new MatTableDataSource(empresas);
    this.dataSource.filterPredicate = (data: Empresa, filter: string): boolean =>
      data.identificacion.includes(filter) || data.razonSocial.includes(filter) || data.nombreComercial.includes(filter) ||
      data.obligadoContabilidad.includes(filter) || data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  seleccion(empresa: Empresa) {
    if (!this.clickedRows.has(empresa)) {
      this.clickedRows.clear();
      this.clickedRows.add(empresa);
      this.empresa = { ...empresa };
      this.deshabilitarIdentificacion = true;
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

  capturarLogo(event: any): any {
    const archivoCapturado = event.target.files[0];
    this.imagenService.convertirBase64(archivoCapturado).then((imagen: any) => {
      this.empresa.logo64 = imagen.base64;
      //console.log(this.empresa.logo64);
    });
  }

  capturarCertificado(event: any): any {
    this.certificado = event.target.files[0];
    this.empresa.certificado = this.certificado.name;
  }

  subirCertificado(): any {
    if (this.certificado != null) {
      this.empresaService.subirCertificado(this.empresa.id, this.certificado).subscribe({
        next: (res) => {
          this.empresa = res.resultado as Empresa;
        },
        error: (err) => {
          Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
        }
      });
    }
  }

  //VALIDACIONES
  validarPerfil() {
    if (this.sesion.usuario.perfil.abreviatura == 'ADM') {
      this.perfilAdministrador = true;
    }
  }

  validarIdentificacion() {
    this.empresaService.validarIdentificacion(this.empresa.identificacion).subscribe({
      next: (res) => {
        this.empresa = res.resultado as Empresa;
        this.empresa.logo64 = imagenes.logo_empresa;
      },
      error: (err) => {
        this.empresa = new Empresa();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  validarFormulario(): boolean {
    if (this.empresa.identificacion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.empresa.tipoIdentificacion == null || this.empresa.tipoIdentificacion.descripcion != otras.tipoIdentificacionRUC) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_ruc });
      return false;
    }
    if (this.empresa.razonSocial == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.empresa.nombreComercial == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.empresa.direccion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.empresa.logo64 == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_imagen });
      return false;
    }
    return true;
  }
}