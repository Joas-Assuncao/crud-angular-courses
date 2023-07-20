import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppMaterialModule } from './app-material.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { CategoryPipe } from './pipes/category.pipe';

@NgModule({
  declarations: [
    ErrorDialogComponent,
    ConfirmDialogComponent,
    CategoryPipe,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  exports: [
    ErrorDialogComponent,
    ConfirmDialogComponent,
    CategoryPipe,
  ]
})
export class SharedModule { }
