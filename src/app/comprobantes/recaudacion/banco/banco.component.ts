import { Component, OnInit, HostListener } from '@angular/core';
import { TabService } from '../../../componentes/services/tab.service';
import Swal from 'sweetalert2';
import * as constantes from '../../../constantes';
import * as util from '../../../util';
import { Banco } from '../../../modelos/banco';
import { BancoService } from '../../../servicios/banco.service';
import { Sesion } from 'src/app/modelos/sesion';
import { Router } from '@angular/router';
import { SesionService } from 'src/app/servicios/sesion.service';

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.scss']
})
export class BancoComponent implements OnInit {

  banco= new Banco();
  sesion: Sesion=null;

  constructor(private sesionService: SesionService, private router: Router, private tabService: TabService,private bancoService: BancoService) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.construirBanco();
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.banco = new Banco();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.bancoService.crear(this.banco).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.banco=res.resultado as Banco;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.bancoService.actualizar(this.banco).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.banco=res.resultado as Banco;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(banco: Banco) {
    this.bancoService.eliminar(banco).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.banco=res.resultado as Banco
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  construirBanco() {
    let banco_id=0;
    this.bancoService.currentMessage.subscribe(message => banco_id = message);
    if (banco_id!= 0) {
      this.bancoService.obtener(banco_id).subscribe(
        res => {
          this.banco=res.resultado as Banco
          this.bancoService.enviar(0);
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 71) //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 78) //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 69) // SHIFT + E
      this.eliminar(null);
  }

}
