import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../../services/electron.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false,
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  username: string = 'admin';
  password: string = 'admin123';
  message: string = '';

  constructor(
    private readonly electronService: ElectronService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) { }

  async onLogin() {
    this.message = '';
    if (!this.username.trim() || !this.password) {
      this.message = 'Completa usuario y contraseña';
      return;
    }
    try {
      const res = await this.electronService.login({ username: this.username, password: this.password });
      if (res.success) {
        this.snackBar.open('Bienvenido', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/dashboard']);
      } else {
        this.message = res.message || 'Credenciales incorrectas';
      }
    } catch (err) {
      console.error('Error login:', err);
      this.message = 'Error de conexión';
    }
  }
}
