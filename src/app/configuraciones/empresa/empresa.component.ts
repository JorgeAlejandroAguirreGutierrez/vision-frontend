import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../servicios/empresa.service';
import { Empresa } from '../../modelos/empresa';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  empresa= new Empresa();
  empresas: Empresa[];
  pEmpresa= new Empresa();

  constructor(private empresaService: EmpresaService) { }

  ngOnInit() {
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
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.empresa=res.resultado as Empresa;
        this.ngOnInit();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(empresa: Empresa) {
    this.empresaService.actualizar(empresa).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.empresa=res.resultado as Empresa;
        this.ngOnInit();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminar(empresa: Empresa) {
    this.empresaService.eliminar(empresa).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.empresa=res.resultado as Empresa;
        this.ngOnInit();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  seleccion(empresa: Empresa) {
    
  }

}
