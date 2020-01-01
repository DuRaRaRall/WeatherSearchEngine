import { ValidatorFn, AbstractControl } from "@angular/forms";

export function noSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): 
    {[key: string]: any} => {
        if(control.value){
            if(control.value.trim().length !== 0){
                return null;
            }
        }
        return {'whitespace': 'input only contains whitespace'};
    };
}