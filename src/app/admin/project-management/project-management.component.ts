import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService, Project, ProjectFormData } from '../../services/api.service';

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss']
})
export class ProjectManagementComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  error = false;

  projectForm: FormGroup;
  isEditing = false;
  currentProjectId: number | null = null;
  showForm = false;
  formSubmitting = false;
  formError = '';

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  removeExistingImage = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    // Initialize form with liveDemo and sourceCode as optional fields with URL validation
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      technologies: ['', Validators.required],
      features: ['', Validators.required],
      status: ['Published', Validators.required],
      liveDemo: ['', [Validators.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)]],
      sourceCode: ['', [Validators.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)]]
    });
  }

  ngOnInit(): void {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.router.navigate(['/admin/login']);
      return;
    }

    // Load projects from API
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = false;

    this.apiService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/admin/login']);
  }

  addNewProject(): void {
    this.isEditing = false;
    this.currentProjectId = null;
    this.projectForm.reset({
      status: 'Published',
      liveDemo: '',
      sourceCode: ''
    });
    this.selectedFile = null;
    this.selectedFileName = '';
    this.removeExistingImage = false;
    this.showForm = true;
  }

  editProject(project: Project): void {
    this.isEditing = true;
    this.currentProjectId = project.id;

    this.projectForm.setValue({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      features: project.features.join('\n'),
      status: project.status,
      liveDemo: project.liveDemo || '',
      sourceCode: project.sourceCode || ''
    });

    this.selectedFile = null;
    this.selectedFileName = '';
    this.removeExistingImage = false;
    this.showForm = true;
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.apiService.deleteProject(id).subscribe({
        next: () => {
          this.loadProjects(); // Reload projects after deletion
        },
        error: (error) => {
          console.error(`Error deleting project ${id}:`, error);
          alert('Failed to delete project. Please try again.');
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.removeExistingImage = false;
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  removeImage(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.removeExistingImage = true;
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      return;
    }

    this.formSubmitting = true;
    this.formError = '';

    const formValues = this.projectForm.value;

    // Prepare project data
    const projectData: ProjectFormData = {
      title: formValues.title,
      description: formValues.description,
      technologies: formValues.technologies.split(',').map((tech: string) => tech.trim()),
      features: formValues.features.split('\n').filter((feature: string) => feature.trim() !== ''),
      status: formValues.status,
      image: '', // Required by the interface but will be set by the backend
      liveDemo: formValues.liveDemo || null,
      sourceCode: formValues.sourceCode || null
    };

    // Add image file if selected
    if (this.selectedFile) {
      projectData.imageFile = this.selectedFile;
    }

    // Add removeExistingImage flag if needed
    if (this.removeExistingImage) {
      projectData.removeExistingImage = true;
    }

    if (this.isEditing && this.currentProjectId) {
      // Update existing project
      this.apiService.updateProject(this.currentProjectId, projectData).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.showForm = false;
          this.loadProjects(); // Reload projects after update
        },
        error: (error) => {
          console.error('Error updating project:', error);
          this.formError = 'Failed to update project. Please try again.';
          this.formSubmitting = false;
        }
      });
    } else {
      // Add new project
      this.apiService.createProject(projectData).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.showForm = false;
          this.loadProjects(); // Reload projects after creation
        },
        error: (error) => {
          console.error('Error creating project:', error);
          this.formError = 'Failed to create project. Please try again.';
          this.formSubmitting = false;
        }
      });
    }
  }
}