import { AbstractControl, ValidationErrors } from "@angular/forms";

export function isZeroValidation(
  input: AbstractControl
): ValidationErrors | null {
  if (
    input.value != null && input.value?.toString().length > 0 &&
    input.value <= 0
  ) {
    return {
      isZero: true,
    };
  }
  return null;
}
export function isnonZeroValidation(
  input: AbstractControl
): ValidationErrors | null {
  if (
    input.value != null && input.value?.toString().length > 0 &&
    input.value < 0
    
  ) {
    return {
      isZero: true,
    };
  }
  return null;
}
export function ischequeValidation(
  input: AbstractControl
): ValidationErrors | null {
  if (
    (input.value && input.value?.length > 0 && input.value?.length != 6) ||
    input.value?.split("").every((x) => x == "0")
  ) {
    return {
      isCheque: true,
    };
  }
  return null;
}
