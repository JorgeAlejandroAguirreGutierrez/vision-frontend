import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/sesion';
import { SesionService } from '../../../servicios/sesion.service';
import Swal from 'sweetalert2';
import { TabService } from "../../../componentes/services/tab.service";
import { EmpresaComponent } from '../empresa.component';
import { EmpresaService } from '../../../servicios/empresa.service';
import { Empresa } from '../../../modelos/empresa';
import * as constantes from '../../../constantes';


@Component({
  selector: 'app-empresa-leer',
  templateUrl: './empresa-leer.component.html',
  styleUrls: ['./empresa-leer.component.scss']
})
export class EmpresaLeerComponent implements OnInit {

  collapsed = true;
  ComponenteEmpresa: Type<any> = EmpresaComponent;

  sesion: Sesion;

  constructor(private empresaService: EmpresaService, private tabService: TabService,
    private sesionService: SesionService, private router: Router) { }

  empresas: Empresa[];
  empresa: Empresa;
  empresaBuscar: Empresa = new Empresa();


  ngOnInit() {
    this.consultar();
    this.sesion = this.sesionService.getSesion();
  }

  consultar() {
    this.empresaService.consultar().subscribe(
      res => {
        this.empresas = res.resultado as Empresa[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event) {
    if (event != null)
      event.preventDefault();
    this.empresaService.buscar(this.empresaBuscar).subscribe(
      res => {
        this.empresas = res.resultado as Empresa[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccion(empresa: Empresa) {
    this.empresa = empresa;
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (this.empresa != null) {
      this.empresaService.enviar(this.empresa.id);
      this.tabService.addNewTab(this.ComponenteEmpresa, 'Actualizar Empresa');
    } else {
      Swal.fire('Error', "Selecciona un Estado Civil", 'error');
    }
  }

  eliminar(event) {
    if (event != null)
      event.preventDefault();
    this.empresaService.eliminar(this.empresa).subscribe(
      res => {
        Swal.fire('Exito', res.mensaje, 'success');
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  cambiarBuscarCodigo() {
    this.buscar(null);
  }

  cambiarBuscarIdentificacion() {
    this.buscar(null);
  }

  cambiarBuscarRazonSocial() {
    this.buscar(null);
  }

}
