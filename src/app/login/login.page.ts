import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginResponse } from 'src/Models/Login/LoginResponse';
import { LoginService } from '../api/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showError: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService) { }

  loginForm = this.formBuilder.group({
    email: new FormControl('', Validators.compose([
      Validators.required,
      // Validators.email
    ])),
    password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(6)
    ]))
  });

  ngOnInit() {
  }

  onSubmit(): void {
    this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).then((response: LoginResponse) => {
      this.loginService.saveLoginInfoAndRedirect(response);
    }).catch((error) => {
      this.showError = true;
    });
  }

}
