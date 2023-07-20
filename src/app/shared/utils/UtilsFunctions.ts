import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilsFunctions {
  constructor(private snackBar: MatSnackBar) { }

  showSnack(message: string, action = '', config: MatSnackBarConfig = {}) {
    this.snackBar.open(message, action, { duration: 5000, ...config, });
  }
}
