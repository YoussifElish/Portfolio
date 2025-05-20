import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loginError = false;
  loading = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private apiService: ApiService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  get f() { 
    return this.loginForm.controls; 
  }
  
  onSubmit() {
    this.submitted = true;
    this.loginError = false;
    this.errorMessage = '';
    
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    const { email, password } = this.loginForm.value;
    
    this.apiService.login(email, password).subscribe({
      next: (response) => {
        if (response.success) {
          // Token is already stored in localStorage by the ApiService
          // Navigate to admin dashboard
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.loginError = true;
          this.errorMessage = 'Invalid credentials';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loginError = true;
        this.errorMessage = 'An error occurred during login. Please try again.';
        this.loading = false;
      }
    });
  }
}
