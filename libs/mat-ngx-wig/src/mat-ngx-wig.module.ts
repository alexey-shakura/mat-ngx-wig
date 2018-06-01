import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgxWigModule } from 'ngx-wig';

import { MatNgxWigComponent } from './mat-ngx-wig/mat-ngx-wig.component';


@NgModule({
  imports: [
    A11yModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxWigModule,
    ReactiveFormsModule,
  ],
  declarations: [MatNgxWigComponent],
  exports: [MatNgxWigComponent]
})
export class MatNgxWigModule {}
