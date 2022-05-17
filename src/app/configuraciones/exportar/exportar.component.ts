import { Component, OnInit } from '@angular/core';
import { Modelo } from '../../modelos/modelo';
import { ModeloService } from '../../servicios/modelo.service';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import { Sesion } from 'src/app/modelos/sesion';
import * as util from '../../util';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html',
  styleUrls: ['./exportar.component.scss']
})
export class ExportarComponent implements OnInit {

  modelos: Modelo[]=[];
  modelo: Modelo= new Modelo();
  sesion: Sesion;
  constructor(private modeloService: ModeloService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultaModelos();
  }
  consultaModelos(){
    this.modeloService.consultar().subscribe(
      res => {
        if (res.resultado!=null) {
          this.modelos = res.resultado as Modelo[]
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  exportar(){
    this.modeloService.exportar(this.modelo).subscribe(
      res => {
        if (res.resultado!=null && res.resultado) {
          Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        } else{
          Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: res.mensaje });
        }
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

}
