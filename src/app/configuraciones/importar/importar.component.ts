import { Component, OnInit } from '@angular/core';
import { ModeloService } from '../../servicios/modelo.service';
import { Modelo } from '../../modelos/modelo';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';

@Component({
  selector: 'app-importar',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.scss']
})
export class ImportarComponent implements OnInit {

  constructor(private modeloService: ModeloService) { }

  modelos: Modelo[]=[];
  modelo: Modelo= new Modelo();
  archivo: File= null;

  cargando: boolean=false;

  ngOnInit() {
    this.consultaModelos();
  }

  consultaModelos(){
    this.modeloService.consultar().subscribe(
      res => {
        if (res.resultado!=null) {
          this.modelos = res.resultado as Modelo[]
        }
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
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
            Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        } else{
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal)
        }
        this.cargando=false;
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
        this.cargando=false;
      }
    );
  }
}
