import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Project } from '../../services/api.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadProject();
  }

  loadProject() {
    this.loading = true;
    this.errorMessage = null;

    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          if (!id) {
            return of(null);
          }
          return this.apiService.getProjectById(+id).pipe(
            catchError(error => {
              console.error('Error fetching project:', error);
              return of(null);
            })
          );
        })
      )
      .subscribe({
        next: (project) => {
          this.loading = false;
          if (!project) {
            this.errorMessage = 'Project not found.';
            this.project = null;
            return;
          }
          if (project.status === 'Draft') {
            this.errorMessage = 'This project is not available.';
            this.project = null;
            return;
          }
          console.log('Project:', project); // Debug: Inspect liveDemo, sourceCode
          this.project = project;
        },
        error: (error) => {
          console.error('Error loading project:', error);
          this.loading = false;
          this.errorMessage = 'Failed to load project details. Please try again later.';
          this.project = null;
        }
      });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return ''; // Trigger placeholder for empty string
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `https://elish-portfolio.runasp.net/${imagePath}`;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none'; // Show placeholder
  }
}