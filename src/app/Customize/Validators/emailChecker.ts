import { AbstractControl, ValidationErrors } from "@angular/forms";

export function isValidEmail(email: AbstractControl): ValidationErrors | null {
  var regex = /[a-z]/;
  if (
    email.value.length > 0 &&
    !email.value
      .split("@")[0]
      .split("")
      .some((l) => regex.test(l))
  ) {
    return {
      isValidEmail: true,
    };
  }
  return null;
}
