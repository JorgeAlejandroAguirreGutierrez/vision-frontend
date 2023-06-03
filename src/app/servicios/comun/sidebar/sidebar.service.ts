import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  isSidebarPinned = false;
  isSidebarToggeled = false;

  isSidebarVisible: boolean = true;
  sidebarVisibilityChange: Subject<boolean> = new Subject<boolean>();

  constructor() { 
    this.sidebarVisibilityChange.subscribe((value) => {
      this.isSidebarVisible = value
    });
  }

  toggleSidebarVisibility() {
    this.sidebarVisibilityChange.next(!this.isSidebarVisible);
  }

  toggleSidebar() {
    this.isSidebarToggeled = ! this.isSidebarToggeled;
  }

  toggleSidebarPin() {
    this.isSidebarPinned = ! this.isSidebarPinned;
  }

  getSidebarStat() {
    return {
      isSidebarPinned: this.isSidebarPinned,
      isSidebarToggeled: this.isSidebarToggeled,
    }
  }

}
