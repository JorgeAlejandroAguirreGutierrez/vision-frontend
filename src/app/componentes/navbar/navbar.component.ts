import { SidebarService } from '../../componentes/services/sidebar.service';
import { Component, OnInit, Input } from '@angular/core';
import { EmpresaService } from '../../servicios/usuario/empresa.service';
import { Empresa } from '../../modelos/usuario/empresa';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() istabMenu:boolean;
  url_logo: string = "";
  nombre_empresa: string = "";

  constructor(private sidebarService: SidebarService, private empresaService: EmpresaService) { }
  isCollapsed = true;


  ngOnInit() {
    this.obtenerEmpresa();

  }

  obtenerEmpresa() {
    let empresaId = 1;
    this.empresaService.obtener(empresaId).subscribe(
      res => {
        let empresa = res.resultado as Empresa
        this.url_logo = environment.prefijoUrlImagenes + "logos/" + empresa.logo;
        this.nombre_empresa = empresa.razonSocial;
      }
    );
  }

  get isSidebarVisible(): boolean {
    return this.sidebarService.isSidebarVisible;
  }

  toggleSidebarPin() {
    this.sidebarService.toggleSidebarPin();
    this.sidebarService.toggleSidebarVisibility();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
    this.sidebarService.toggleSidebarVisibility();
  }

}
