import { AbstractControl, ValidationErrors } from "@angular/forms";

export function validateConfirmPassword(
  control1: AbstractControl,
  control2: AbstractControl
): boolean {
  if (control1.value == control2.value) {
    return true;
  }
  return false;
}
