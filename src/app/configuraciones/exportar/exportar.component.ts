import { Component, OnInit } from '@angular/core';
import { Modelo } from '../../modelos/administracion/modelo';
import { ModeloService } from '../../servicios/administracion/modelo.service';
import Swal from 'sweetalert2';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
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
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultaModelos();
  }
  consultaModelos(){
    this.modeloService.consultar().subscribe(
      res => {
        if (res.resultado!=null) {
          this.modelos = res.resultado as Modelo[]
        }
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  exportar(){
    this.modeloService.exportar(this.modelo).subscribe(
      res => {
        if (res.resultado!=null && res.resultado) {
          Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        } else{
          Swal.fire({ icon: error_swal, title: error, text: res.mensaje });
        }
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

}
