import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false,
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;
  loading = false;
  loginError = false;

  username = '';
  password = '';
  message = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['admin', Validators.required],
      password: ['1234', Validators.required],
    });
  }

  async onLogin() {
    const result = await this.authService.login(this.username, this.password);
    if (result.success) {
      this.message = 'Login exitoso ✅';
      // Redirigir a dashboard o página principal
      this.router.navigate(['/dashboard']);
    } else {
      this.message = result.message ?? 'Login fallido ❌';
    }
  }

}

