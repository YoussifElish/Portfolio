import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService, Project, ContactRequest } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  username: string = 'Admin';
  stats = {
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    contactRequests: 0,
    newRequests: 0
  };
  
  recentProjects: Project[] = [];
  recentContacts: ContactRequest[] = [];
  
  loading = {
    projects: true,
    contacts: true
  };
  
  error = {
    projects: false,
    contacts: false
  };
  
  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}
  
  ngOnInit(): void {
    // Check if user is logged in by verifying token
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.router.navigate(['/admin/login']);
      return;
    }
    
    // Load data from API
    this.loadProjects();
    this.loadContactRequests();
  }
  
  loadProjects(): void {
    this.loading.projects = true;
    this.error.projects = false;
    
    this.apiService.getProjects().subscribe({
      next: (projects) => {
        this.recentProjects = projects.slice(0, 5); // Get only the 5 most recent projects
        
        // Update stats
        this.stats.totalProjects = projects.length;
        this.stats.publishedProjects = projects.filter(p => p.status === 'Published').length;
        this.stats.draftProjects = projects.filter(p => p.status === 'Draft').length;
        
        this.loading.projects = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.error.projects = true;
        this.loading.projects = false;
      }
    });
  }
  
  loadContactRequests(): void {
    this.loading.contacts = true;
    this.error.contacts = false;
    
    this.apiService.getContactRequests().subscribe({
      next: (contacts) => {
        this.recentContacts = contacts.slice(0, 5); // Get only the 5 most recent contacts
        
        // Update stats
        this.stats.contactRequests = contacts.length;
        this.stats.newRequests = contacts.filter(c => !c.read).length;
        
        this.loading.contacts = false;
      },
      error: (error) => {
        console.error('Error loading contact requests:', error);
        this.error.contacts = true;
        this.loading.contacts = false;
      }
    });
  }
  
  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/admin/login']);
  }
}
