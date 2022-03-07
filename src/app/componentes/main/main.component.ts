import { Component, OnInit } from '@angular/core';
import { TabService } from "../services/tab.service";
import { SidebarService } from '../../componentes/services/sidebar.service';
import { SidebarItemsService } from '../../componentes/services/sidebaritems.service';
import { Tab } from "../../modelos/tab.model";
import { MenuComponent } from '../menu/menu.component';
import { SidebarItem } from "../../modelos/sidebar-item.model";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  tabs = new Array<Tab>();
  tabs1 = new Array<Tab>();

  tabsGroup = new Array<any>();

  selectedTab: number = 0;
  selectedTab1: number = 0;
  istabMenu: boolean = true;

  selectedTabGroup: Array<number> = [];

  asideVisible: boolean;
  claseExpandirTabSec: string;

  title: string = "Cliente";
  title1: string = "Cliente1";

  opciones = new Array<SidebarItem>();

  constructor(private tabService: TabService, private sidebarService: SidebarService, private sidebaritemsService: SidebarItemsService) { }

  ngOnInit() {
    this.tabService.addNewTab1(MenuComponent, 'MENU');
    //una vez que te suscribes al evento observable tabSub se sigue recibiendo los tabs1 del tab.Service
    //para desuscribirse se necesita un evento take   
    this.tabService.tabSub1.subscribe(tabs1 => {
      this.tabs1 = tabs1;
      //devuelve el índice del primer elemento de un array que cumpla con la función de prueba proporcionada
      this.selectedTab1 = tabs1.findIndex(tab1 => tab1.active);
    });
    //Se suscribe al tab Interior
    this.tabService.tabSub.subscribe(tabs => {
      this.tabs = tabs;
      this.selectedTab = tabs.findIndex(tab => tab.active);
    });
    // Se subscribe al tabGroup
    this.tabService.tabsGroupSub.subscribe(tabsGroup => {
      this.tabsGroup = tabsGroup;
      for (let i = 0; i < this.tabs1.length - 1; i++) {
        this.selectedTabGroup[i] = tabsGroup[i].findIndex(tab => tab.active);
      }
    });
    // Se subscribe para ver el estado del tab
    this.sidebarService.sidebarVisibilityChange.subscribe(value => {
      this.asideVisible = value;
      this.claseExpandirTabSec = this.asideVisible ? 'tam-sm':'tam-lg';
    });
  }

  // pinned-sidebar: clase true para la pantalla grande; toggeled-sidebar: clase true pantalla pequeña
  getClasses() {
    var sideBarEstado = this.sidebarService.getSidebarStat();
    const classes = {
      'pinned-sidebar': sideBarEstado.isSidebarPinned,
      'toggeled-sidebar': sideBarEstado.isSidebarToggeled,
    }
    return classes;
  }

  //El Tab se refiere al tab interno, es decir el secundario, relacionado al sideBar 
  public tabChanged(event) {
    //console.log("tab interno changed");
    this.tabService.activarTab(event);
  }

  //El Tab1 se refiere al tab externo, es decir al principal
  public tabChanged1(event) {
    //console.log("Cambió el tab externo");
    this.istabMenu = event.index == 0 ? true : false; 
    this.tabService.activarTab1(event);
    // Carga las opciones en el slide bar de acuerdo al titulo de la pestaña
    this.opciones = this.sidebaritemsService.menuOpciones(this.tabs1[event.index].title);
  }

  removeTab(index: number): void {
    this.tabService.removeTab(index);
    this.tabService.indexarTab();
  }

  removeTab1(index: number): void {
    this.tabService.removeTab1(index);
    this.tabService.indexarTab1();
    this.opciones = this.sidebaritemsService.menuOpciones(this.tabs1[this.selectedTab1].title);
  }

}
