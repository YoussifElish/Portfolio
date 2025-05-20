import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Project interface for API integration
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  features: string[];
  status: string;
  date: string;
  link?: string;
  liveDemo: string | null;
  sourceCode: string | null;
}

// Extended Project interface for form submissions
export interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  features: string[];
  status: string;
  date?: string;
  imageFile?: File;
  removeExistingImage?: boolean;
  liveDemo?: string | null;
  sourceCode?: string | null;
}

// Contact request interface for API integration
export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

// Login request interface
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response interface
export interface LoginResponse {
  success: boolean;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://elish-portfolio.runasp.net/api';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('ApiService initialized ✅');
  }

  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  // Project API methods
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/Projects`, { headers: this.getAuthHeaders() })
      .pipe(
        map(projects => {
          return projects.map(project => ({
            ...project,
            link: `/projects/${project.id}`,
            liveDemo: project.liveDemo || null,
            sourceCode: project.sourceCode || null
          }));
        }),
        catchError(error => {
          console.error('Error fetching projects:', error);
          return throwError(() => error);
        })
      );
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/Projects/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(project => ({
          ...project,
          link: `/projects/${project.id}`,
          liveDemo: project.liveDemo || null,
          sourceCode: project.sourceCode || null
        })),
        catchError(error => {
          console.error(`Error fetching project ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  createProject(project: ProjectFormData): Observable<Project> {
    const formData = new FormData();

    formData.append('title', project.title);
    formData.append('description', project.description);

    // Handle image file upload
    if (project.imageFile) {
      formData.append('imageFile', project.imageFile);
    } else if (project.image) {
      formData.append('image', project.image);
    }

    // Handle arrays
    if (project.technologies && project.technologies.length > 0) {
      project.technologies.forEach((tech, index) => {
        formData.append(`technologies[${index}]`, tech);
      });
    }

    if (project.features && project.features.length > 0) {
      project.features.forEach((feature, index) => {
        formData.append(`features[${index}]`, feature);
      });
    }

    formData.append('status', project.status);

    // Handle liveDemo and sourceCode
    if (project.liveDemo !== undefined) {
      formData.append('liveDemo', project.liveDemo || '');
    }
    if (project.sourceCode !== undefined) {
      formData.append('sourceCode', project.sourceCode || '');
    }

    return this.http.post<Project>(`${this.apiUrl}/Projects`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(project => ({
        ...project,
        link: `/projects/${project.id}`,
        liveDemo: project.liveDemo || null,
        sourceCode: project.sourceCode || null
      })),
      catchError(error => {
        console.error('Error creating project:', error);
        return throwError(() => error);
      })
    );
  }

  updateProject(id: number, project: Partial<ProjectFormData>): Observable<Project> {
    const formData = new FormData();

    if (project.title !== undefined) {
      formData.append('title', project.title);
    }

    if (project.description !== undefined) {
      formData.append('description', project.description);
    }

    // Handle image file upload
    if (project.imageFile) {
      formData.append('imageFile', project.imageFile);
    } else if (project.image !== undefined) {
      formData.append('image', project.image);
    }

    // Handle removeExistingImage flag
    if (project.removeExistingImage) {
      formData.append('removeExistingImage', 'true');
    }

    // Handle arrays
    if (project.technologies && project.technologies.length > 0) {
      project.technologies.forEach((tech, index) => {
        formData.append(`technologies[${index}]`, tech);
      });
    }

    if (project.features && project.features.length > 0) {
      project.features.forEach((feature, index) => {
        formData.append(`features[${index}]`, feature);
      });
    }

    if (project.status !== undefined) {
      formData.append('status', project.status);
    }

    // Handle liveDemo and sourceCode
    if (project.liveDemo !== undefined) {
      formData.append('liveDemo', project.liveDemo || '');
    }
    if (project.sourceCode !== undefined) {
      formData.append('sourceCode', project.sourceCode || '');
    }

    return this.http.put<Project>(`${this.apiUrl}/Projects/${id}`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(project => ({
        ...project,
        link: `/projects/${project.id}`,
        liveDemo: project.liveDemo || null,
        sourceCode: project.sourceCode || null
      })),
      catchError(error => {
        console.error(`Error updating project ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Projects/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error deleting project ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Contact API methods
  getContactRequests(): Observable<ContactRequest[]> {
    return this.http.get<ContactRequest[]>(`${this.apiUrl}/ContactRequests`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error fetching contact requests:', error);
        return throwError(() => error);
      })
    );
  }

  getContactRequestById(id: number): Observable<ContactRequest> {
    return this.http.get<ContactRequest>(`${this.apiUrl}/ContactRequests/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error fetching contact request ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  markAsRead(id: number): Observable<ContactRequest> {
    return this.http.patch<ContactRequest>(`${this.apiUrl}/ContactRequests/${id}/read`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error marking contact request ${id} as read:`, error);
        return throwError(() => error);
      })
    );
  }

  markAsUnread(id: number): Observable<ContactRequest> {
    return this.http.patch<ContactRequest>(`${this.apiUrl}/ContactRequests/${id}/unread`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error marking contact request ${id} as unread:`, error);
        return throwError(() => error);
      })
    );
  }

  deleteContactRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ContactRequests/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error deleting contact request ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Authentication API methods
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<any>(`${this.apiUrl}/Auth/login`, { email, password })
      .pipe(
        map(response => {
          if (response && response.token) {
            localStorage.setItem('auth_token', response.token);
            return { success: true, token: response.token };
          }
          return { success: false };
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  // Contact form submission
  submitContactForm(formData: { name: string, email: string, subject: string, message: string }): Observable<{ success: boolean }> {
    return this.http.post<any>(`${this.apiUrl}/ContactRequests`, formData)
      .pipe(
        map(() => ({ success: true })),
        catchError(error => {
          console.error('Error submitting contact form:', error);
          return throwError(() => error);
        })
      );
  }
}