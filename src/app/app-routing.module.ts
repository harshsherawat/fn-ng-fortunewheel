import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FortuneWheelComponent } from './fortune-wheel/fortune-wheel.component';

const routes: Routes = [
  { path: 'fortune-wheel', component: FortuneWheelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
