import { Component, Input, OnInit, ViewContainerRef } from "@angular/core";
//  ComponentFactoryResolver, ViewChild,

//import { ContentContainerDirective } from "./content-container.directive";
import { SkeletonComponent } from "./skeleton.component";
import { Tab } from "../../modelos/tab.model";

@Component({
  selector: "app-tab-content",
  template: "<ng-template content-container></ng-template>"
})

export class TabContentComponent implements OnInit {

  @Input() tab: Tab;
  //@ViewChild(ContentContainerDirective, { static: true })
  //contentContainer: ContentContainerDirective;

  constructor(private viewContainerRef: ViewContainerRef//, private componentFactoryResolver: ComponentFactoryResolver
    ) {}

  ngOnInit() {
    // Para la versión previa a la 13
    /*const tab: Tab = this.tab;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      tab.component
    )
    const viewContainerRef = this.contentContainer.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as SkeletonComponent).data = tab.tabData;*/
    
    // Nueva versión >13
    const componentRef = this.viewContainerRef.createComponent(this.tab.component);
    (componentRef.instance as SkeletonComponent).data = this.tab.tabData;
  }
}
