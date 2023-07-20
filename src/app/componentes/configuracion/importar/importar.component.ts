import { Component, OnInit } from '@angular/core';
import { ModeloService } from '../../../servicios/administracion/modelo.service';
import { Modelo } from '../../../modelos/administracion/modelo';
import Swal from 'sweetalert2';
import { valores, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/usuario/sesion';

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.scss']
})
export class ImportarComponent implements OnInit {

  modelos: Modelo[]=[];
  modelo: Modelo= new Modelo();
  archivo: File= null;
  cargando: boolean=false;
  sesion: Sesion;

  constructor(private modeloService: ModeloService, private sesionService: SesionService,private router: Router) { }

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
  cargarArchivo(archivos: FileList){
    this.archivo = archivos.item(0);
  }
  importar(){
    this.cargando=true;
    this.modeloService.importar(this.archivo, this.modelo).subscribe(
      res => {
        if (res.resultado!=null && res.resultado) {
          Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        } else{
          Swal.fire({ icon: error_swal, title: error, text: res.mensaje });
        }
        this.cargando=false;
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.cargando=false;
      }
    );
  }
}
