import { Routes } from '@angular/router';
import { LoginComponent } from './admin/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ProjectManagementComponent } from './admin/project-management/project-management.component';
import { ContactRequestsComponent } from './admin/contact-requests/contact-requests.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/project-management', component: ProjectManagementComponent },
  { path: 'admin/contact-requests', component: ContactRequestsComponent },
  { path: '**', redirectTo: '' }
];
