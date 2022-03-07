import { Component, OnInit } from '@angular/core';
import { Type } from '@angular/core';
import { TabService } from "../services/tab.service";
import { MainComponent } from "../main/main.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

 
  constructor(public tabService: TabService, public mainComponent: MainComponent) { }

  ngOnInit() {

  }

  abrirItem(componente: Type<any>, tabTitulo: string){
    this.tabService.addNewTab(componente, tabTitulo);
  }
}
