import { Component, Input, OnInit, ViewContainerRef } from "@angular/core";
import { SkeletonComponent } from "./skeleton.component";
import { Tab } from "../../../modelos/comun/tab.model";

@Component({
  selector: "app-tab-content",
  template: "<ng-template content-container></ng-template>"
})

export class TabContentComponent implements OnInit {

  @Input() tab: Tab;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    const componentRef = this.viewContainerRef.createComponent(this.tab.component);
    (componentRef.instance as SkeletonComponent).data = this.tab.tabData;
  }
}
