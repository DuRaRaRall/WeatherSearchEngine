import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from "@angular/forms";
import { noSpaceValidator } from "./no-spaces.validator";


@Directive({
  selector: '[appNoSpaces]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: NoSpacesDirective, multi: true}
  ]
})
export class NoSpacesDirective implements Validator{
  private no_space_validator = noSpaceValidator();
  validate(control: AbstractControl): { [key: string]: any } {
    return this.no_space_validator(control);
  }
  
  constructor() { 
    
  }

}
