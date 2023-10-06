import { Injectable } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  constructor() {}

  validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);

      if (control instanceof UntypedFormControl) {
        control?.markAsTouched({ onlySelf: true });
        return;
      }

      if (
        control instanceof UntypedFormGroup ||
        control instanceof UntypedFormArray
      ) {
        control?.markAsTouched({ onlySelf: true });
        this.validateAllFormFields(control);
      }
    });
  }

  getErrorMessage(formGroup: UntypedFormGroup, fieldName: string) {
    const field = formGroup.get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }

  public getErrorMessageFromField(field: UntypedFormControl) {
    if (field?.hasError('required')) {
      return 'Required field';
    }

    if (field?.hasError('minlength')) {
      const requiredLength = field.errors
        ? field.errors['minlength']['requiredLength']
        : 5;
      return `Minimum length needs to be ${requiredLength}`;
    }

    if (field?.hasError('maxlength')) {
      const requiredLength = field.errors
        ? field.errors['maxlength']['requiredLength']
        : 100;
      return `Maximum length needs to be ${requiredLength}`;
    }

    return 'Invalid field';
  }

  public getFormArrayFieldErrorMessage(
    formGroup: UntypedFormGroup,
    formArrayName: string,
    fieldName: string,
    index: number
  ) {
    const formArray = formGroup.get(formArrayName) as UntypedFormArray;

    const field = formArray.controls[index].get(
      fieldName
    ) as UntypedFormControl;

    return this.getErrorMessageFromField(field);
  }

  public isFormArrayRequired(
    formGroup: UntypedFormGroup,
    formArrayName: string
  ) {
    const formArray = formGroup.get(formArrayName) as UntypedFormArray;

    return (
      !formArray.valid && formArray.hasError('required') && formArray.touched
    );
  }
}
