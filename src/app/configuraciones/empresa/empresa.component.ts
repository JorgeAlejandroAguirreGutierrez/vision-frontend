import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../servicios/empresa.service';
import { Empresa } from '../../modelos/empresa';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/sesion';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  empresa= new Empresa();
  empresas: Empresa[];
  pEmpresa= new Empresa();
  sesion: Sesion;

  constructor(private sesionService: SesionService, private router: Router, private empresaService: EmpresaService) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.empresaService.consultar().subscribe(
      res=>this.empresas=res.resultado as Empresa[]
    );
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.empresaService.crear(this.empresa).subscribe(
      res => {
        console.log(res);
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.empresa=res.resultado as Empresa;
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(empresa: Empresa) {
    this.empresaService.actualizar(empresa).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.empresa=res.resultado as Empresa;
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(empresa: Empresa) {
    this.empresaService.eliminar(empresa).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.empresa=res.resultado as Empresa;
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(empresa: Empresa) {
    
  }

}
