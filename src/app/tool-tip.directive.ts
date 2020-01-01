import { Directive, AfterViewInit, ElementRef } from '@angular/core';
import { element } from 'protractor';

declare var $:any;

@Directive({
  selector:'[tooltipb]'
})
export class ToolTipDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) {

  }

  ngAfterViewInit() {
    // Wait for Dom Element rendering, then elementRef represent DOM element from where Directive is bootstraped.
    $(this.elementRef.nativeElement).tooltip({placement: 'bottom'});
    var element = this.elementRef.nativeElement
    element.addEventListener("click", function(){
      $(element).tooltip('dispose');
    });
  }
}