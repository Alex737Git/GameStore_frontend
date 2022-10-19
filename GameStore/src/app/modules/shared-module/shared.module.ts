import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionalBarComponent } from '../../components/funcional-bar/functional-bar.component';

@NgModule({
  declarations: [FunctionalBarComponent],
  imports: [CommonModule],
  exports: [FunctionalBarComponent],
})
export class SharedModule {}
