import { AbstractControl } from "@angular/forms";

  export function onlyLettersRegex(control: AbstractControl) {
    const regex = /^[\p{L}\s]+$/gu;
  
    if (regex.test(control.value)) {
      return null; // Validation successful
    }
  
    return { letterValidate: true }; // Validation failed
  }