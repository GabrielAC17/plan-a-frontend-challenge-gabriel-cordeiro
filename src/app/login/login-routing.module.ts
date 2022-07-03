import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
            FormsModule, 
            ReactiveFormsModule],
  exports: [RouterModule,
            FormsModule,
            ReactiveFormsModule],
})
export class LoginPageRoutingModule {}
