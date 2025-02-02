import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFormatoDecimal]'
})
export class FormatoDecimalDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    const replacedValue = initalValue.replace(',', '.');
    this.el.nativeElement.value = replacedValue;
  }
}
